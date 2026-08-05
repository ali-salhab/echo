import React from "react"
import WidgetAuthScreen from "../screens/widget-auth-screen"
import { useAtom, useAtomValue } from "jotai"
import { screenAtom } from "../../widget/atoms/widget-atoms"
import { Button } from "@workspace/ui/components/button"
interface Props {
  organizationId: string
}
const WidgetView = (p: Props) => {
  const [screen, setScreen] = useAtom(screenAtom)

  const screenComponents = {
    error: <div>Error</div>,
    loading: <div>Loading</div>,
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
