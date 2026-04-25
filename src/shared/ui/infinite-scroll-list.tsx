"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/shared/lib/utils"
import { Spinner } from "@/shared/ui/spinner"

type InfiniteScrollListProps<T> = {
  items: Array<T>
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T, index: number) => React.Key
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isPending?: boolean
  error?: Error | null
  onLoadMore: () => void
  emptyState?: React.ReactNode
  loadingState?: React.ReactNode
  errorState?: React.ReactNode
  className?: string
  sentinelMargin?: string
}

function InfiniteScrollList<T>({
  items,
  renderItem,
  keyExtractor,
  hasNextPage = false,
  isFetchingNextPage = false,
  isPending = false,
  error,
  onLoadMore,
  emptyState,
  loadingState,
  errorState,
  className,
  sentinelMargin = "0px 0px 24rem 0px",
}: InfiniteScrollListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || !hasNextPage || isFetchingNextPage || isPending || error) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      {
        rootMargin: sentinelMargin,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [error, hasNextPage, isFetchingNextPage, isPending, onLoadMore, sentinelMargin])

  if (error && items.length === 0) {
    return errorState ?? null
  }

  if (isPending && items.length === 0) {
    return loadingState ?? null
  }

  if (!items.length) {
    return emptyState ?? null
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => (
        <div key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}

      {isFetchingNextPage ? (
        <div className="flex items-center justify-center py-4">
          <Spinner className="size-5" />
        </div>
      ) : null}

      {hasNextPage ? <div ref={sentinelRef} className="h-px w-full" /> : null}
    </div>
  )
}

export { InfiniteScrollList }
