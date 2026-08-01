"use client"

import React, { use } from "react"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { useVapi } from "@/modules/widget/hooks/use-vapi"
import { Button } from "@workspace/ui/components/button"
export default function Page() {
  const {
    vapi,
    isConnecting,
    isSpeaking,
    transcript,
    isConnected,
    startCall,
    endCall,
  } = useVapi()
  return (
    <div className="flex min-h-screen flex-col bg-amber-500 p-6">
      <Button onClick={startCall}>Start Call</Button>
      <Button onClick={endCall}>End Call</Button>
      <p>isConnecting: {isConnecting.toString()}</p>
      <p>isSpeaking: {isSpeaking.toString()}</p>
      <p>isConnected: {isConnected.toString()}</p>
      <p>{JSON.stringify(transcript, null, 2)}</p>
    </div>
  )
}
