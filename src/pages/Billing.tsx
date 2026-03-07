import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    features: ["Up to 10 quotes/month", "Basic PDF export", "Customer management"],
    current: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["Unlimited quotes", "Invoices", "Custom branding", "Shareable links"],
    current: true,
  },
  {
    name: "Business",
    price: "$59",
    period: "/month",
    features: ["Everything in Pro", "Team accounts", "Priority support", "API access"],
    current: false,
  },
];

const Billing = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Current plan */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Current Plan</div>
              <div className="text-xl font-bold text-foreground">Pro Plan</div>
              <div className="text-sm text-muted-foreground">$29/month · Renews Mar 15, 2026</div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Manage Subscription
              </Button>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-semibold text-foreground">Usage This Period</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Quotes Created</div>
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-xs text-muted-foreground">Unlimited on Pro</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Invoices Created</div>
              <div className="text-2xl font-bold text-foreground">18</div>
              <div className="text-xs text-muted-foreground">Unlimited on Pro</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Customers</div>
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground">Unlimited</div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h2 className="mb-4 font-semibold text-foreground">Available Plans</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 shadow-card ${
                  plan.current ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-1 mb-4 flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    {plan.price === "$9" ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Billing;
