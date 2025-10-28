import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageCircle, Zap, Clock, TrendingUp, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold">botinho.ai</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <Button asChild className="rounded-2xl bg-primary hover:bg-primary-hover">
              <Link href="/sign-up">Start Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="rounded-full px-4 py-1 bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1 inline" />
              Powered by AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Your friendly WhatsApp assistant — powered by AI
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Automate your customer support and never miss a message again. Perfect for restaurants, shops, and service
              businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="rounded-2xl bg-primary hover:bg-primary-hover text-base px-8">
                <Link href="/register">Start free in 5 minutes</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl text-base px-8 bg-transparent">
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">No credit card required • Free plan available</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">Everything you need to automate WhatsApp</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              botinho.ai connects to your WhatsApp Business and handles customer conversations with AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant AI Responses</h3>
              <p className="text-muted-foreground leading-relaxed">
                Reply to customers 24/7 with intelligent, context-aware responses trained on your business data.
              </p>
            </Card>

            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Train botinho with FAQs, promotions, and past conversations to match your brand voice perfectly.
              </p>
            </Card>

            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-muted-foreground leading-relaxed">
                Reduce response time from hours to seconds. Focus on growing your business, not answering messages.
              </p>
            </Card>

            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Boost Sales</h3>
              <p className="text-muted-foreground leading-relaxed">
                Never lose a customer due to slow responses. Convert inquiries into sales automatically.
              </p>
            </Card>

            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Human Handoff</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seamlessly transfer complex conversations to your team when needed. Full control, always.
              </p>
            </Card>

            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect your WhatsApp Business in minutes. No technical knowledge required.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Free Plan */}
            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Perfect for testing</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>50 messages/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>1 WhatsApp number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Basic AI training</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full rounded-2xl bg-transparent">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </Card>

            {/* Starter Plan */}
            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Starter</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">For small businesses</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>500 messages/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>1 WhatsApp number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Advanced AI training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Email support</span>
                  </li>
                </ul>
                <Button asChild className="w-full rounded-2xl bg-primary hover:bg-primary-hover">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card className="p-6 rounded-2xl shadow-lg border-2 border-primary relative hover:shadow-xl transition-all">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full px-3 py-1">
                Popular
              </Badge>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$19</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">For growing teams</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>2,000 messages/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>3 WhatsApp numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Premium AI training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Analytics dashboard</span>
                  </li>
                </ul>
                <Button asChild className="w-full rounded-2xl bg-primary hover:bg-primary-hover">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </Card>

            {/* Business Plan */}
            <Card className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Business</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$39</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">For enterprises</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>10,000 messages/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Unlimited numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Custom AI models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <span>API access</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full rounded-2xl bg-transparent">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">botinho.ai</span>
            </div>
            <p className="text-sm text-muted-foreground">Made with 💚 by botinho.ai</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
