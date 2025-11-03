export type ResolveWsBackendUrlOptions = {
    path?: string
}

const getNormalizedPath = (path?: string) => {
    if (!path) {
        return ""
    }

    return path.startsWith("/") ? path : `/${path}`
}

const getScheme = () => {
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
        return "wss"
    }

    return "ws"
}

const applyPath = (base: string, path: string) => {
    if (!path) {
        return base
    }

    const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base
    return `${trimmedBase}${path}`
}

export const resolveWsBackendUrl = (input?: string | ResolveWsBackendUrlOptions) => {
    const options = typeof input === "string" ? { path: input } : input ?? {}
    const normalizedPath = getNormalizedPath(options.path)

    const scheme = getScheme()
    const candidates = [
        process.env.NEXT_PUBLIC_WS_BACKEND,
        process.env.WS_BACKEND,
        process.env.NEXT_PUBLIC_WS_SERVER_URL,
    ]

    const raw = candidates.find((candidate) => candidate?.trim())?.trim()

    if (raw) {
        if (raw.startsWith("ws://") || raw.startsWith("wss://")) {
            return applyPath(raw, normalizedPath)
        }

        if (raw.startsWith("http://") || raw.startsWith("https://")) {
            const converted = raw.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://")
            return applyPath(converted, normalizedPath)
        }

        if (raw.startsWith("//")) {
            return applyPath(`${scheme}:${raw}`, normalizedPath)
        }

        return applyPath(`${scheme}://${raw}`, normalizedPath)
    }

    const host = typeof window !== "undefined" ? window.location.hostname : "localhost"
    const fallbackPort = process.env.NEXT_PUBLIC_WS_PORT ?? process.env.NEXT_PUBLIC_WS_SERVER_PORT ?? "3100"
    const portSegment = fallbackPort ? `:${fallbackPort}` : ""
    const base = `${scheme}://${host}${portSegment}`

    return applyPath(base, normalizedPath)
}

