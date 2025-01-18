"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormInput {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
}
export default function createPage() {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();
  function onSubmit(data: FormInput) {
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          refetch();
          reset();
        },
        onError: () => {
          toast.error("Failed to create a project");
        },
      },
    );
    return true;
  }

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/code-thinking.svg"
        alt="Image"
        width={10}
        height={10}
        className="h-40 w-auto animate-bounce"
      />
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your Github Repository.
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to the analysis
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Github URL"
              type="url"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="Github Token (Optional)"
            />
            <div className="h-4"></div>
            <Button
              type="submit"
              disabled={createProject.isPending}
              className="bg-blue-700 font-bold text-white hover:bg-blue-700 hover:text-white"
            >
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
