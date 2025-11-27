import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "For people looking to explore.",
      features: ["10 PDF conversions/month", "5 images per PDF", "Basic page sizes", "Web app access"],
      cta: "Start Building",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For power users and small teams.",
      features: [
        "500 PDF conversions/month",
        "Unlimited images per PDF",
        "All page sizes & orientations",
        "API access",
        "Priority processing",
      ],
      cta: "Upgrade to Pro",
      highlighted: false,
    },
    {
      name: "Business",
      price: "$49",
      period: "/month",
      description: "For teams needing higher limits.",
      features: [
        "Unlimited PDF conversions",
        "Unlimited images per PDF",
        "Custom page sizes",
        "Full API access",
        "Dedicated support",
        "SLA guarantee",
      ],
      cta: "Start Business Plan",
      highlighted: true,
    },
  ]

  return (
    <section className="py-20" id="pricing">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
            <span className="text-xs font-medium text-primary">New</span>
            <span className="text-xs text-muted-foreground">Credit-Based Pricing Available</span>
          </div>
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">Plans and Pricing</h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Get started immediately for free. Upgrade for more conversions and API access.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 ${
                plan.highlighted ? "border-primary bg-card" : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-6">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
