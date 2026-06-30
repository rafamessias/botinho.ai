import Image from "next/image"
import { getTranslations } from "next-intl/server"

import { BrandLogo } from "@/components/brand-logo"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { HeroInboxDemo } from "@/components/landing/hero-inbox-demo"
import { LandingThemeToggle } from "@/components/landing/landing-theme-toggle"
import { LandingPricingSection } from "@/components/pricing/landing-pricing-section"
import { LandingFeaturesSection, type FeatureMocks } from "@/components/landing/landing-features-section"
import { LanguageSelector } from "@/components/language-selector"
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Menu,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

export default async function LandingPage() {
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
      key: "appointments" as const,
      icon: "calendarCheck" as const,
      title: t("features.cards.appointments.title"),
      description: t("features.cards.appointments.description"),
    },
    {
      key: "integrations" as const,
      icon: "zap" as const,
      title: t("features.cards.integrations.title"),
      description: t("features.cards.integrations.description"),
    },
    {
      key: "playbooks" as const,
      icon: "checkCircle2" as const,
      title: t("features.cards.playbooks.title"),
      description: t("features.cards.playbooks.description"),
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

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-background via-background/60 to-muted/40">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 md:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t("header.logoAria")}
            tabIndex={0}
          >
            <BrandLogo className="h-8 w-auto max-w-[135px] object-contain object-left" priority />
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                tabIndex={0}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <LandingThemeToggle labels={themeLabels} />
            <LanguageSelector variant="compact" />
            <Button asChild variant="ghost" size="sm" className="rounded-full px-4">
              <Link href="/sign-in" aria-label={t("header.auth.login")} tabIndex={0}>
                {t("header.auth.login")}
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-full bg-primary px-5 text-sm font-semibold">
              <Link href="/register" aria-label={t("header.auth.start")} tabIndex={0}>
                {t("header.auth.start")}
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-1 lg:hidden">
            <LandingThemeToggle labels={themeLabels} />
            <LanguageSelector variant="compact" />
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
              <SheetContent side="right" className="w-full max-w-xs border-l bg-background/95">
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
                      className="rounded-lg px-3 py-2 text-base font-medium text-foreground/70 transition hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
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
                    <Link href="/register" tabIndex={0}>
                      {t("header.auth.start")}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-12 md:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="flex flex-1 flex-col gap-6 text-center lg:max-w-xl lg:text-left">
          <Badge className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-primary lg:mx-0">
            <Sparkles className="size-4" />
            {t("hero.badge")}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-foreground/75 sm:text-xl lg:mx-0">
            {t("hero.description")}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild className="w-full rounded-full px-8 py-6 text-base font-semibold sm:w-auto">
              <Link href="/register" aria-label={t("hero.primaryCtaAria")} tabIndex={0}>
                {t("hero.primaryCta")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-primary/40 px-8 py-6 text-base font-semibold sm:w-auto"
            >
              <Link href="#contact" aria-label={t("hero.secondaryCtaAria")} tabIndex={0}>
                {t("hero.secondaryCta")}
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/70 lg:justify-start">
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
              <Star className="size-4 text-rating" />
              <span>{t("hero.rating")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
              <Shield className="size-4 text-success" />
              <span>{t("hero.compliance")}</span>
            </div>
          </div>
        </div>
        <HeroInboxDemo
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

      <section id="about" className="bg-card/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary">{t("about.badge")}</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">{t("about.title")}</h2>
            <p className="text-pretty text-lg leading-relaxed text-foreground/75">{t("about.description")}</p>
          </div>

          <h3 className="mt-12 text-center text-xl font-semibold">{t("about.reasons.title")}</h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason, index) => {
              const ReasonIcon = aboutReasonIcons[index] ?? CheckCircle2

              return (
                <Card
                  key={reason.title}
                  className="rounded-2xl border border-primary/10 bg-background/90 shadow-sm"
                >
                  <CardHeader className="gap-3">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ReasonIcon className="size-6" aria-hidden />
                    </span>
                    <CardTitle className="text-lg">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6 text-sm leading-relaxed text-foreground/70">
                    {reason.description}
                  </CardContent>
                </Card>
              )
            })}

            <Card className="rounded-2xl border border-primary/10 bg-background/90 shadow-sm">
              <CardHeader className="gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="size-6" />
                </span>
                <CardTitle className="text-lg">{t("about.cards.humanFriendly.title")}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-sm leading-relaxed text-foreground/70">
                {t("about.cards.humanFriendly.description")}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-primary/10 bg-background/90 shadow-sm">
              <CardHeader className="gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Users className="size-6" />
                </span>
                <CardTitle className="text-lg">{t("about.cards.builtForTeams.title")}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-sm leading-relaxed text-foreground/70">
                {t("about.cards.builtForTeams.description")}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="sessions" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("sessions.badge")}</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("sessions.title")}</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75">{t("sessions.description")}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {onboardingSteps.map((step) => (
            <Card key={step.title} className="rounded-2xl border border-primary/10 bg-background/80 shadow-sm">
              <CardHeader className="gap-4">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="size-6" />
                </span>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-sm leading-relaxed text-foreground/70">{step.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="bg-muted/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 md:px-6">
          <div className="flex flex-col gap-6 text-center">
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("features.badge")}</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("features.title")}</h2>
            <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75">{t("features.description")}</p>
          </div>
          <LandingFeaturesSection features={featureHighlights} mocks={featureMocks} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("testimonials.badge")}</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("testimonials.title")}</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75">{t("testimonials.description")}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="rounded-2xl border border-primary/10 bg-background/85 shadow-sm">
              <CardHeader className="items-start gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 text-rating" />
                  ))}
                </div>
                <CardDescription className="text-left text-base text-foreground">“{testimonial.quote}”</CardDescription>
              </CardHeader>
              <CardContent className="pb-6 text-left text-sm leading-relaxed text-foreground/70">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-card/50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-16 md:px-6">
          <div className="flex flex-col gap-6 text-center">
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("pricing.badge")}</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("pricing.title")}</h2>
            <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75">{t("pricing.description")}</p>
            <p className="text-sm leading-relaxed text-foreground/65">{t("pricing.savingsNote")}</p>
          </div>
          <LandingPricingSection />
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("faq.badge")}</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("faq.title")}</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75">{t("faq.description")}</p>
        </div>
        <Accordion type="single" collapsible className="mt-12 rounded-2xl border border-primary/15 bg-background/80 p-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-foreground/70">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section id="contact" className="bg-muted/30">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 md:px-6">
          <div className="flex flex-col gap-4 text-center">
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("contact.badge")}</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("contact.title")}</h2>
            <p className="text-pretty text-lg leading-relaxed text-foreground/75">{t("contact.description")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border border-primary/10 bg-background/90 shadow-sm">
              <CardHeader className="gap-3">
                <CardTitle className="text-lg">{contactSpecialist.title}</CardTitle>
                <CardDescription>{contactSpecialist.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-8 text-sm leading-relaxed text-foreground/70">
                <Button asChild className="rounded-full">
                  <Link href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" tabIndex={0}>
                    {contactSpecialist.whatsappCta}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="mailto:oi@botinho.ai" tabIndex={0}>
                    {contactSpecialist.emailCta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-primary/10 bg-primary/10 shadow-sm">
              <CardHeader className="gap-3">
                <CardTitle className="text-lg">{contactDemo.title}</CardTitle>
                <CardDescription>{contactDemo.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-8 text-sm text-primary/80">
                <p>{contactDemo.note}</p>
                <Button asChild className="rounded-full bg-primary text-primary-foreground">
                  <Link href="https://cal.com/botinho/demo" target="_blank" rel="noreferrer" tabIndex={0}>
                    {contactDemo.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-5xl flex-col px-4 py-16 md:px-6">
          <Card className="rounded-2xl border border-primary/10 bg-primary/10 text-center shadow-sm">
            <CardHeader className="gap-3">
              <CardTitle className="text-balance text-3xl text-primary sm:text-4xl">{t("cta.title")}</CardTitle>
              <CardDescription className="text-pretty text-base leading-relaxed text-primary/85 md:text-lg">
                {t("cta.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-3 pb-8 sm:flex-row">
              <Button asChild className="w-full rounded-full bg-primary px-8 py-5 text-sm font-semibold text-primary-foreground sm:w-auto">
                <Link href="/register" tabIndex={0}>
                  {t("cta.primaryCta")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full px-8 py-5 text-sm font-semibold sm:w-auto">
                <Link href="#pricing" tabIndex={0}>
                  {t("cta.secondaryCta")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-primary/10 bg-background/90">
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
              <p className="text-sm leading-relaxed text-foreground/70">{t("footer.description")}</p>
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
                <Link href="mailto:oi@botinho.ai" className="transition hover:text-foreground" tabIndex={0}>
                  oi@botinho.ai
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
              <Link href="/security" className="hover:text-foreground" tabIndex={0}>
                {t("footer.security")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
