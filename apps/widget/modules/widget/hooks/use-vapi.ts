"use client"
import Vapi from "@vapi-ai/web"
import { useAtomValue } from "jotai"
import { useState, useEffect } from "react"
import { vapiSecretsAtom, widgetSettingsAtom } from "../atoms/widget-atoms"

interface TranscriptMessage {
  role: "user" | "assistant" | "system"
  text: string
}
export const useVapi = () => {
  const vapiSecrets = useAtomValue(vapiSecretsAtom)
  const widgetSettings = useAtomValue(widgetSettingsAtom)
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [isConnected, setIsConnected] = useState<Boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<Boolean>(false)
  const [isConnecting, setIsConnecting] = useState<Boolean>(false)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  useEffect(() => {
    if (!vapiSecrets) {
      return
    }
    const vapiInstance = new Vapi(vapiSecrets.publicApiKey)
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
    if (!vapiSecrets || !widgetSettings?.vapiSettings.assistantId) {
      return
    }
    setIsConnecting(true)

    if (vapi) {
      vapi?.start(widgetSettings?.vapiSettings.assistantId)
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
