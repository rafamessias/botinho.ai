import Image from "next/image"
import { getTranslations } from "next-intl/server"

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
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

type PricingPlan = {
  key: "free" | "starter" | "pro" | "business"
  name: string
  price: string
  description: string
  cta: string
  href: string
  features: string[]
  variant?: "outline"
  highlight?: boolean
}

export default async function LandingPage() {
  const t = await getTranslations("Landing")

  const sharedLogoAlt = t("shared.logoAlt")

  const navItems = [
    { href: "#about", label: t("header.nav.about") },
    { href: "#sessions", label: t("header.nav.sessions") },
    { href: "#features", label: t("header.nav.features") },
    { href: "#pricing", label: t("header.nav.pricing") },
    { href: "#faq", label: t("header.nav.faq") },
    { href: "#contact", label: t("header.nav.contact") },
  ]

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
      icon: Bot,
      title: t("features.cards.humanFriendly.title"),
      description: t("features.cards.humanFriendly.description"),
    },
    {
      icon: Shield,
      title: t("features.cards.secure.title"),
      description: t("features.cards.secure.description"),
    },
    {
      icon: Users,
      title: t("features.cards.collaboration.title"),
      description: t("features.cards.collaboration.description"),
    },
    {
      icon: CalendarCheck,
      title: t("features.cards.appointments.title"),
      description: t("features.cards.appointments.description"),
    },
    {
      icon: Zap,
      title: t("features.cards.integrations.title"),
      description: t("features.cards.integrations.description"),
    },
    {
      icon: CheckCircle2,
      title: t("features.cards.playbooks.title"),
      description: t("features.cards.playbooks.description"),
    },
  ]

  const pricingPlans: PricingPlan[] = [
    {
      key: "free",
      name: t("pricing.plans.free.name"),
      price: t("pricing.plans.free.price"),
      description: t("pricing.plans.free.description"),
      cta: t("pricing.plans.free.cta"),
      href: "/register",
      features: t.raw("pricing.plans.free.features") as string[],
      variant: "outline",
    },
    {
      key: "starter",
      name: t("pricing.plans.starter.name"),
      price: t("pricing.plans.starter.price"),
      description: t("pricing.plans.starter.description"),
      cta: t("pricing.plans.starter.cta"),
      href: "/register",
      features: t.raw("pricing.plans.starter.features") as string[],
    },
    {
      key: "pro",
      name: t("pricing.plans.pro.name"),
      price: t("pricing.plans.pro.price"),
      description: t("pricing.plans.pro.description"),
      cta: t("pricing.plans.pro.cta"),
      href: "/register",
      features: t.raw("pricing.plans.pro.features") as string[],
      highlight: true,
    },
    {
      key: "business",
      name: t("pricing.plans.business.name"),
      price: t("pricing.plans.business.price"),
      description: t("pricing.plans.business.description"),
      cta: t("pricing.plans.business.cta"),
      href: "/contact",
      features: t.raw("pricing.plans.business.features") as string[],
      variant: "outline",
    },
  ]

  const testimonials = t.raw("testimonials.items") as Array<{
    quote: string
    name: string
    role: string
  }>

  const faqs = t.raw("faq.items") as Array<{
    question: string
    answer: string
  }>

  const reasons = t.raw("about.reasons.items") as string[]

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

  const perMonthLabel = t("pricing.perMonthLabel", { defaultValue: "/month" })

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-background via-background/60 to-muted/40">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t("header.logoAria")}
            tabIndex={0}
          >
            <Image
              src="/logo-green.png"
              alt={sharedLogoAlt}
              width={120}
              height={40}
              priority
            />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
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
          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild variant="ghost" className="rounded-full px-5">
              <Link href="/sign-in" aria-label={t("header.auth.login")}
                tabIndex={0}
              >
                {t("header.auth.login")}
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-primary px-6 text-sm font-semibold">
              <Link href="/register" aria-label={t("header.auth.start")} tabIndex={0}>
                {t("header.auth.start")}
              </Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label={t("header.mobileMenu.open")}
                tabIndex={0}
              >
                <ChevronRight className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs border-l bg-background/95">
              <div className="flex items-center gap-3 px-4 pt-2">
                <Image src="/logo-green.png" alt={sharedLogoAlt} width={100} height={40} />
              </div>
              <Separator />
              <nav className="flex flex-col gap-4 px-2">
                {navItems.map((item) => (
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
                  <Link href="/register" tabIndex={0}>
                    {t("header.auth.start")}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-12 md:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="flex flex-1 flex-col gap-6 text-center lg:text-left">
          <Badge className="mx-auto flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-primary lg:mx-0">
            <Sparkles className="size-4" />
            {t("hero.badge")}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="text-pretty text-lg text-muted-foreground sm:text-xl">{t("hero.description")}</p>
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
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
              <Star className="size-4 text-amber-500" />
              <span>{t("hero.rating")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
              <Shield className="size-4 text-success" />
              <span>{t("hero.compliance")}</span>
            </div>
          </div>
        </div>
        <Card className="flex-1 rounded-3xl border border-primary/10 bg-background/80 p-0 shadow-xl">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
              <Image src="/bot-green.svg" alt={sharedLogoAlt} width={120} height={120} className="h-9 w-9" />
              <span className="text-lg font-semibold">{t("hero.inbox.title")}</span>
            </div>
            <div className="space-y-4 rounded-2xl bg-muted/60 p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  JA
                </span>
                <div className="flex-1 rounded-2xl bg-background/80 p-3 shadow-sm max-w-[250px]">
                  <p className="text-sm font-semibold">{t("hero.inbox.customerName")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("hero.inbox.customerQuestion")}</p>
                </div>
              </div>
              <div className="flex items-start justify-end gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  AI
                </span>
                <div className="flex-1 rounded-2xl bg-primary/10 p-3 shadow-sm max-w-[250px]">
                  <p className="text-sm text-primary">{t("hero.inbox.aiReply")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  JA
                </span>
                <div className="flex-1 rounded-2xl bg-background/80 p-3 shadow-sm max-w-[250px]">
                  <p className="text-sm font-semibold">{t("hero.inbox.customerName")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("hero.inbox.customerConfirmation")}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-semibold">{t("hero.inbox.followUpsTitle")}</p>
                <p className="text-xs text-muted-foreground">{t("hero.inbox.followUpsDescription")}</p>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full" aria-label={t("hero.inbox.followUpsAria")}>
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <section id="about" className="bg-card/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 md:px-6 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-6">
            <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary">{t("about.badge")}</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">{t("about.title")}</h2>
            <p className="text-pretty text-lg text-muted-foreground">{t("about.description")}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-2xl border-primary/15 bg-background/90 shadow-sm">
                <CardHeader className="gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-6" />
                  </span>
                  <CardTitle className="text-lg">{t("about.cards.humanFriendly.title")}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 text-sm text-muted-foreground">
                  {t("about.cards.humanFriendly.description")}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-primary/15 bg-background/90 shadow-sm">
                <CardHeader className="gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Users className="size-6" />
                  </span>
                  <CardTitle className="text-lg">{t("about.cards.builtForTeams.title")}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 text-sm text-muted-foreground">
                  {t("about.cards.builtForTeams.description")}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex-1 space-y-6 rounded-3xl border border-primary/10 bg-background/70 p-8 shadow-xl">
            <h3 className="text-xl font-semibold">{t("about.reasons.title")}</h3>
            <ul className="grid gap-4 text-sm text-muted-foreground">
              {reasons.map((reason, index) => (
                <li key={reason} className="flex items-start gap-3">
                  <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="sessions" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("sessions.badge")}</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("sessions.title")}</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">{t("sessions.description")}</p>
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
              <CardContent className="pb-6 text-sm text-muted-foreground">{step.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="bg-muted/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 md:px-6">
          <div className="flex flex-col gap-6 text-center">
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("features.badge")}</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("features.title")}</h2>
            <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">{t("features.description")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureHighlights.map((feature) => (
              <Card key={feature.title} className="rounded-2xl border border-primary/10 bg-background/90 shadow-sm">
                <CardHeader className="gap-4">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="size-6" />
                  </span>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div>
              <h3 className="text-2xl font-semibold text-primary">
                {t("features.banner.title")} <span className="text-sm text-primary/80">{t("features.banner.tag")}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-primary/80">{t("features.banner.description")}</p>
            </div>
            <Button asChild className="rounded-full bg-primary px-6 py-5 text-sm font-semibold text-primary-foreground">
              <Link href="#contact" tabIndex={0}>
                {t("features.banner.cta")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("testimonials.badge")}</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("testimonials.title")}</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">{t("testimonials.description")}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="rounded-2xl border border-primary/10 bg-background/85 shadow-sm">
              <CardHeader className="items-start gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 text-amber-500" />
                  ))}
                </div>
                <CardDescription className="text-left text-base text-foreground">“{testimonial.quote}”</CardDescription>
              </CardHeader>
              <CardContent className="pb-6 text-left text-sm text-muted-foreground">
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
            <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">{t("pricing.description")}</p>
            <p className="text-sm text-muted-foreground">{t("pricing.savingsNote")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.key}
                className={cn(
                  "rounded-2xl border border-primary/10 bg-background/90 shadow-sm transition duration-200",
                  plan.highlight && "border-primary/60 shadow-xl",
                )}
              >
                {plan.highlight ? (
                  <Badge className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-primary-foreground">
                    {t("pricing.mostLoved")}
                  </Badge>
                ) : null}
                <CardHeader className="gap-3">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{perMonthLabel}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 pb-8">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-1 flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={cn(
                      "rounded-full px-6 py-5 text-sm font-semibold",
                      plan.variant === "outline" && "bg-transparent",
                    )}
                    variant={plan.variant ?? "default"}
                  >
                    <Link href={plan.href} tabIndex={0}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("faq.badge")}</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("faq.title")}</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">{t("faq.description")}</p>
        </div>
        <Accordion type="single" collapsible className="mt-12 rounded-2xl border border-primary/15 bg-background/80 p-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section id="contact" className="bg-muted/30">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 md:px-6">
          <div className="flex flex-col gap-4 text-center">
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">{t("contact.badge")}</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">{t("contact.title")}</h2>
            <p className="text-pretty text-lg text-muted-foreground">{t("contact.description")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border border-primary/10 bg-background/90 shadow-sm">
              <CardHeader className="gap-3">
                <CardTitle className="text-lg">{contactSpecialist.title}</CardTitle>
                <CardDescription>{contactSpecialist.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-8 text-sm text-muted-foreground">
                <Button asChild className="rounded-full">
                  <Link href="mailto:oi@botinho.ai" tabIndex={0}>
                    {contactSpecialist.emailCta}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" tabIndex={0}>
                    {contactSpecialist.whatsappCta}
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

      <section className="mx-auto my-16 w-full max-w-5xl rounded-3xl border border-primary/20 bg-primary/10 px-6 py-10 text-center md:px-12">
        <h2 className="text-balance text-3xl font-semibold text-primary sm:text-4xl">{t("cta.title")}</h2>
        <p className="mt-4 text-pretty text-base text-primary/80 md:text-lg">{t("cta.description")}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
        </div>
      </section>

      <footer className="border-t border-primary/10 bg-background/90">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                tabIndex={0}
              >
                <Image src="/logo-green.png" alt={sharedLogoAlt} width={100} height={40} />
              </Link>
              <p className="max-w-md text-sm text-muted-foreground">{t("footer.description")}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">{t("footer.exploreTitle")}</span>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-foreground" tabIndex={0}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">{t("footer.contactTitle")}</span>
                <Link href="mailto:oi@botinho.ai" className="transition hover:text-foreground" tabIndex={0}>
                  oi@botinho.ai
                </Link>
                <Link href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="transition hover:text-foreground" tabIndex={0}>
                  {t("footer.whatsappLabel")}
                </Link>
                <span className="text-sm">{t("footer.address")}</span>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
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
