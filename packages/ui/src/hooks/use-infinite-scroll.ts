import { useCallback, useEffect, useRef, useState } from "react"

interface useInfiniteScrollProps {
  status: "CanLoadMore" | "LoadingMore" | "Exhausted" | "LoadingFirstPage"
  loadMore: (numberItems: number) => void
  loadSize: number
  observerEnabled?: boolean
}
export const useInfiniteScroll = ({
  status,
  loadMore,
  loadSize = 10,
  observerEnabled = true,
}: useInfiniteScrollProps) => {
  const topElementRef = useRef<HTMLDivElement>(null)
  // here we make the function object reference in memory fce not change until dependencies changes
  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(loadSize)
    }
  }, [status, loadMore, loadSize])

  useEffect(() => {
    const topElement = topElementRef.current
    console.log(topElement)
    if (!(topElement && observerEnabled)) {
      return
    }
    // its api from the browser will tell us when this elemet appear in the view port
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          console.log(
            "here the detected element appear in the view port and the loadmore function called"
          )
          handleLoadMore()
        }
      },
      {
        threshold: 0.1,
      }
    )
    observer.observe(topElement)
    return () => {
      observer.disconnect()
    }
  }, [handleLoadMore, observerEnabled])

  return {
    topElementRef,
    handleLoadMore,
    canLoadMore: status === "CanLoadMore",
    isLoadingMore: status === "LoadingMore",
    isLoadingFirstPage: status === "LoadingFirstPage",
    isExhausted: status === "Exhausted",
  }
}
