"use client"

import { useEffect, useMemo, useRef } from "react"
import type { Key, ReactNode, RefObject } from "react"

import { cn } from "@/shared/lib/utils"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/ui/combobox"
import { Spinner } from "@/shared/ui/spinner"

type AsyncSelectCommonProps<TItem> = {
  items: Array<TItem>
  searchValue: string
  onSearchValueChange: (value: string) => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isPending?: boolean
  error?: Error | null
  onLoadMore: () => void
  placeholder?: string
  searchPlaceholder?: string
  loadingLabel?: string
  emptyLabel?: string
  disabled?: boolean
  id?: string
  className?: string
  contentClassName?: string
  listClassName?: string
  emptyState?: ReactNode
  loadingState?: ReactNode
  errorState?: ReactNode
  getItemKey?: (item: TItem, index: number) => Key
  getItemValue: (item: TItem) => string
  getItemLabel: (item: TItem) => string
  getItemDisabled?: (item: TItem) => boolean
  getValueLabel?: (value: string) => string
  renderItem?: (
    item: TItem,
    state: {
      selected: boolean
      disabled: boolean
    }
  ) => ReactNode
}

type AsyncSelectSingleProps<TItem> = AsyncSelectCommonProps<TItem> & {
  multiple?: false
  value: string | null
  onValueChange: (value: string | null) => void
}

type AsyncSelectMultipleProps<TItem> = AsyncSelectCommonProps<TItem> & {
  multiple: true
  value: Array<string>
  onValueChange: (value: Array<string>) => void
}

type AsyncSelectProps<TItem> =
  | AsyncSelectSingleProps<TItem>
  | AsyncSelectMultipleProps<TItem>

function DefaultLoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-muted-foreground">
      <Spinner className="size-4" />
      <span>{label}</span>
    </div>
  )
}

