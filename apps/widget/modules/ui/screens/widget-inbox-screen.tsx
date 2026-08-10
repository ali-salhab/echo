import React from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react"
import { InfiniteScroolTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { formatDistanceToNow } from "date-fns"
import {
  contactSessionIdAtomFamilly,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../widget/atoms/widget-atoms"
import { WidgetHeader } from "../components/widget-header"
import WidgetFooter from "../components/widget-footer"
import { Button } from "@workspace/ui/components/button"
import { usePaginatedQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const setConverationId = useSetAtom(conversationIdAtom)
  const organizationId = useAtomValue(organizationIdAtom)
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamilly(organizationId || "")
  )
  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    {
      initialNumItems: 10,
    }
  )
  const {
    topElementRef,
    handleLoadMore,
    isLoadingMore,
    canLoadMore,
    isLoadingFirstPage,
    isExhausted,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
    observerEnabled: true,
  })
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
          <p>inbox</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4 text-muted-foreground">
        {conversations.results.length > 0 &&
          conversations.results.map((conversation) => {
            return (
              <Button
                variant="outline"
                key={conversation._id}
                className="h-20 w-full justify-between"
                onClick={() => {
                  setConverationId(conversation._id)
                  setScreen("chat")
                }}
              >
                <div className="flex w-full flex-col gap-4 overflow-hidden text-start">
                  <div className="flex w-full items-center justify-center gap-x-2">
                    <p className="text-xs text-muted-foreground">Chat</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(conversation._creationTime)
                      )}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between gap-x-2">
                    <p className="truncate text-sm">
                      {conversation?.lastMessage?.text}
                    </p>
                    <ConversationStatusIcon
                      status={conversation.status}
                    ></ConversationStatusIcon>
                  </div>
                </div>
              </Button>
            )
          })}
      </div>
      <InfiniteScroolTrigger
        canLoadMore={canLoadMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
        ref={topElementRef}
      />
      <WidgetFooter />
    </>
  )
}

export default WidgetInboxScreen
