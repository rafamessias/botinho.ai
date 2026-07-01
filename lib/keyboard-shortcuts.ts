export const isModKey = (event: { metaKey: boolean; ctrlKey: boolean }) =>
  event.metaKey || event.ctrlKey

export const formatModShortcut = (key: string) => {
  if (typeof navigator !== "undefined" && /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    return `⌘${key}`
  }

  return `Ctrl+${key}`
}

export const isTicketJournalComposer = (target: EventTarget | null) =>
  target instanceof HTMLElement && target.id.startsWith("ticket-journal-entry-")

export const isTypingField = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}
