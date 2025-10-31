type PairingStatus = "pending" | "scanned" | "completed" | "expired"

type PairingRecord = {
    token: string
    companyId: number
    createdAt: number
    status: PairingStatus
    parentSocket?: WebSocket
    childSocket?: WebSocket
}

const PAIRING_EXPIRATION_MS = 1000 * 60 * 2

const pairingRecords = new Map<string, PairingRecord>()
const socketToToken = new Map<WebSocket, string>()

const now = () => Date.now()

const setSocketToken = (socket: WebSocket, token: string) => {
    socketToToken.set(socket, token)
}

const clearSocketToken = (socket: WebSocket) => {
    socketToToken.delete(socket)
}

const markExpired = (token: string) => {
    const record = pairingRecords.get(token)
    if (!record) {
        return
    }

    record.status = "expired"
    pairingRecords.set(token, record)
}

export const createPairingRecord = (token: string, companyId: number) => {
    pairingRecords.set(token, {
        token,
        companyId,
        createdAt: now(),
        status: "pending",
    })
}

export const getPairingRecord = (token: string) => pairingRecords.get(token)

export const attachParentSocket = (token: string, socket: WebSocket) => {
    const record = pairingRecords.get(token)
    if (!record) {
        return null
    }

    record.parentSocket = socket
    pairingRecords.set(token, record)
    setSocketToken(socket, token)
    return record
}

export const attachChildSocket = (token: string, socket: WebSocket) => {
    const record = pairingRecords.get(token)
    if (!record) {
        return null
    }

    record.childSocket = socket
    record.status = "scanned"
    pairingRecords.set(token, record)
    setSocketToken(socket, token)
    return record
}

export const markPairingCompleted = (token: string) => {
    const record = pairingRecords.get(token)
    if (!record) {
        return
    }

    record.status = "completed"
    pairingRecords.set(token, record)
}

export const releasePairingRecord = (token: string) => {
    const record = pairingRecords.get(token)
    if (!record) {
        return
    }

    if (record.parentSocket) {
        clearSocketToken(record.parentSocket)
    }
    if (record.childSocket) {
        clearSocketToken(record.childSocket)
    }

    pairingRecords.delete(token)
}

export const getTokenBySocket = (socket: WebSocket) => socketToToken.get(socket)

export const cleanupExpiredPairings = () => {
    const cutoff = now() - PAIRING_EXPIRATION_MS

    for (const [token, record] of pairingRecords.entries()) {
        if (record.status === "completed") {
            continue
        }

        if (record.createdAt <= cutoff) {
            markExpired(token)

            if (record.parentSocket && record.parentSocket.readyState === WebSocket.OPEN) {
                record.parentSocket.send(
                    JSON.stringify({
                        code: -1,
                        data: { step: record.status === "scanned" ? 1 : 0 },
                        msg: "Pairing expired",
                    }),
                )
                record.parentSocket.close()
            }

            if (record.childSocket && record.childSocket.readyState === WebSocket.OPEN) {
                record.childSocket.send(
                    JSON.stringify({
                        code: -1,
                        data: { step: record.status === "scanned" ? 1 : 0 },
                        msg: "Pairing expired",
                    }),
                )
                record.childSocket.close()
            }

            releasePairingRecord(token)
        }
    }
}


