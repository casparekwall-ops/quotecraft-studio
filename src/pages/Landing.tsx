import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Receipt,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Professional Quotes",
    description:
      "Create beautiful, branded quotes in seconds. Add line items, tax, discounts and send to customers instantly.",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: Receipt,
    title: "Invoices That Get Paid",
    description:
      "Convert accepted quotes to invoices with one click. Track payment status and send reminders.",
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconColor: "text-cyan-500",
  },
  {
    icon: Users,
    title: "Customer Management",
    description:
      "Keep all your customer details organized. Auto-fill quotes and invoices with saved information.",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "text-pink-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built for speed. Create a full quote in under 60 seconds. No bloat, no complexity.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-500",
  },
];

const steps = [
  {
    step: "01",
    title: "Add your customers",
    description: "Import or add customer details once. Reuse them across all your documents.",
    color: "text-violet-500",
  },
  {
    step: "02",
    title: "Create a quote",
    description: "Add line items, set your terms, and preview your professional quote.",
    color: "text-cyan-500",
  },
  {
    step: "03",
    title: "Send & get accepted",
    description: "Share a link with your customer. They can view and accept it online.",
    color: "text-pink-500",
  },
  {
    step: "04",
    title: "Convert to invoice",
    description: "One click converts an accepted quote into a ready-to-send invoice.",
    color: "text-amber-500",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for solo contractors getting started.",
    features: [
      "Up to 10 quotes per month",
      "Basic PDF export",
      "Customer management",
      "Email support",
    ],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses that need more power.",
    features: [
      "Unlimited quotes",
      "Invoices & convert to invoice",
      "Custom branding",
      "Priority support",
      "Shareable links",
    ],
    cta: "Start free",
    popular: true,
  },
  {
    name: "Business",
    price: "$59",
    period: "/month",
    description: "For teams ready to scale operations.",
    features: [
      "Everything in Pro",
      "Team accounts (coming soon)",
      "Future integrations",
      "Priority support",
      "API access (coming soon)",
    ],
    cta: "Start free",
    popular: false,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">QuoteCraft</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Start free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="absolute top-20 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute top-40 right-1/4 -z-10 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-3xl" />

        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-4 py-1.5 text-sm text-muted-foreground shadow-card">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            Built for contractors & service businesses
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            From quote to invoice
            <br />
            <span className="gradient-text">in seconds.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            QuoteCraft helps contractors and service businesses create professional quotes, send invoices and win more jobs — with less admin.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Start free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#pricing">View pricing</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Everything you need to run your quoting
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Simple, powerful tools that let you focus on your trade — not paperwork.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group rounded-2xl border border-border bg-gradient-to-br ${feature.gradient} p-8 shadow-card transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5`}
              >
                <div className={`mb-4 inline-flex rounded-xl bg-card p-3 shadow-sm ${feature.iconColor}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative overflow-hidden border-y border-border py-20 md:py-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              How it works
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Get up and running in minutes. No training required.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="text-center md:text-left">
                <div className={`mb-3 text-5xl font-extrabold ${step.color} opacity-30`}>
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Start free. Upgrade as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-card transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5 ${
                  plan.popular
                    ? "border-transparent gradient-border bg-card"
                    : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary rounded-full px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </div>
                )}
                <h3 className="mb-1 text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mb-6 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border py-20 md:py-28">
        <div className="absolute inset-0 -z-10 gradient-mesh" />
        <div className="absolute bottom-0 left-1/4 -z-10 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute top-10 right-1/4 -z-10 h-60 w-60 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Ready to streamline your quoting?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of contractors saving hours every week with QuoteCraft.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/signup">
              Get started for free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="gradient-primary flex h-7 w-7 items-center justify-center rounded-lg">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">QuoteCraft</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Log in</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QuoteCraft
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
