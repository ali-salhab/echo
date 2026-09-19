import React, { use, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { ArrowLeftIcon, MicIcon, MicOffIcon } from "lucide-react"
import { useAtomValue, useSetAtom } from "jotai"
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ui/conversation"

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ui/message"
import { useVapi } from "@/modules/widget/hooks/use-vapi"
import { WidgetHeader } from "../components/widget-header"
import { screenAtom } from "@/modules/widget/atoms/widget-atoms"
import WidgetFooter from "../components/widget-footer"
import { cn } from "@workspace/ui/lib/utils"
export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const {
    isConnected,
    isSpeaking,
    transcript,
    startCall,
    isConnecting,
    endCall,
  } = useVapi()
  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2 px-2 py-1">
          <Button
            variant="trasparent"
            size="icon"
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <p>Voice Chat</p>
        </div>
      </WidgetHeader>
      {transcript.length > 0 ? (
        <AIConversation className="h-full flex-1">
          <AIConversationContent>
            {transcript.map((message, index) => (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={`${message.role}-${index}-${message.text}`}
              >
                <AIMessageContent>{message.text}</AIMessageContent>
              </AIMessage>
            ))}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <div className="flex items-center justify-center rounded-full border bg-white p-3">
            <MicIcon className="size-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">transcript will appear here</p>
        </div>
      )}

      <div className="border-t bg-background p-4">
        <div className="flex flex-col items-center gap-y-4">
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-3 rounded-full",
                  isSpeaking ? "animate-pulse bg-red-500" : "bg-green-500"
                )}
              />
              <span className="text-sm text-muted-foreground">
                {isSpeaking ? "Assistant is speaking..." : "Listening..."}
              </span>
            </div>
          )}
          <div className="flex w-full justify-center">
            {isConnected ? (
              <Button
                className="w-full"
                onClick={() => endCall()}
                variant={"destructive"}
                // disabled={isConnecting}
              >
                <MicOffIcon />
                End Call
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => startCall()}
                // disabled={isConnecting}
              >
                <MicIcon />
                Start Call
              </Button>
            )}
          </div>
        </div>
      </div>
      <WidgetFooter />
    </>
  )
}
