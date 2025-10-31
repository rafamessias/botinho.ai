import Image from "next/image"

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

const navItems = [
  { href: "#about", label: "What is botinho" },
  { href: "#sessions", label: "Sessions" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
]

const onboardingSteps = [
  {
    icon: MessageCircle,
    title: "Connect WhatsApp",
    description:
      "Link your WhatsApp Business number in minutes with a guided setup that anyone can follow.",
  },
  {
    icon: Sparkles,
    title: "Train Your AI",
    description:
      "Upload FAQs, menus, promotions, and documents so botinho speaks exactly like your brand.",
  },
  {
    icon: Clock,
    title: "Automate Conversations",
    description:
      "Let botinho answer instantly, qualify leads, schedule appointments, and escalate when needed.",
  },
  {
    icon: TrendingUp,
    title: "Measure & Improve",
    description:
      "Track satisfaction, response times, and sales impact inside an intuitive analytics dashboard.",
  },
]

const featureHighlights = [
  {
    icon: Bot,
    title: "Human-friendly AI",
    description:
      "Conversational flows that remember context, adapt tone, and stay on brand in every language.",
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description:
      "Enterprise-grade encryption, role-based permissions, and compliance-first infrastructure.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Assign conversations, leave internal notes, and jump in the moment a human touch is required.",
  },
  {
    icon: CalendarCheck,
    title: "Appointments & Reminders",
    description:
      "Confirm bookings, send reminders, and sync calendars automatically without any manual work.",
  },
  {
    icon: Zap,
    title: "Smart Integrations",
    description:
      "Connect your CRM, delivery platform, or e-commerce tools to trigger workflows instantly.",
  },
  {
    icon: CheckCircle2,
    title: "Guided Playbooks",
    description:
      "Use pre-built templates for sales, support, reservations, and follow-ups to launch faster.",
  },
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for testing",
    cta: "Start for free",
    href: "/register",
    features: [
      "50 messages/month",
      "1 WhatsApp number",
      "Basic AI training",
      "Community support",
    ],
    variant: "outline" as const,
  },
  {
    name: "Starter",
    price: "$9",
    description: "For small teams",
    cta: "Choose Starter",
    href: "/register",
    features: [
      "500 messages/month",
      "1 WhatsApp number",
      "Advanced AI training",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    description: "Our most popular",
    cta: "Upgrade to Pro",
    href: "/register",
    features: [
      "2,000 messages/month",
      "3 WhatsApp numbers",
      "Premium AI training",
      "Priority support",
      "Analytics dashboard",
    ],
    highlight: true,
  },
  {
    name: "Business",
    price: "$39",
    description: "For scaling companies",
    cta: "Talk to sales",
    href: "/contact",
    features: [
      "10,000 messages/month",
      "Unlimited numbers",
      "Custom AI models",
      "Dedicated success manager",
      "API & webhooks",
    ],
    variant: "outline" as const,
  },
]

const testimonials = [
  {
    quote:
      "botinho handles more than 80% of our WhatsApp messages. Customers get answers instantly and our team can focus on the tough questions.",
    name: "Ana Torres",
    role: "Owner, Bistro Verde",
  },
  {
    quote:
      "We connected Shopify and our CRM in minutes. The automation playbooks doubled our qualified leads in the first month.",
    name: "Daniel Costa",
    role: "Sales Lead, Techfy",
  },
  {
    quote:
      "Support response times went from hours to seconds. The handoff to our human team is seamless when VIP clients reach out.",
    name: "Larissa Mendes",
    role: "CX Manager, Studio Lume",
  },
]

const faqs = [
  {
    question: "How long does it take to get started?",
    answer:
      "Most customers connect their WhatsApp number and publish their first AI flows in under 15 minutes. Our guided onboarding walks you through every step.",
  },
  {
    question: "What integrations are available?",
    answer:
      "botinho connects with CRMs, e-commerce platforms, delivery services, and more. Use native integrations or webhooks to plug into your stack.",
  },
  {
    question: "Can I escalate conversations to humans?",
    answer:
      "Yes. You can set smart routing rules, assign agents, and resume the AI once humans finish. Your team stays in full control.",
  },
  {
    question: "Is my customer data secure?",
    answer:
      "We use encrypted storage, strict access controls, and GDPR-compliant infrastructure. You decide how long data stays in the system.",
  },
  {
    question: "Do you offer support in Portuguese and Spanish?",
    answer:
      "Absolutely. botinho understands and responds in multiple languages, and our support team is multilingual as well.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer:
      "We will notify you before you reach your limits so you can upgrade seamlessly or purchase usage add-ons without interruptions.",
  },
]

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-background via-background/60 to-muted/40">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full px-1 py-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Go to botinho home"
            tabIndex={0}
          >

            <Image
              src="/logo-green.png"
              alt="botinho logo"
              width={150}
              height={55}
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
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Button asChild variant="ghost" className="rounded-full px-5">
              <Link href="/sign-in" aria-label="Login to botinho" tabIndex={0}>
                Login
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-primary px-6 text-sm font-semibold">
              <Link href="/register" aria-label="Create your botinho account" tabIndex={0}>
                Start free
              </Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
                tabIndex={0}
              >
                <ChevronRight className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs border-l bg-background/95">
              <div className="flex items-center gap-3 px-4 pt-6">
                <span className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60">
                  <Image
                    src="/logo-green.png"
                    alt="botinho logo"
                    width={40}
                    height={40}
                    className="h-9 w-9"
                  />
                </span>
                <span className="text-lg font-semibold">botinho.ai</span>
              </div>
              <Separator className="my-6" />
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
                <Button asChild variant="ghost" className="rounded-full">
                  <Link href="/sign-in" tabIndex={0}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/register" tabIndex={0}>
                    Start free
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
            WhatsApp AI, reimagined
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Turn every WhatsApp conversation into a loyal customer moment
          </h1>
          <p className="text-pretty text-lg text-muted-foreground sm:text-xl">
            botinho automates support, sales, and follow-ups with a friendly AI assistant that knows your business by
            heart, hands off seamlessly to your team, and never misses a message.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild className="w-full rounded-full px-8 py-6 text-base font-semibold sm:w-auto">
              <Link href="/register" aria-label="Start your free botinho trial" tabIndex={0}>
                Start free in 5 minutes
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-primary/40 px-8 py-6 text-base font-semibold sm:w-auto"
            >
              <Link href="#contact" aria-label="Talk to botinho team" tabIndex={0}>
                Talk to our team
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
              <Star className="size-4 text-amber-500" />
              <span>4.9/5 from 200+ teams</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm">
              <Shield className="size-4 text-success" />
              <span>GDPR, LGPD ready</span>
            </div>
          </div>
        </div>
        <Card className="flex-1 rounded-3xl border border-primary/10 bg-background/80 p-0 shadow-xl">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
              <span className="relative flex size-10 items-center justify-center rounded-2xl bg-primary/10">
                <Image src="/logo-green.png" alt="botinho" width={40} height={40} className="h-9 w-9" />
              </span>
              <span className="text-lg font-semibold">WhatsApp Inbox</span>
            </div>
            <div className="space-y-4 rounded-2xl bg-muted/60 p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  JA
                </span>
                <div className="flex-1 rounded-2xl bg-background/80 p-3 shadow-sm">
                  <p className="text-sm font-semibold">Julia Andrade</p>
                  <p className="mt-1 text-sm text-muted-foreground">Olá! Vocês têm opções vegetarianas para o almoço de hoje?</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  AI
                </span>
                <div className="flex-1 rounded-2xl bg-primary/10 p-3 shadow-sm">
                  <p className="text-sm text-primary-foreground">
                    Oi Julia! Temos strogonoff de cogumelos, salada mediterrânea e lasanha de abobrinha hoje. Posso reservar pra você?
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  JA
                </span>
                <div className="flex-1 rounded-2xl bg-background/80 p-3 shadow-sm">
                  <p className="text-sm font-semibold">Julia Andrade</p>
                  <p className="mt-1 text-sm text-muted-foreground">Sim! Pode reservar para 12h30 no nome da Julia.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-semibold">Automated follow-ups</p>
                <p className="text-xs text-muted-foreground">Send reservation reminders automatically via WhatsApp</p>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full" aria-label="Activate follow ups">
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <section id="about" className="bg-card/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 md:px-6 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-6">
            <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary">What is botinho</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Your WhatsApp co-pilot for hospitality, retail, and service brands
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              botinho centralizes every message, automates responses with an AI trained on your business DNA, and keeps
              humans in the loop for delicate conversations. No code, no stress, just delighted customers.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="rounded-2xl border-primary/15 bg-background/90 shadow-sm">
                <CardHeader className="gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-6" />
                  </span>
                  <CardTitle className="text-lg">Human-friendly AI</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 text-sm text-muted-foreground">
                  Train botinho once and it keeps learning from every resolved conversation, so each reply feels personal.
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-primary/15 bg-background/90 shadow-sm">
                <CardHeader className="gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Users className="size-6" />
                  </span>
                  <CardTitle className="text-lg">Built for teams</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 text-sm text-muted-foreground">
                  Collaborate in real-time, leave internal notes, and assign chats while the AI covers the repetitive tasks.
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex-1 space-y-6 rounded-3xl border border-primary/10 bg-background/70 p-8 shadow-xl">
            <h3 className="text-xl font-semibold">Why brands choose botinho</h3>
            <ul className="grid gap-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  01
                </span>
                <span>24/7 instant replies trained on your own knowledge base.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  02
                </span>
                <span>Seamless human handoff with full conversation history.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  03
                </span>
                <span>Smart automations for orders, reservations, and follow-ups.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  04
                </span>
                <span>Rich analytics to understand sentiment, conversions, and team performance.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="sessions" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">How it works</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Four simple sessions to launch your AI</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">
            We guide you through every stage so your team feels confident automating conversations without losing the
            human touch.
          </p>
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
              <CardContent className="pb-6 text-sm text-muted-foreground">
                {step.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="bg-muted/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 md:px-6">
          <div className="flex flex-col gap-6 text-center">
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">Capabilities</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
              Everything you need to automate WhatsApp conversations
            </h2>
            <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">
              Combine AI, automation, and analytics in one tool that your team enjoys using.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureHighlights.map((feature) => (
              <Card key={feature.title} className="rounded-2xl border border-primary/10 bg-background/90 p-0 shadow-sm">
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
              <h3 className="text-2xl font-semibold text-primary">Integrations that boost your workflows</h3>
              <p className="mt-2 max-w-2xl text-sm text-primary/80">
                Sync Shopify, RD Station, HubSpot, Google Calendar, iFood, Zendesk, and more. Use webhooks for custom
                flows tailored to your operations.
              </p>
            </div>
            <Button asChild className="rounded-full bg-primary px-6 py-5 text-sm font-semibold text-primary-foreground">
              <Link href="#contact" tabIndex={0}>
                Explore integrations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-6 text-center">
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">Trusted by teams</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Less busywork, happier customers</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">
            See how hospitality, retail, and services teams are creating delightful customer moments with botinho.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="rounded-2xl border border-primary/10 bg-background/85 p-0 shadow-md">
              <CardHeader className="items-start gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 text-amber-500" />
                  ))}
                </div>
                <CardDescription className="text-left text-base text-foreground">
                  “{testimonial.quote}”
                </CardDescription>
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
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">Pricing</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Simple plans that scale with you</h2>
            <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">
              Start for free, upgrade when you’re ready. Cancel anytime, no hidden fees, unlimited teammates on every
              plan.
            </p>
            <p className="text-sm text-muted-foreground">
              Pay yearly and save 20% on Starter, Pro, and Business plans.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "rounded-2xl border border-primary/10 bg-background/90 p-0 shadow-sm transition duration-200",
                  plan.highlight && "border-primary/60 shadow-xl",
                )}
              >
                {plan.highlight ? (
                  <Badge className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-primary-foreground">
                    Most loved
                  </Badge>
                ) : null}
                <CardHeader className="gap-3">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
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
          <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">FAQ</Badge>
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Answers to popular questions</h2>
          <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground">
            Everything you need to know about onboarding, security, and pricing. Still curious? We’re a DM away.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-12 rounded-2xl border border-primary/15 bg-background/80 p-6">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section id="contact" className="bg-muted/30">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 md:px-6">
          <div className="flex flex-col gap-4 text-center">
            <Badge className="mx-auto rounded-full bg-primary/10 px-4 py-1 text-primary">Contact</Badge>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">We’re here to help you automate</h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Want a guided tour or help scoping your use case? Reach out and we’ll respond within minutes during
              business hours.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border border-primary/10 bg-background/90 p-0 shadow-sm">
              <CardHeader className="gap-3">
                <CardTitle className="text-lg">Talk to a specialist</CardTitle>
                <CardDescription>
                  Available Monday to Friday, 8am–8pm (BRT). We’ll tailor a plan for your volume and workflows.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-8 text-sm text-muted-foreground">
                <Button asChild className="rounded-full">
                  <Link href="mailto:oi@botinho.ai" tabIndex={0}>
                    Email oi@botinho.ai
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" tabIndex={0}>
                    Message us on WhatsApp
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-primary/10 bg-primary/10 p-0 shadow-sm">
              <CardHeader className="gap-3">
                <CardTitle className="text-lg">Book a live demo</CardTitle>
                <CardDescription>
                  Pick a timeslot that works for you and see how botinho can fit your operations end-to-end.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-8 text-sm text-primary/80">
                <p>30-minute product walkthrough + live Q&A.</p>
                <Button asChild className="rounded-full bg-primary text-primary-foreground">
                  <Link href="https://cal.com/botinho/demo" target="_blank" rel="noreferrer" tabIndex={0}>
                    Schedule a demo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto my-16 w-full max-w-5xl rounded-3xl border border-primary/20 bg-primary/10 px-6 py-10 text-center md:px-12">
        <h2 className="text-balance text-3xl font-semibold text-primary sm:text-4xl">Ready to delight your customers on WhatsApp?</h2>
        <p className="mt-4 text-pretty text-base text-primary/80 md:text-lg">
          Join hundreds of fast-moving teams automating their conversations with botinho. No credit card required to get
          started.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="w-full rounded-full bg-primary px-8 py-5 text-sm font-semibold text-primary-foreground sm:w-auto">
            <Link href="/register" tabIndex={0}>
              Create your free account
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-full px-8 py-5 text-sm font-semibold sm:w-auto">
            <Link href="#pricing" tabIndex={0}>
              Compare plans
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
                <span className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60">
                  <Image src="/logo-white.png" alt="botinho logo" width={40} height={40} className="h-9 w-9" />
                </span>
                <span className="text-lg font-semibold">botinho.ai</span>
              </Link>
              <p className="max-w-md text-sm text-muted-foreground">
                Automate conversations, delight customers, and grow smarter with every WhatsApp interaction.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">Explore</span>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-foreground" tabIndex={0}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="text-sm font-semibold text-foreground">Get in touch</span>
                <Link href="mailto:oi@botinho.ai" className="transition hover:text-foreground" tabIndex={0}>
                  oi@botinho.ai
                </Link>
                <Link href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="transition hover:text-foreground" tabIndex={0}>
                  WhatsApp us
                </Link>
                <span className="text-sm">Rua Faria Lima, 1234 · São Paulo</span>
              </div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} botinho.ai. Todos os direitos reservados.</span>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="hover:text-foreground" tabIndex={0}>
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground" tabIndex={0}>
                Terms
              </Link>
              <Link href="/security" className="hover:text-foreground" tabIndex={0}>
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
