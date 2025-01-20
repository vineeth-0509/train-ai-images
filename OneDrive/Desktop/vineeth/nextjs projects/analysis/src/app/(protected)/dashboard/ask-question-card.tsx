"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [filesReferences, setFilesReferences] = useState<{fileName:string; sourceCode: string; summary:string}[]>([])
  const [answer, setAnswer] = useState('')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) return;
    setOpen(true);
    const {output, filesReferences} = await askQuestion(question, project.id)
    setFilesReferences(filesReferences)

    for await( const delta of readStreamableValue(output)){
        if(delta) {
            setAnswer(ans => ans + delta) //this creates the streaming sequence of tokens comming 1 after one.
        }
    }
    setLoading(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Image src="/logo.png" alt="analysis" width={40} height={40} />
            </DialogTitle>
          </DialogHeader>
          {answer}
          <h1>File References</h1>
            {filesReferences.map(file => {
                return <span>
                  {file.fileName} 
                </span>
            })}
          
        </DialogContent>
      </Dialog>
      <Card className="ralative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
          <CardContent>
            <form onSubmit={onSubmit}>
              <Textarea
                placeholder="Which file should I edit to change the home page?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className="mt-2 h-4">
                <Button>Ask Analysis!</Button>
              </div>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default AskQuestionCard;
