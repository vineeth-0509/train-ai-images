# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

//useful links:
https://github.com/aishwaryanr/awesome-generative-ai-guide/blob/main/research_updates/rag_research_table.md

//chatgpt link:
https://chatgpt.com/share/678b827f-0738-800f-b6c1-1fc1c68d3dd5

know these:
ring-1 ring-inset ring-gray-200

//informative techs
usehooks-ts -> this gives the very
-useQueryClient from tanstack/react-Query
-octokit -> using octokit can interact with the repository and commit history of the certain repository.

langchains : allows us to work with llms and also with the structured data.

2.12
2.20
rag:2.31 we are retrieving the relevant stuff and putting the relevant documents in the context of ai . so, we effectively agumenting the generation,we are chaing the generation.
2.36 to get the agumented generation.
-> first convert the query to an vector embedding.and do a vector similarity search for the top 10 files or the top 100 files. we take the contents of the all top 10 files and insert in to the ai prompt and stream back the answer into the ui.
2.38 installing the streaming work
2.39
// @uiw/react-md-editor this is best to display the outputs of ai.
//react-syntax-highlighter
// @types/react-syntax-highlighter

assemblu-ai 3.13
react-dropzone used to drag and drop and upload files.
3.20 we upload to the firebase server and storing in the firebase server and server returns us with a url of the audio, we save the urk in db next. with name, status: processing / completed, url, summaries.
-> we take the url of the mp3 nad put in to assemblyai which gives us back list of issues and we update the metting with the status on the issues.

-> npm i react-circular-progressbar

3.44 //assembly ai
