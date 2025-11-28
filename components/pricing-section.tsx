"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import useSWR from "swr"

interface Plan {
  _id: string
  name: string
  
  monthlyPrice: number
  monthlyCredits: number
  monthlyFeatures: string[]

  yearlyEnabled: boolean
  yearlyPrice: number
  yearlyCredits: number
  yearlyFeatures: string[]

  isPopular?: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PricingSection() {
  const { user } = useAuth()
  const { data, error, isLoading } = useSWR<{ plans: Plan[] }>("/api/plans", fetcher)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = data?.plans || []

  const calculateSavings = (plan: Plan) => {
    if (plan.monthlyPrice <= 0 || plan.yearlyPrice <= 0) return 0
    const monthlyCost = plan.monthlyPrice * 12
    const savings = ((monthlyCost - plan.yearlyPrice) / monthlyCost) * 100
    return Math.round(savings)
  }

  // Find max savings to display in the toggle
  const maxSavings = plans.reduce((max, plan) => {
    if (!plan.yearlyEnabled) return max
    const savings = calculateSavings(plan)
    return savings > max ? savings : max
  }, 0)

  return (
    <section className="py-24 bg-background" id="pricing">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium text-primary">New</span>
            <span className="text-xs text-muted-foreground">Credit-Based Pricing Available</span>
          </div>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">Plans and Pricing</h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Get started immediately for free. Upgrade for more conversions and API access.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <Switch
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
            />
            <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Save up to {maxSavings}%</span>
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-red-500">
            Failed to load plans. Please try again later.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const isYearly = billingCycle === "yearly" && plan.yearlyEnabled
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
              const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits
              const features = isYearly ? plan.yearlyFeatures : plan.monthlyFeatures
              
              return (
                <div
                  key={plan._id}
                  className={`relative rounded-[2rem] border p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${
                    plan.isPopular ? "border-primary bg-card shadow-lg shadow-primary/5" : "border-border bg-card/50"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-6">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground capitalize">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-4xl font-bold text-foreground">${price}</span>
                      <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {credits} credits included
                    </p>
                  </div>

                  <ul className="mb-6 space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={user ? "/dashboard/billing" : "/register"}>
                    <Button className="w-full" variant={plan.isPopular ? "default" : "outline"}>
                      {user ? "Upgrade" : "Get Started"}
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
