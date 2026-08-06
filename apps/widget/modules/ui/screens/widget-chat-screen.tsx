import React from "react"

import { WidgetHeader } from "../components/widget-header"
import { Button } from "@workspace/ui/components/button"
import { ArrowLeftIcon, MenuIcon } from "lucide-react"
import { useAtomValue, useSetAtom } from "jotai"
import {
  contactSessionIdAtomFamilly,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const setConversatioId = useSetAtom(conversationIdAtom)
  const organizationId = useAtomValue(organizationIdAtom)
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamilly(organizationId || "")
  )
  const conversationId = useAtomValue(conversationIdAtom)
  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  )
  const onBackClick = () => {
    setScreen("selection")
    setConversatioId(null)
  }
  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button onClick={onBackClick} size="icon" variant="trasparent">
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button size="icon" variant="trasparent">
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4 text-muted-foreground">
        {JSON.stringify(conversation, null, 2)}
      </div>
    </>
  )
}

export default WidgetChatScreen
