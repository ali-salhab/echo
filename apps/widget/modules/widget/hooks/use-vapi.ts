"use client"
import Vapi from "@vapi-ai/web"
import { useState, useEffect } from "react"

interface TranscriptMessage {
  role: "user" | "assistant" | "system"
  text: string
}
export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [isConnected, setIsConnected] = useState<Boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<Boolean>(false)
  const [isConnecting, setIsConnecting] = useState<Boolean>(false)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  useEffect(() => {
    // only for testing in the production customers will provide thier own api key from vapi
    const vapiInstance = new Vapi("6533c2ac-5a16-4e68-b2b3-1c47fabf8f07")
    setVapi(vapiInstance)
    vapiInstance.on("call-start", () => {
      setIsConnected(true)
      setIsConnecting(false)
      setTranscript([])
    })
    vapiInstance.on("call-end", () => {
      setIsConnected(false)
      setIsSpeaking(false)
      setIsConnecting(false)
    })
    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true)
    })
    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false)
    })
    vapiInstance.on("error", (error) => {
      //   console.log("Vapi error:", error)

      setIsConnecting(false)
    })
    vapiInstance.on("message", (message) => {
      console.log("Vapi message:00000000000000????>", message)
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((pre) => {
          return [
            ...pre,

            {
              role: message.role === "user" ? "user" : "assistant",

              text: message.transcript,
            },
          ]
        })
      }
    })
    return () => {
      vapiInstance?.stop()
    }
  }, [])
  const endCall = () => {
    if (vapi) {
      vapi?.stop()
    }
  }
  //   this is a test comment
  const startCall = () => {
    setIsConnecting(true)
    // testng
    if (vapi) {
      vapi?.start("b0c56e81-e9e0-461e-9708-99a6dfa7753d")
    }
  }

  return {
    vapi,
    isConnecting,
    isSpeaking,
    transcript,

    isConnected,

    startCall,

    endCall,
  }
}
