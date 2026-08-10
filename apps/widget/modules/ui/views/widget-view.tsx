import React from "react"
import WidgetAuthScreen from "../screens/widget-auth-screen"
import { useAtom, useAtomValue } from "jotai"
import { screenAtom } from "../../widget/atoms/widget-atoms"
import { Button } from "@workspace/ui/components/button"
import WidgetErrorScreen from "../screens/widget-error-screen"
import WidgetLoadingScreen from "../screens/widget-loading-screen"
import WidgetSelectionScreen from "../screens/widget-selection-screen"
import WidgetChatScreen from "../screens/widget-chat-screen"
import WidgetInboxScreen from "../screens/widget-inbox-screen"
interface Props {
  organizationId: string | null
}
const WidgetView = ({ organizationId }: Props) => {
  const [screen, setScreen] = useAtom(screenAtom)

  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <WidgetSelectionScreen />,
    voice: <div>Voice</div>,
    auth: <WidgetAuthScreen />,
    inbox: <WidgetInboxScreen />,
    chat: <WidgetChatScreen />,
    contact: <div>Contact</div>,
  }
  return (
    <main className="flex h-screen flex-col overflow-hidden rounded-b-2xl border">
      {screenComponents[screen]}
    </main>
  )
}

export default WidgetView
