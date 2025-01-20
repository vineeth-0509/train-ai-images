// import { db } from "@/server/db";
// import { Octokit } from "octokit";
// import axios from "axios";
// import { aiSummariseCommit } from "./gemini";
// export const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN,
// });
// const githubUrl = "https://github.com/vineeth-0509/resume-builder";

// interface Response {
//   commitHash: string;
//   commitMessage: string;
//   commitAuthorName: string;
//   commitAuthorAvatar: string;
//   commitDate: string;
// }

// export const getCommitHashes = async (
//   githubUrl: string,
// ): Promise<Response[]> => {
//   const [owner, repo] = githubUrl.split("/").slice(-2);
//   if (!owner || !repo) {
//     throw new Error("Invalid github url");
//   }
//   // const response = await octokit.request(`GET/repos/${owner}/${repo}/commits`);
//   // return response.data.map((commit)=>({

//   // }))
//   const { data } = await octokit.rest.repos.listCommits({
//     owner,
//     repo,
//   });
//   const sortedCommits = data.sort(
//     (a: any, b: any) =>
//       new Date(b.commit.author.date).getTime() -
//       new Date(a.commit.author.date).getTime(),
//   ) as any[];
//   return sortedCommits.slice(0, 10).map((commit: any) => ({
//     commitHash: commit.sha as string,
//     commitMessage: (commit.commit?.message as string) ?? "",
//     commitAuthorName: (commit.commit?.author?.name as string) ?? "",
//     commitAuthorAvatar: commit?.author?.avatar_url ?? "",
//     commitDate: commit.commit?.author.date ?? "",
//   }));
// };

// export const pollCommits = async (projectId: string) => {
//   const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
//   const commitHashes = await getCommitHashes(githubUrl);
//   const unprocessedCommits = await filterUnprocessedCommits(
//     projectId,
//     commitHashes,
//   );
//   const summaryResponses = await Promise.allSettled(
//     unprocessedCommits.map((commit) => {
//       return summariseCommit(githubUrl, commit.commitHash);
//     }),
//   );
//   const summaries = summaryResponses.map((response) => {
//     if (response.status === "fulfilled") {
//       return response.value as string;
//     }
//     return "";
//   });
//   const commit = await db.commit.createMany({
//     data: summaries.map((summary, index) => {
//       console.log(`Processing commits ${index}`);
//       return {
//         projectId: projectId,
//         commitHash: unprocessedCommits[index]!.commitHash,
//         commitMessage: unprocessedCommits[index]!.commitMessage,
//         commitAuthor: unprocessedCommits[index]!.commitAuthorName, // Added commitAuthor
//         commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
//         commitDate: unprocessedCommits[index]!.commitDate,
//         summary,
//       };
//     }),
//   });
//   return commit;
// };

// async function summariseCommit(githubUrl: string, commitHash: string) {
//   //get the diff and pass the diff in to the ai.
//   const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
//     headers: {
//       Accept: "application/vnd.github.v3.diff",
//     },
//   });
//   return (await aiSummariseCommit(data)) || "";
// }

// async function fetchProjectGithubUrl(projectId: string) {
//   const project = await db.project.findUnique({
//     where: {
//       id: projectId,
//     },
//     select: {
//       githubUrl: true,
//     },
//   });
//   if (!project?.githubUrl) {
//     throw new Error("Project has no github url");
//   }
//   return { project, githubUrl: project?.githubUrl };
// }

// async function filterUnprocessedCommits(
//   projectId: string,
//   commitHashes: Response[],
// ) {
//   const processedCommits = await db.commit.findMany({
//     where: { projectId },
//   });

//   const unprocessedCommits = commitHashes.filter(
//     (commit) =>
//       !processedCommits.some(
//         (processedCommit) => processedCommit.commitHash === commit.commitHash,
//       ),
//   );
//   return unprocessedCommits;
// }

// await pollCommits("cm634c002000010hq1ejxdj5e").then(console.log);
// //https://chatgpt.com/share/678c9b26-a0b4-800f-bd5a-456f47d0c51d

import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
//const githubUrl = "https://github.com/vineeth-0509/resume-builder";

interface Response {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
}

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo) {
    throw new Error("Invalid github url");
  }
  // const response = await octokit.request(`GET/repos/${owner}/${repo}/commits`);
  // return response.data.map((commit)=>({

  // }))
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });
  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  ) as any[];
  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: (commit.commit?.message as string) ?? "",
    commitAuthorName: (commit.commit?.author?.name as string) ?? "",
    commitAuthorAvatar: commit?.author?.avatar_url ?? "",
    commitDate: commit.commit?.author.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );
  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summariseCommit(githubUrl, commit.commitHash);
    }),
  );
  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });
  const commit = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      console.log(`Processing commits ${index}`);
      return {
        projectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthor: unprocessedCommits[index]!.commitAuthorName, // Added commitAuthor
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      };
    }),
  });
  return commit;
};

async function summariseCommit(githubUrl: string, commitHash: string) {
  //get the diff and pass the diff in to the ai.
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  return (await aiSummariseCommit(data)) || "";
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });
  if (!project) {
    throw new Error(`Project with Id ${projectId} deos not exist`);
  }
  if (!project?.githubUrl) {
    throw new Error("Project has no github url");
  }
  return { project, githubUrl: project.githubUrl };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );
  return unprocessedCommits;
}

await pollCommits("cm6515psv0009z7t8wx6ub2j9").then(console.log);
//https://chatgpt.com/share/678c9b26-a0b4-800f-bd5a-456f47d0c51d
