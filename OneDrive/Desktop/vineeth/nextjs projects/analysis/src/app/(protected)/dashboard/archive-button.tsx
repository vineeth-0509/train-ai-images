"use client";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import React from "react";
import { toast } from "sonner";

const ArchiveButton = () => {
  const { projectId } = useProject();
  const refetch = useRefetch();
  const archiveProject = api.project.archiveProject.useMutation();
  return (
    <Button
      disabled={archiveProject.isPending}
      size="sm"
      variant="destructive"
      className="mr-2"
      onClick={() => {
        const confirm = window.confirm(
          "are you sure you want to archive this project?",
        );
        if (confirm) {
          archiveProject.mutate(
            { projectId: projectId },
            {
              onSuccess: () => {
                toast.success("project archived");
                refetch();
              },
              onError: () => {
                toast.error("error archiving project");
              },
            },
          );
        }
      }}
    >
      Archive
    </Button>
  );
};

export default ArchiveButton;
