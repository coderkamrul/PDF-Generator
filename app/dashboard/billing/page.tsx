"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"

export default function BillingPage() {
  const { user } = useAuth()

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["10 conversions/month", "5 images per PDF", "Web app access"],
      current: user?.plan === "free",
    },
    {
      name: "Pro",
      price: "$19",
      features: ["500 conversions/month", "Unlimited images", "API access", "Priority support"],
      current: user?.plan === "pro",
    },
    {
      name: "Business",
      price: "$49",
      features: ["Unlimited conversions", "All features", "SLA guarantee", "Dedicated support"],
      current: user?.plan === "business",
    },
  ]

  return (
    <div>
      <DashboardHeader title="Billing" description="Manage your subscription and credits" />

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Credits Balance
            </CardTitle>
            <CardDescription>Your current credit balance for PDF conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{user?.credits || 0}</span>
              <span className="text-muted-foreground">credits remaining</span>
            </div>
            <Button className="mt-4 bg-transparent" variant="outline">
              Buy More Credits
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-foreground">Subscription Plans</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.current && (
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Current</span>
                )}
              </CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant={plan.current ? "secondary" : "default"} disabled={plan.current}>
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
