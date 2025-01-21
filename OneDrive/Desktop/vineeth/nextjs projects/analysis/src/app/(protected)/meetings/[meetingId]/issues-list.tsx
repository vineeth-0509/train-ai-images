"use client"

import { api } from "@/trpc/react"
import { VideoIcon } from "lucide-react"

type Props = {
    meetingId: string
}
const IssuesList = ({meetingId}: Props)=> {
const { data: meeting, isLoading} = api.project.getMeetingById.useQuery({meetingId}, {
    refetchInterval : 4000
})
if(isLoading || !meeting) return <div> Loading...</div>
    return (
        <>
        <div className='p-8'>
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
                  <div className='flex items-center gap-x-6'>
                    <div className="rounded-full border bg-white p-3">
                        <VideoIcon className='h-6 w-6'/>

                    </div>
                    <h1 >
                        <div className="text-sm leading-6 text-gray-600">
                            Meeting on {""}{meeting.createdAt.toLocaleDateString()}
                        </div>
                        <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                            {meeting.name}

                        </div>
                    </h1>

                    </div>
            </div>

        </div>
        </>
    )
}

export default IssuesList