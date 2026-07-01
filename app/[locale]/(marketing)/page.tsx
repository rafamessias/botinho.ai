import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { BrandLogo } from "@/components/brand-logo"
import { HeroVisual } from "@/components/landing/hero-visual"
import { LandingFeaturesSection, type FeatureMocks } from "@/components/landing/landing-features-section"
import { LandingThemeToggle } from "@/components/landing/landing-theme-toggle"
import {
  MarketingCard,
  MarketingCardContent,
  MarketingCardDescription,
  MarketingCardHeader,
  MarketingCardIcon,
  MarketingCardTitle,
} from "@/components/landing/marketing-card"
import { MarketingSection } from "@/components/landing/marketing-section"
import { MarketingLanguageSelector } from "@/components/landing/marketing-language-selector"
import { LandingPricingSection } from "@/components/pricing/landing-pricing-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "@/i18n/navigation"
import { SUPPORT_EMAIL } from "@/lib/constants/support"
import { routing } from "@/i18n/routing"
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Menu,
  MessageCircle,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Landing.meta" })

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((item) => [item, `/${item}`])),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://botinho.ai/${locale}`,
      siteName: "botinho.ai",
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  }
}

export default async function LandingPage({ params }: PageProps) {
  await params
  const t = await getTranslations("Landing")

  const navItems = [
    { href: "#about", label: t("header.nav.about") },
    { href: "#features", label: t("header.nav.features") },
    { href: "#pricing", label: t("header.nav.pricing") },
    { href: "#faq", label: t("header.nav.faq") },
  ]

  const footerNavItems = [
    ...navItems,
    { href: "#sessions", label: t("header.nav.sessions") },
    { href: "#contact", label: t("header.nav.contact") },
  ]

  const themeLabels = {
    light: t("header.theme.light"),
    dark: t("header.theme.dark"),
    system: t("header.theme.system"),
    toggleAria: t("header.theme.toggleAria"),
  }

  const onboardingSteps = [
    {
      icon: MessageCircle,
      title: t("sessions.steps.connect.title"),
      description: t("sessions.steps.connect.description"),
    },
    {
      icon: Sparkles,
      title: t("sessions.steps.train.title"),
      description: t("sessions.steps.train.description"),
    },
    {
      icon: Clock,
      title: t("sessions.steps.automate.title"),
      description: t("sessions.steps.automate.description"),
    },
    {
      icon: TrendingUp,
      title: t("sessions.steps.measure.title"),
      description: t("sessions.steps.measure.description"),
    },
  ]

  const featureHighlights = [
    {
      key: "humanFriendly" as const,
      icon: "bot" as const,
      title: t("features.cards.humanFriendly.title"),
      description: t("features.cards.humanFriendly.description"),
    },
    {
      key: "secure" as const,
      icon: "shield" as const,
      title: t("features.cards.secure.title"),
      description: t("features.cards.secure.description"),
    },
    {
      key: "collaboration" as const,
      icon: "users" as const,
      title: t("features.cards.collaboration.title"),
      description: t("features.cards.collaboration.description"),
    },
    {
      key: "campaigns" as const,
      icon: "megaphone" as const,
      title: t("features.cards.campaigns.title"),
      description: t("features.cards.campaigns.description"),
    },
    {
      key: "whatsapp" as const,
      icon: "smartphone" as const,
      title: t("features.cards.whatsapp.title"),
      description: t("features.cards.whatsapp.description"),
    },
    {
      key: "templates" as const,
      icon: "checkCircle2" as const,
      title: t("features.cards.templates.title"),
      description: t("features.cards.templates.description"),
    },
  ]

  const featureMocks = t.raw("features.mocks") as FeatureMocks

  const testimonials = t.raw("testimonials.items") as Array<{
    quote: string
    name: string
    role: string
  }>

  const faqs = t.raw("faq.items") as Array<{
    question: string
    answer: string
  }>

  const reasons = t.raw("about.reasons.items") as Array<{
    title: string
    description: string
  }>

  const aboutReasonIcons = [Zap, Users, CalendarCheck, TrendingUp] as const

  const contactSpecialist = {
    title: t("contact.specialist.title"),
    description: t("contact.specialist.description"),
    emailCta: t("contact.specialist.emailCta"),
    whatsappCta: t("contact.specialist.whatsappCta"),
  }

  const contactDemo = {
    title: t("contact.demo.title"),
    description: t("contact.demo.description"),
    note: t("contact.demo.note"),
    cta: t("contact.demo.cta"),
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "botinho.ai",
    url: "https://botinho.ai",
    logo: "https://botinho.ai/logo-green.png",
    email: SUPPORT_EMAIL,
  }

  return (
    <main className="marketing-page min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t("header.logoAria")}
            tabIndex={0}
          >
            <BrandLogo className="h-7 w-auto max-w-[120px] object-contain object-left" priority />
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                tabIndex={0}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <LandingThemeToggle labels={themeLabels} />
            <MarketingLanguageSelector variant="compact" />
            <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
              <Link href="/sign-in" aria-label={t("header.auth.login")} tabIndex={0}>
                {t("header.auth.login")}
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-primary px-5 text-sm font-semibold">
              <Link href="/sign-up" aria-label={t("header.auth.start")} tabIndex={0}>
                {t("header.auth.start")}
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-1 lg:hidden">
            <LandingThemeToggle labels={themeLabels} />
            <MarketingLanguageSelector variant="compact" />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9"
                  aria-label={t("header.mobileMenu.open")}
                  tabIndex={0}
                >
                  <Menu className="size-5" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs border-l border-border bg-background">
                <SheetHeader className="sr-only">
                  <SheetTitle>{t("header.mobileMenu.title")}</SheetTitle>
                  <SheetDescription>{t("header.mobileMenu.description")}</SheetDescription>
                </SheetHeader>
                <div className="flex items-center gap-3 px-4 pt-2">
                  <BrandLogo className="h-8 w-auto max-w-[135px] object-contain object-left" />
                </div>
                <Separator />
                <nav className="flex flex-col gap-1 px-2">
                  {footerNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                      tabIndex={0}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col gap-3 px-2">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/sign-in" tabIndex={0}>
                      {t("header.auth.login")}
                    </Link>
                  </Button>
                  <Button asChild className="rounded-full">
                    <Link href="/sign-up" tabIndex={0}>
                      {t("header.auth.start")}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-20 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-1 flex-col gap-6 text-center lg:max-w-xl lg:text-left">
          <Badge className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-primary lg:mx-0">
            <Sparkles className="size-4" />
            {t("hero.badge")}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
            {t("hero.description")}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild className="w-full rounded-full px-8 py-6 text-base font-semibold sm:w-auto">
              <Link href="/sign-up" aria-label={t("hero.primaryCtaAria")} tabIndex={0}>
                {t("hero.primaryCta")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-border px-8 py-6 text-base font-semibold sm:w-auto"
            >
              <Link href="#contact" aria-label={t("hero.secondaryCtaAria")} tabIndex={0}>
                {t("hero.secondaryCta")}
              </Link>
            </Button>
          </div>
        </div>
        <HeroVisual
          conversationsTitle={t("hero.inbox.conversationsTitle")}
          customerName={t("hero.inbox.customerName")}
          customerPhone={t("hero.inbox.customerPhone")}
          customerQuestion={t("hero.inbox.customerQuestion")}
          aiReply={t("hero.inbox.aiReply")}
          customerConfirmation={t("hero.inbox.customerConfirmation")}
          reservationConfirmation={t("hero.inbox.reservationConfirmation")}
          reservationCode={t("hero.inbox.reservationCode")}
          reservationLinkLabel={t("hero.inbox.reservationLinkLabel")}
          conversations={t.raw("hero.inbox.conversations") as Array<{
            id: string
            name: string
            preview: string
            botReply?: string
            time: string
            unread?: number
          }>}
        />
      </section>

      <MarketingSection
        id="about"
        variant="muted"
        eyebrow={t("about.badge")}
        title={t("about.title")}
        description={t("about.description")}
      >
        <h3 className="mb-6 text-center text-xl font-semibold text-foreground">
          {t("about.reasons.title")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const ReasonIcon = aboutReasonIcons[index] ?? CheckCircle2

            return (
              <MarketingCard key={reason.title} variant="flat">
                <MarketingCardHeader>
                  <MarketingCardIcon>
                    <ReasonIcon className="size-5" aria-hidden />
                  </MarketingCardIcon>
                  <MarketingCardTitle>{reason.title}</MarketingCardTitle>
                </MarketingCardHeader>
                <MarketingCardContent>{reason.description}</MarketingCardContent>
              </MarketingCard>
            )
          })}

          <MarketingCard variant="flat">
            <MarketingCardHeader>
              <MarketingCardIcon>
                <Sparkles className="size-5" />
              </MarketingCardIcon>
              <MarketingCardTitle>{t("about.cards.humanFriendly.title")}</MarketingCardTitle>
            </MarketingCardHeader>
            <MarketingCardContent>{t("about.cards.humanFriendly.description")}</MarketingCardContent>
          </MarketingCard>

          <MarketingCard variant="flat">
            <MarketingCardHeader>
              <MarketingCardIcon>
                <Users className="size-5" />
              </MarketingCardIcon>
              <MarketingCardTitle>{t("about.cards.builtForTeams.title")}</MarketingCardTitle>
            </MarketingCardHeader>
            <MarketingCardContent>{t("about.cards.builtForTeams.description")}</MarketingCardContent>
          </MarketingCard>
        </div>
      </MarketingSection>

      <MarketingSection
        id="sessions"
        variant="default"
        eyebrow={t("sessions.badge")}
        title={t("sessions.title")}
        description={t("sessions.description")}
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {onboardingSteps.map((step) => (
            <MarketingCard key={step.title} variant="flat">
              <MarketingCardHeader className="gap-4">
                <MarketingCardIcon>
                  <step.icon className="size-5" />
                </MarketingCardIcon>
                <MarketingCardTitle>{step.title}</MarketingCardTitle>
              </MarketingCardHeader>
              <MarketingCardContent>{step.description}</MarketingCardContent>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        id="features"
        variant="muted"
        eyebrow={t("features.badge")}
        title={t("features.title")}
        description={t("features.description")}
      >
        <LandingFeaturesSection features={featureHighlights} mocks={featureMocks} />
      </MarketingSection>

      <MarketingSection
        variant="default"
        eyebrow={t("testimonials.badge")}
        title={t("testimonials.title")}
        description={t("testimonials.description")}
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <MarketingCard key={testimonial.name} variant="elevated">
              <MarketingCardHeader className="items-start">
                <Star className="size-4 text-rating" aria-hidden />
                <p className="text-left text-base leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </MarketingCardHeader>
              <MarketingCardContent className="text-left">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </MarketingCardContent>
            </MarketingCard>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        id="pricing"
        variant="surface"
        eyebrow={t("pricing.badge")}
        title={t("pricing.title")}
        description={t("pricing.description")}
        headerExtra={
          <p className="text-sm leading-relaxed text-muted-foreground">{t("pricing.savingsNote")}</p>
        }
      >
        <LandingPricingSection />
      </MarketingSection>

      <MarketingSection
        id="faq"
        variant="default"
        width="narrow"
        eyebrow={t("faq.badge")}
        title={t("faq.title")}
        description={t("faq.description")}
      >
        <div className="divide-y divide-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4">
              <summary className="cursor-pointer list-none text-left text-base font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {faq.question}
                  <span className="text-muted-foreground transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        id="contact"
        variant="muted"
        width="narrow"
        eyebrow={t("contact.badge")}
        title={t("contact.title")}
        description={t("contact.description")}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <MarketingCard variant="elevated">
            <MarketingCardHeader>
              <MarketingCardTitle>{contactSpecialist.title}</MarketingCardTitle>
              <MarketingCardDescription>{contactSpecialist.description}</MarketingCardDescription>
            </MarketingCardHeader>
            <MarketingCardContent className="flex flex-col gap-4 pb-8">
              <Button asChild className="rounded-full">
                <Link href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" tabIndex={0}>
                  {contactSpecialist.whatsappCta}
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`mailto:${SUPPORT_EMAIL}`} tabIndex={0}>
                  {contactSpecialist.emailCta}
                </Link>
              </Button>
            </MarketingCardContent>
          </MarketingCard>

          <MarketingCard variant="highlight">
            <MarketingCardHeader>
              <MarketingCardTitle className="text-primary-foreground">
                {contactDemo.title}
              </MarketingCardTitle>
              <MarketingCardDescription className="text-primary-foreground/80">
                {contactDemo.description}
              </MarketingCardDescription>
            </MarketingCardHeader>
            <MarketingCardContent className="flex flex-col gap-4 pb-8 text-primary-foreground/90">
              <p>{contactDemo.note}</p>
              <Button asChild className="rounded-full bg-background text-foreground hover:bg-background/90">
                <Link href="https://cal.com/botinho/demo" target="_blank" rel="noreferrer" tabIndex={0}>
                  {contactDemo.cta}
                </Link>
              </Button>
            </MarketingCardContent>
          </MarketingCard>
        </div>
      </MarketingSection>

      <MarketingSection variant="default" width="narrow" bordered>
        <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/90 md:text-lg">
            {t("cta.description")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="w-full rounded-full bg-background px-8 py-5 text-sm font-semibold text-foreground hover:bg-background/90 sm:w-auto"
            >
              <Link href="/sign-up" tabIndex={0}>
                {t("cta.primaryCta")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-primary-foreground/30 px-8 py-5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <Link href="#pricing" tabIndex={0}>
                {t("cta.secondaryCta")}
              </Link>
            </Button>
          </div>
        </div>
      </MarketingSection>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <div className="flex w-full flex-col items-start gap-8 md:flex-row md:justify-between md:gap-10">
            <div className="flex w-full flex-col items-start gap-4 md:max-w-md">
              <Link
                href="/"
                className="flex w-fit shrink-0 items-center gap-3 rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                tabIndex={0}
                aria-label={t("header.logoAria")}
              >
                <BrandLogo className="h-8 w-auto max-w-[135px] object-contain object-left" />
              </Link>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("footer.description")}</p>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-6 gap-y-6 md:w-auto md:gap-x-10">
              <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">{t("footer.exploreTitle")}</span>
                {footerNavItems.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-foreground" tabIndex={0}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">{t("footer.contactTitle")}</span>
                <Link href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="transition hover:text-foreground" tabIndex={0}>
                  {t("footer.whatsappLabel")}
                </Link>
                <Link href={`mailto:${SUPPORT_EMAIL}`} className="transition hover:text-foreground" tabIndex={0}>
                  {SUPPORT_EMAIL}
                </Link>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex w-full flex-col items-start gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="hover:text-foreground" tabIndex={0}>
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="hover:text-foreground" tabIndex={0}>
                {t("footer.terms")}
              </Link>
              <Link href="/privacy#seguranca" className="hover:text-foreground" tabIndex={0}>
                {t("footer.security")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
