import React, { useState } from "react"
import { WidgetHeader } from "../components/widget-header"
import { Button } from "@workspace/ui/components/button"
import { ChevronRightIcon, MessageSquareIcon } from "lucide-react"
import { useAtomValue, useSetAtom } from "jotai"
import {
  contactSessionIdAtomFamilly,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { set } from "zod"
import { fi } from "zod/locales"

const WidgetSelectionScreen = () => {
  const setConversationId = useSetAtom(conversationIdAtom)
  const setScreen = useSetAtom(screenAtom)
  const organizationId = useAtomValue(organizationIdAtom)
  const setErrorMessage = useSetAtom(errorMessageAtom)
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamilly(organizationId ?? "")
  )
  const [isPending, setIsPending] = useState(false)
  const createConversation = useMutation(api.public.conversations.create)
  const handleNewConversation = async () => {
    setIsPending(true)
    if (!organizationId) {
      setScreen("error")
      setErrorMessage("organization id is missing")
      return
    }
    if (!contactSessionId) {
      setScreen("auth")
    }
    try {
      if (!contactSessionId) {
        throw new Error("Contact session ID is missing")
      }

      const conversationId = await createConversation({
        organizationId,
        contactSessionId,
      })
      console.log("conversation id", conversationId)

      setConversationId(conversationId)
      setScreen("chat")
    } catch (error) {
      console.error("Error creating conversation:", error)
      // setErrorMessage("unable to create conversation")
      setScreen("auth")
    } finally {
      setIsPending(false)
    }
  }
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between px-2 py-1">
          <p className="text-3xl font-semibold">hey there👌 </p>
          <p className="font-ligth text-lg"> let &apos; s get you started </p>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-4 text-lg font-extrabold">Selection Screen</p>
        <Button
          disabled={isPending}
          className="h-16 w-full justify-between"
          variant="outline"
          onClick={handleNewConversation}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareIcon className="size-4" />
            <span>start chat</span>
          </div>
          <ChevronRightIcon className="" />
        </Button>
      </div>
    </>
  )
}

export default WidgetSelectionScreen
