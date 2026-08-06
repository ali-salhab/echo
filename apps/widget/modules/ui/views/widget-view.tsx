import React from "react"
import WidgetAuthScreen from "../screens/widget-auth-screen"
import { useAtom, useAtomValue } from "jotai"
import { screenAtom } from "../../widget/atoms/widget-atoms"
import { Button } from "@workspace/ui/components/button"
import WidgetErrorScreen from "../screens/widget-error-screen"
import WidgetLoadingScreen from "../screens/widget-loading-screen"
interface Props {
  organizationId: string | null
}
const WidgetView = ({ organizationId }: Props) => {
  const [screen, setScreen] = useAtom(screenAtom)

  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <div>Selection</div>,
    voice: <div>Voice</div>,
    auth: <WidgetAuthScreen />,
    inbox: <div>Inbox</div>,
    chat: <div>Chat</div>,
    contact: <div>Contact</div>,
  }
  return (
    <main className="flex h-screen flex-col overflow-hidden rounded-b-2xl border">
      {screenComponents[screen]}
    </main>
  )
}

export default WidgetView
