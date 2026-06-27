export async function copyToClipboard(text: string): Promise<void> {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text)
            return
        } catch {
            // Fall through to legacy fallback.
        }
    }

    if (typeof document === "undefined") {
        throw new Error("Clipboard is not available")
    }

    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.select()

    try {
        const copied = document.execCommand("copy")
        if (!copied) {
            throw new Error("execCommand copy failed")
        }
    } finally {
        document.body.removeChild(textarea)
    }
}
