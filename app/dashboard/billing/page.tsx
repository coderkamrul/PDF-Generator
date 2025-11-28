
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap, Clock, Loader2 } from "lucide-react"
import { PaymentModal } from "@/components/payment-modal"
import { PlanUpgradeModal } from "@/components/plan-upgrade-modal"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Plan {
  _id: string
  name: string
  key: string
  
  monthlyPrice: number
  monthlyCredits: number
  monthlyFeatures: string[]

  yearlyEnabled: boolean
  yearlyPrice: number
  yearlyCredits: number
  yearlyFeatures: string[]

  isPopular?: boolean
}

export default function BillingPage() {
  const { user, refreshUser } = useAuth()
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  
  const { data: pendingData, mutate: mutatePending } = useSWR(
    user ? "/api/user/pending-upgrade" : null,
    fetcher
  )

  const { data: plansData, isLoading: plansLoading } = useSWR<{ plans: Plan[] }>(
    "/api/plans",
    fetcher
  )

  const plans = plansData?.plans || []

  const handleUpgradeClick = (plan: Plan) => {
    setSelectedPlan(plan)
    setUpgradeModalOpen(true)
  }

  const handleUpgradeSuccess = async () => {
    await refreshUser()
    await mutatePending()
    setUpgradeModalOpen(false)
  }

  const isPlanPending = (planKey: string) => {
    return pendingData?.hasPendingUpgrade && pendingData?.pendingPlan === planKey
  }

  const isCurrentPlan = (planKey: string) => {
    return user?.plan === planKey
  }

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
            <div className="mt-4">
              <PaymentModal trigger={<Button variant="outline">Buy More Credits</Button>} />
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-foreground">Subscription Plans</h2>
      
      {plansLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-muted-foreground">No plans available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isPending = isPlanPending(plan.key)
            const isCurrent = isCurrentPlan(plan.key)
            
            return (
              <Card key={plan._id} className={isCurrent ? "border-primary" : isPending ? "border-orange-500" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {isCurrent && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Current</span>
                    )}
                    {isPending && (
                      <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  {plan.yearlyEnabled && (
                    <div className="text-xs text-muted-foreground mt-1">
                      or ${plan.yearlyPrice}/year
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 text-primary" />
                      {plan.monthlyCredits} Credits
                    </li>
                    {plan.monthlyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    variant={isCurrent ? "secondary" : isPending ? "outline" : "default"}
                    disabled={isCurrent || isPending}
                    onClick={() => handleUpgradeClick(plan)}
                  >
                    {isCurrent 
                      ? "Current Plan" 
                      : isPending 
                      ? "Pending Approval" 
                      : plan.monthlyPrice === 0 
                      ? "Free Plan" 
                      : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {selectedPlan && (
        <PlanUpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          onSuccess={handleUpgradeSuccess}
          initialPlan={selectedPlan}
        />
      )}
    </div>
  )
}
