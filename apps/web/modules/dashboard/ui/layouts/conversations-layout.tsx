import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"
import ConversationsPanel from "../components/conversations-panel"
export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ResizablePanelGroup className="h-full flex-1">
      <ResizablePanel minSize={80} defaultSize={90} maxSize={300}>
        <ConversationsPanel />
      </ResizablePanel>
      <ResizableHandle />

      <ResizablePanel className="h-full" defaultSize={70}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