function DefaultEmptyState({ label }: { label: string }) {
  return (
    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}

function DefaultErrorState({ error }: { error: Error }) {
  return (
    <div className="px-3 py-4 text-center text-sm text-destructive">
      {error.message}
    </div>
  )
}

function AsyncSelect<TItem>(props: AsyncSelectProps<TItem>) {
  const {
    items,
    searchValue,
    onSearchValueChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    isPending = false,
    error = null,
    onLoadMore,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    loadingLabel = "Loading...",
    emptyLabel = "No results found.",
    disabled = false,
    id,
    className,
    contentClassName,
    listClassName,
    emptyState,
    loadingState,
    errorState,
    getItemKey,
    getItemValue,
    getItemLabel,
    getItemDisabled,
    getValueLabel,
    renderItem,
  } = props

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
        rootMargin: "0px 0px 24rem 0px",
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [error, hasNextPage, isFetchingNextPage, isPending, onLoadMore])

  const itemLabelMap = useMemo(() => {
    return new Map(
      items.map((item) => {
        const itemValue = getItemValue(item)
        const itemLabel = getValueLabel?.(itemValue) ?? getItemLabel(item)

        return [itemValue, itemLabel] as const
      })
    )
  }, [getItemLabel, getItemValue, getValueLabel, items])

  if (props.multiple) {
    const selectedValues = props.value
    const selectedValueSet = new Set(selectedValues)

    return (
      <Combobox
        multiple
        value={selectedValues}
        onValueChange={(nextValue) => {
          const normalizedValue = Array.isArray(nextValue) ? nextValue : []

          props.onValueChange(normalizedValue)
          onSearchValueChange("")
        }}
        inputValue={searchValue}
        onInputValueChange={onSearchValueChange}
        autoComplete="none"
        disabled={disabled}
      >
        <ComboboxChips className={cn("w-full", className)}>
          {selectedValues.map((selectedValue) => {
            const label =
              getValueLabel?.(selectedValue) ?? itemLabelMap.get(selectedValue) ?? selectedValue

            return <ComboboxChip key={selectedValue}>{label}</ComboboxChip>
          })}
          <ComboboxChipsInput
            id={id}
            placeholder={searchPlaceholder}
            disabled={disabled}
          />
        </ComboboxChips>

        <ComboboxContent className={contentClassName} align="start">
          <ComboboxList className={cn("py-1", listClassName)}>
            {renderResults({
              items,
              getItemKey,
              getItemValue,
              getItemLabel,
              getItemDisabled,
              renderItem,
              selectedValueSet,
              emptyState,
              loadingState,
              errorState,
              error,
              isPending,
              isFetchingNextPage,
              hasNextPage,
              sentinelRef,
              loadingLabel,
              emptyLabel,
            })}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
  }

  const selectedValue = props.value
  const selectedValueSet = new Set(selectedValue ? [selectedValue] : [])

  return (
    <Combobox
      value={selectedValue}
      onValueChange={(nextValue) => {
        const normalizedValue = Array.isArray(nextValue)
          ? nextValue[0] ?? null
          : nextValue ?? null

        props.onValueChange(normalizedValue)

        if (!normalizedValue) {
          onSearchValueChange("")
          return
        }

        onSearchValueChange(
          getValueLabel?.(normalizedValue) ??
            itemLabelMap.get(normalizedValue) ??
            normalizedValue
        )
      }}
      inputValue={searchValue}
      onInputValueChange={onSearchValueChange}
      autoComplete="none"
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        showTrigger={false}
        showClear={Boolean(searchValue)}
        className={className}
      />

      <ComboboxContent className={contentClassName} align="start">
        <ComboboxList className={cn("py-1", listClassName)}>
          {renderResults({
            items,
            getItemKey,
            getItemValue,
            getItemLabel,
            getItemDisabled,
            renderItem,
            selectedValueSet,
            emptyState,
            loadingState,
            errorState,
            error,
            isPending,
            isFetchingNextPage,
            hasNextPage,
            sentinelRef,
            loadingLabel,
            emptyLabel,
          })}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function renderResults<TItem>({
  items,
  getItemKey,
  getItemValue,
  getItemLabel,
  getItemDisabled,
  renderItem,
  selectedValueSet,
  emptyState,
  loadingState,
  errorState,
  error,
  isPending,
  isFetchingNextPage,
  hasNextPage,
  sentinelRef,
  loadingLabel,
  emptyLabel,
}: {
  items: Array<TItem>
  getItemKey?: (item: TItem, index: number) => Key
  getItemValue: (item: TItem) => string
  getItemLabel: (item: TItem) => string
  getItemDisabled?: (item: TItem) => boolean
  renderItem?: (
    item: TItem,
    state: {
      selected: boolean
      disabled: boolean
    }
  ) => ReactNode
  selectedValueSet: Set<string>
  emptyState?: ReactNode
  loadingState?: ReactNode
  errorState?: ReactNode
  loadingLabel: string
  emptyLabel: string
  error: Error | null
  isPending: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  sentinelRef: RefObject<HTMLDivElement | null>
}) {
  if (error && items.length === 0) {
    return errorState ?? <DefaultErrorState error={error} />
  }

  if (isPending && items.length === 0) {
    return loadingState ?? <DefaultLoadingState label={loadingLabel} />
  }

  if (items.length === 0) {
    return emptyState ?? <DefaultEmptyState label={emptyLabel} />
  }

  return (
    <>
      {items.map((item, index) => {
        const itemValue = getItemValue(item)
        const isSelected = selectedValueSet.has(itemValue)
        const isDisabled = getItemDisabled?.(item) ?? false
        const itemKey = getItemKey?.(item, index) ?? itemValue

        return (
          <ComboboxItem key={itemKey} value={itemValue} disabled={isDisabled}>
            {renderItem ? (
              renderItem(item, {
                selected: isSelected,
                disabled: isDisabled,
              })
            ) : (
              <span className="truncate font-medium">{getItemLabel(item)}</span>
            )}
          </ComboboxItem>
        )
      })}

      {isFetchingNextPage ? (
        <div className="flex items-center justify-center py-3">
          <Spinner className="size-4" />
        </div>
      ) : null}

      {error && items.length > 0 ? errorState ?? <DefaultErrorState error={error} /> : null}

      {hasNextPage ? <div ref={sentinelRef} className="h-px w-full" /> : null}
    </>
  )
}

export { AsyncSelect }
