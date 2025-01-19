"use client";
import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";

const DashboardPage = () => {
  // const { user } = useUser(); //it provides access to the current users object, which contains all the data for a single user in your application and provides methods to manage their account.
  const { project } = useProject();
  return (
    <div>
      {project?.id}
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* github link */}
        <div className="m-4 w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project is linked to{" "}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="h-4"></div>
        <div className="flex items-center gap-4">
          TeamMembers InviteButton Archive
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4">
          AskQuestionCard MeetingCard
        </div>
      </div>

      <div className="mt-8">
        <CommitLog/>
      </div>
    </div>
  );
};

export default DashboardPage;
