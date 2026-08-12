"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import { InfiniteScroolTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { formatDistanceToNow } from "date-fns"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon"
import {
  ListIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  Loader2,
} from "lucide-react"
import { usePaginatedQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import {
  getCountryFlagUrl,
  getCountryFromTimezone,
} from "@/lib/countries-utils"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import { usePathname } from "next/navigation"
import { format } from "path"
import { useAtomValue, useSetAtom } from "jotai/react"
import { statusFilterAtom } from "../../atoms"
import type { Doc } from "zod/v4/core"
import { Skeleton } from "@workspace/ui/components/skeleton"
const ConversationsPanel = () => {
  const statusFilter = useAtomValue(statusFilterAtom)
  const setStatusFilter = useSetAtom(statusFilterAtom)
  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: statusFilter === "all" ? undefined : statusFilter,
    },
    { initialNumItems: 10 }
  )
  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
  })
  const pathName = usePathname()
  return (
    <div className="flex w-full flex-col rounded-lg text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select
          defaultValue="all"
          onValueChange={(value) =>
            setStatusFilter(
              value as "unresolved" | "escalated" | "resolved" | "all"
            )
          }
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0">
            <SelectValue placeholder="filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="h-4 w-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="h-4 w-4" />
                <span>unresolved</span>
              </div>
            </SelectItem>{" "}
            <SelectItem value="escalated">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="h-4 w-4" />
                <span>escalated</span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4" />
                <span>resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoadingFirstPage ? (
        <SkeletonConversationsPanel />
      ) : (
        <ScrollArea className="max-h-[calc(100vh-10rem)] w-full min-w-full">
          <div className="flex w-full flex-1 flex-col text-sm">
            {conversations.results.map((conv) => {
              const isLastMessageFromOperator =
                conv.lastmessage?.message?.role !== "user"
              const country = getCountryFromTimezone(
                conv.contactSession.metadata?.timezone
              )
              const countryflag = country?.code
                ? getCountryFlagUrl(country.code)
                : null
              return (
                <Link
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                    pathName === `/conversations/${conv._id}`
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                  key={conv._id}
                  href={`/conversations/${conv._id}`}
                >
                  <div
                    className={cn(
                      "absolute top-1/2 left-0 h-[64%] w-1 -translate-y-1/2 rounded-r-full bg-neutral-400 opacity-0 transition-opacity",
                      pathName === `/conversations/${conv._id}` && "opacity-100"
                    )}
                  />
                  <DicebearAvatar
                    seed={conv.contactSession._id}
                    badgeImageUrl={countryflag ?? undefined}
                    size={40}
                    className="shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex w-full items-center gap-2">
                      <span>{conv.contactSession.name}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conv._creationTime))}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex w-0 grow items-center gap-1">
                        {isLastMessageFromOperator && (
                          <CornerUpLeftIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            "line-clamp-2 text-xs text-muted-foreground",
                            !isLastMessageFromOperator && "font-semibold"
                          )}
                        >
                          {conv.lastmessage?.text}
                        </span>
                      </div>
                      <ConversationStatusIcon status={conv.status} />
                    </div>
                  </div>
                </Link>
              )
            })}
            <InfiniteScroolTrigger
              ref={topElementRef}
              isLoadingMore={isLoadingMore}
              canLoadMore={canLoadMore}
              onLoadMore={handleLoadMore}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default ConversationsPanel

export const SkeletonConversationsPanel = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2 text-sm">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="flex items-start gap-3 rounded-lg p-4" key={index}>
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-3 w-1/4 rounded-full" />
                  <Skeleton className="ml-auto w-1/4 shrink-0 rounded-full" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
