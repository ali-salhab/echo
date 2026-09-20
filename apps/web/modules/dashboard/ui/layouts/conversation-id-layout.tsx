import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@workspace/ui/components/resizable"
import ContactPanel from "../components/contact-panel"

export const ConversationIdLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ResizablePanelGroup className="h-full flex-1 bg-red-900">
      <ResizablePanel className="h-full" defaultSize={60}>
        <div className="flex h-full flex-1 flex-col"> {children}</div>
      </ResizablePanel>
      {/* <ResizableHandle className="hidden lg:block" /> */}
      <ResizablePanel
        // className="hidden  lg:block"
        minSize={20}
        maxSize={60}
        defaultSize={40}
      >
        <ContactPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
export default ConversationIdLayout
