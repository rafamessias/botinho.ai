const formatSessionDateTime = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, "0")

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + ` ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const formatPhoneNumber = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, "")
  if (!digits) return phoneNumber.trim()
  return phoneNumber.trim().startsWith("+") ? phoneNumber.trim() : `+${digits}`
}

export const buildSessionLabel = (phoneNumber: string, createdAt: string | Date): string => {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt)
  return `${formatPhoneNumber(phoneNumber)} · ${formatSessionDateTime(date)}`
}
