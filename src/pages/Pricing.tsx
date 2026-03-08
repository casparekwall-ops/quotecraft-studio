import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const Pricing = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t.landing.starterName,
      price: "$9",
      period: t.landing.perMonth,
      description: t.landing.starterDesc,
      features: [t.landing.starterF1, t.landing.starterF2, t.landing.starterF3, t.landing.starterF4],
      cta: t.landing.startFree,
      popular: false,
    },
    {
      name: t.landing.proName,
      price: "$29",
      period: t.landing.perMonth,
      description: t.landing.proDesc,
      features: [t.landing.proF1, t.landing.proF2, t.landing.proF3, t.landing.proF4, t.landing.proF5],
      cta: t.landing.startFree,
      popular: true,
    },
    {
      name: t.landing.businessName,
      price: "$59",
      period: t.landing.perMonth,
      description: t.landing.businessDesc,
      features: [t.landing.businessF1, t.landing.businessF2, t.landing.businessF3, t.landing.businessF4, t.landing.businessF5],
      cta: t.landing.startFree,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="text-xl font-bold text-foreground">QuoteCraft</Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild><Link to="/login">{t.landing.logIn}</Link></Button>
            <Button size="sm" asChild><Link to="/signup">{t.landing.startFree}</Link></Button>
          </div>
        </div>
      </nav>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">{t.pricing.title}</h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">{t.pricing.desc}</p>
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
                    {t.landing.mostPopular}
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
            <p className="mb-4 text-muted-foreground">{t.pricing.customPlan}</p>
            <Button variant="outline" asChild>
              <a href="mailto:hello@quotecraft.com">{t.pricing.contactUs} <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
