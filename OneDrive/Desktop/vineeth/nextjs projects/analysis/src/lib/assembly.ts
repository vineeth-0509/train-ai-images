// this file is the longest part of the running, here we sending the orders to the ja servers they gonna download it and run it to the ai model and then
// they will send the results back to us.

import { AssemblyAI } from "assemblyai";
import dotenfv from "dotenv";
dotenfv.config();
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! });

function msToTime(ms: number) {
  const seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60);
  const reaminingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${reaminingSeconds.toString().padStart(2, "0")}`;
}

// we are passing the meeting url in to the assembly ai
export const processMeeting = async (meetingUrl: string) => {
  //we get the whole transcripts of the assembly ai.
  const transcript = await client.transcripts.transcribe({
    audio: meetingUrl,
    auto_chapters: true, // by enabling this as true, we will automatically classify different issues and summerise what happens during the meeting
  });

  // here we are getting the ai summarization of the meeting of various files.
  // here the structure of the summary we are getting  which is we developed a schema for the summary of the meeting, where assembly ai returning us the same thing, so we can save it in the database.

  const summaries =
    transcript.chapters?.map((chapter) => ({
      start: msToTime(chapter.start),
      end: msToTime(chapter.end),
      gist: chapter.gist,
      headline: chapter.headline,
      summary: chapter.summary,
    })) || [];
  if (!transcript.text) throw new Error("No transcript found");

  return {
    summaries,
  };
};

// const FILE_URL = "https://assembly.ai/sports_injuries.mp3";

// const response = await processMeeting(FILE_URL);
// console.log(response);

/*
1.uploading to the firebase
2. getting the url of the file
3. create a meeting
4. hitting /api/process-meeting route and getting the url and then sending it to the assembly ai and then getting the  issues


*/
