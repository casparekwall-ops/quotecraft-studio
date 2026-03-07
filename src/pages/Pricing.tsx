import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

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

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="text-xl font-bold text-foreground">QuoteCraft</Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
            <Button size="sm" asChild><Link to="/signup">Start free</Link></Button>
          </div>
        </div>
      </nav>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">Simple, transparent pricing</h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">Start free. Upgrade as you grow. No hidden fees.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-card transition-all duration-300 hover:shadow-soft ${
                  plan.popular ? "border-primary bg-card ring-1 ring-primary" : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </div>
                )}
                <h3 className="mb-1 text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? "default" : "outline"} className="w-full" asChild>
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="mb-4 text-muted-foreground">Need a custom plan for your team?</p>
            <Button variant="outline" asChild>
              <a href="mailto:hello@quotecraft.com">Contact us <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
