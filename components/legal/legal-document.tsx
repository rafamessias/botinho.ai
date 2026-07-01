import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { BrandLogo } from "@/components/brand-logo"
import { Link } from "@/i18n/navigation"
import { SUPPORT_EMAIL } from "@/lib/constants/support"

type LegalSection = {
  id: string
  title: string
  paragraphs?: string[]
  items?: string[]
  subsections?: Array<{
    title: string
    paragraphs?: string[]
    items?: string[]
  }>
}

type LegalDocumentProps = {
  namespace: "terms" | "privacy"
}

export const generateLegalMetadata = async (
  namespace: LegalDocumentProps["namespace"],
): Promise<Metadata> => {
  const t = await getTranslations(`Legal.${namespace}`)

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  }
}

export const LegalDocument = async ({ namespace }: LegalDocumentProps) => {
  const t = await getTranslations(`Legal.${namespace}`)
  const sections = t.raw("sections") as LegalSection[]
  const indexItems = t.raw("index") as Array<{ id: string; label: string }>

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" aria-label={t("backHomeAria")}>
            <BrandLogo className="h-8 w-auto max-w-[135px] object-contain object-left" />
          </Link>
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            {t("backHome")}
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <header className="space-y-4 border-b border-border pb-8">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
          <p className="text-sm text-muted-foreground">
            {t("effectiveDate")} · {t("lastUpdated")}
          </p>
          {namespace === "terms" ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("privacyLinkPrefix")}{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">
                {t("privacyLinkLabel")}
              </Link>
              .
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("termsLinkPrefix")}{" "}
              <Link href="/terms" className="font-medium text-primary hover:underline">
                {t("termsLinkLabel")}
              </Link>
              .
            </p>
          )}
        </header>

        <nav aria-label={t("indexTitle")} className="my-10 rounded-2xl border bg-card/50 p-6">
          <h2 className="text-lg font-semibold">{t("indexTitle")}</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {indexItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-foreground hover:text-primary hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.subsections?.map((subsection) => (
                <div key={subsection.title} className="space-y-3">
                  <h3 className="text-base font-semibold text-foreground">{subsection.title}</h3>
                  {subsection.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-pretty text-sm leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {subsection.items ? (
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                      {subsection.items.map((item) => (
                        <li key={item.slice(0, 40)}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t pt-8 text-sm text-muted-foreground">
          <p>
            {t("contactLabel")}{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p className="mt-4">
            <Link href="/" className="font-medium text-primary hover:underline">
              {t("backHome")}
            </Link>
          </p>
        </footer>
      </article>
    </main>
  )
}
