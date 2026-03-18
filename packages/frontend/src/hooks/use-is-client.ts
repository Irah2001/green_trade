import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

function getClientSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

export function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot)
}
