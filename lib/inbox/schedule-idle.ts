export const scheduleIdle = (callback: () => void) => {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => callback())
    return
  }

  setTimeout(callback, 0)
}
