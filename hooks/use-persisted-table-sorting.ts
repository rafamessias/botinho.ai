"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { OnChangeFn, SortingState } from "@tanstack/react-table"

const STORAGE_PREFIX = "botinho:table-sort:"

const isValidSortingState = (value: unknown): value is SortingState =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof item.id === "string" &&
      "desc" in item &&
      typeof item.desc === "boolean",
  )

const readStoredSorting = (key: string, fallback: SortingState): SortingState => {
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (!raw) {
      return fallback
    }

    const parsed: unknown = JSON.parse(raw)
    return isValidSortingState(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const writeStoredSorting = (key: string, sorting: SortingState): void => {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(sorting))
  } catch {
    // ignore quota or privacy mode errors
  }
}

export const usePersistedTableSorting = (
  storageKey: string,
  defaultSorting: SortingState,
): [SortingState, OnChangeFn<SortingState>] => {
  const defaultSortingRef = useRef(defaultSorting)
  const [sorting, setSortingState] = useState<SortingState>(defaultSortingRef.current)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setSortingState(readStoredSorting(storageKey, defaultSortingRef.current))
    setIsHydrated(true)
  }, [storageKey])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    writeStoredSorting(storageKey, sorting)
  }, [storageKey, sorting, isHydrated])

  const setSorting = useCallback<OnChangeFn<SortingState>>((updater) => {
    setSortingState((previous) => (typeof updater === "function" ? updater(previous) : updater))
  }, [])

  return [sorting, setSorting]
}
