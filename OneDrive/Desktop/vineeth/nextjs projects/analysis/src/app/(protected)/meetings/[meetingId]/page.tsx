import React from 'react'
import IssuesList from './issues-list'

type Props = {
    //in nextjs 15 we not just destrcture the params
    params: Promise<{meetingId: string}>
}

const MeetingDetailPage = async ({params}: Props) => {
    const {meetingId} = await params
  return (
    <IssuesList meetingId={meetingId}/>
  )
}

export default MeetingDetailPage