//api/process-meeting  //here we are sending the meeting Url to the assembly ai and getting the results back and then saving it to the database.
import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const bodyParser = z.object({
  meetingId: z.string(),
  projectId: z.string(),
  meetingUrl: z.string(),
});

export const maxDuration = 60; //5minutes

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }
  try {
    const body = await req.json();
    const { meetingUrl, meetingId } = bodyParser.parse(body);
    const { summaries } = await processMeeting(meetingUrl);
    // we create all the issues and link it to the meetingId.
    await db.issue.createMany({
      data: summaries.map((summary) => ({
        start: summary.start,
        end: summary.end,
        gist: summary.gist,
        headline: summary.headline,
        summary: summary.summary,
        meetingId,
      })),
    });
    await db.meeting.update({
      // at first our meeting status is processing based on the cretaed summary we are creating the issues and then
      // we are updating the status to completed based on the meetingId.
      where: { id: meetingId },
      data: {
        status: "COMPLETED",
        name: summaries[0]!.headline,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 },
    );
  }
}
