const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const slugifyCompanyName = (name: string): string => {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)

  return base || "company"
}

export const isValidCompanySlug = (slug: string): boolean => SLUG_PATTERN.test(slug)

export const withSlugSuffix = (slug: string, suffix: number): string => {
  const candidate = `${slug}-${suffix}`
  return candidate.slice(0, 64)
}
