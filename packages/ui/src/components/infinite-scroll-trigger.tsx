import { Button } from "@workspace/ui/components/button"
import { cn } from "../lib/utils.js"
import type React from "react"

interface InfiniteScroolTriggerProps {
  canLoadMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  loadMoreText?: string
  noMoreText?: string
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const InfiniteScroolTrigger = ({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  loadMoreText = "load More",
  noMoreText = "no more items",
  className,
  ref,
}: InfiniteScroolTriggerProps) => {
  let text = loadMoreText
  if (isLoadingMore) {
    text = "loading..."
  } else if (!canLoadMore) {
    text = noMoreText
  }
  return (
    <div ref={ref} className={cn("flex w-full justify-center py-2", className)}>
      <Button
        variant="ghost"
        size={"sm"}
        onClick={onLoadMore}
        disabled={!canLoadMore || isLoadingMore}
      >
        {text}
      </Button>
    </div>
  )
}
