"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CreditCard, DollarSign, Check, Star, ShieldCheck, Zap, ArrowLeft } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { StripeForm } from "./payment/stripe-form"
import { PayPalPaymentButton } from "./payment/paypal-button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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

interface PlanUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialPlan?: Plan
}

export function PlanUpgradeModal({ isOpen, onClose, onSuccess, initialPlan }: PlanUpgradeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<any>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(initialPlan || null)
  const [clientSecret, setClientSecret] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    if (isOpen && initialPlan) {
      setSelectedPlan(initialPlan)
    }
  }, [isOpen, initialPlan])

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [settingsRes, plansRes] = await Promise.all([
            fetch("/api/settings/public"),
            fetch("/api/plans")
          ])
          
          const settingsData = await settingsRes.json()
          const plansData = await plansRes.json()
          
          setSettings(settingsData)
          setPlans(plansData.plans || [])
          
          if (settingsData.payment.stripePublicKey) {
            setStripePromise(loadStripe(settingsData.payment.stripePublicKey))
          }
        } catch (error) {
          console.error("Failed to load data", error)
          toast.error("Failed to load subscription options")
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [isOpen])

  const getPlanDetails = (plan: Plan) => {
    const isYearly = billingCycle === "yearly" && plan.yearlyEnabled
    return {
      price: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
      credits: isYearly ? plan.yearlyCredits : plan.monthlyCredits,
      features: isYearly ? plan.yearlyFeatures : plan.monthlyFeatures,
      interval: isYearly ? "year" : "month"
    }
  }

  const initStripePayment = async () => {
    if (!selectedPlan) return
    setIsProcessing(true)
    const { price, credits } = getPlanDetails(selectedPlan)
    
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "stripe",
          amount: price,
          credits: credits,
          interval: billingCycle
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setClientSecret(data.clientSecret)
      setTransactionId(data.transactionId)
      
      await createPlanUpgradeTransaction("stripe")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const createPlanUpgradeTransaction = async (provider: string) => {
    if (!selectedPlan) return
    const { price } = getPlanDetails(selectedPlan)

    const res = await fetch("/api/user/upgrade-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        plan: selectedPlan.key,
        paymentMethod: provider,
        amount: price,
        interval: billingCycle
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data.transactionId
  }

  const handleCODUpgrade = async () => {
    setIsProcessing(true)
    try {
      const transactionId = await createPlanUpgradeTransaction("cod")
      if (transactionId) {
        toast.success("Upgrade request submitted! Waiting for admin approval.")
      } else {
        toast.success("Plan updated successfully!")
      }
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit upgrade request")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return null

  const selectedPlanDetails = selectedPlan ? getPlanDetails(selectedPlan) : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-[950px] p-0 overflow-hidden gap-0 border-none shadow-2xl", selectedPlan ? "sm:max-w-[650px]" : "sm:max-w-[950px]")}>
        {!selectedPlan ? (
          <div className="flex flex-col">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 text-center pb-12">
              <DialogHeader>
                <DialogTitle className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2">
                  Upgrade Your Experience
                </DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the perfect plan to unlock premium features and supercharge your productivity.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 flex items-center justify-center gap-4">
                <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
                <Switch
                  checked={billingCycle === "yearly"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                />
                <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
                  Yearly <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Save 20%</span>
                </span>
              </div>
            </div>
            
            <div className="p-8 -mt-8">
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => {
                  const { price, credits, features, interval } = getPlanDetails(plan)

                  return (
                    <div 
                      key={plan._id} 
                      className={cn(
                        "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-1",
                        plan.isPopular ? "border-primary ring-1 ring-primary shadow-md" : "border-border"
                      )}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <div className="mb-6 text-center">
                        <h3 className="text-xl font-bold capitalize text-foreground">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline justify-center">
                          <span className="text-4xl font-extrabold tracking-tight">${price}</span>
                          <span className="text-sm font-medium text-muted-foreground ml-1">/{interval}</span>
                        </div>
                      </div>

                      <Separator className="mb-6" />

                      <ul className="mb-8 flex-1 space-y-3">
                        <li className="flex items-center text-sm font-medium">
                          <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                          </div>
                          {credits} Credits / {interval}
                        </li>
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-muted-foreground">
                            <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button 
                        onClick={() => setSelectedPlan(plan)} 
                        className={cn("w-full h-11 font-semibold text-base", plan.isPopular ? "shadow-lg shadow-primary/20" : "")} 
                        variant={plan.isPopular ? "default" : "outline"}
                      >
                        Select {plan.name}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
             <div className="border-b bg-muted/30 p-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mb-4 -ml-2 text-muted-foreground hover:text-foreground" 
                  onClick={() => setSelectedPlan(null)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Plans
                </Button>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      Complete your upgrade to <span className="font-semibold text-foreground">{selectedPlan.name}</span>
                    </DialogDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total due today</div>
                    <div className="text-3xl font-bold text-primary">${selectedPlanDetails?.price}</div>
                  </div>
                </div>
             </div>

            <div className="p-6">
              <div className="mb-8 rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{selectedPlan.name} Plan</span>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Credits included</span>
                  <span className="font-medium">{selectedPlanDetails?.credits} credits/{selectedPlanDetails?.interval}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Billing cycle</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{billingCycle}</span>
                    {selectedPlan.yearlyEnabled && (
                       <Switch 
                        checked={billingCycle === "yearly"} 
                        onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                        className="scale-75"
                       />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Payment Method</h4>
                
                {selectedPlanDetails?.price === 0 ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-lg bg-green-50/50 p-6 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Free Upgrade
                      </h4>
                      <p className="text-sm text-green-800/80 dark:text-green-200/80 leading-relaxed">
                        This plan is free of charge. Click below to confirm your upgrade.
                      </p>
                    </div>
                    <Button onClick={handleCODUpgrade} disabled={isProcessing} className="w-full h-11 text-base">
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Upgrade"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Tabs defaultValue={settings?.payment?.isStripeEnabled ? "stripe" : settings?.payment?.isPaypalEnabled ? "paypal" : "cod"} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50">
                      <TabsTrigger value="stripe" disabled={!settings?.payment?.isStripeEnabled} className="h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Card</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="paypal" disabled={!settings?.payment?.isPaypalEnabled} className="h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold italic">Pay</span><span className="font-bold text-blue-600 italic">Pal</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="cod" disabled={!settings?.payment?.isCodEnabled} className="h-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Manual</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-6 min-h-[200px]">
                      <TabsContent value="stripe" className="mt-0 space-y-4 animate-in fade-in-50 slide-in-from-bottom-2">
                        {clientSecret ? (
                          <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <StripeForm 
                              clientSecret={clientSecret} 
                              transactionId={transactionId} 
                              onSuccess={() => {
                                onSuccess()
                                onClose()
                              }} 
                            />
                          </Elements>
                        ) : (
                          <div className="space-y-4">
                            <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground bg-muted/30">
                              <ShieldCheck className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                              <p className="text-sm">Secure payment processing via Stripe</p>
                            </div>
                            <Button onClick={initStripePayment} disabled={isProcessing} className="w-full h-11 text-base shadow-lg shadow-primary/20">
                              {isProcessing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Pay ${selectedPlanDetails?.price} with Card
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="paypal" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
                        <div className="space-y-4">
                           <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground bg-muted/30 mb-4">
                              <p className="text-sm">You will be redirected to PayPal to complete your purchase securely.</p>
                            </div>
                          {settings?.payment?.paypalClientId && (
                            <PayPalScriptProvider options={{ clientId: settings.payment.paypalClientId, currency: settings.payment.currency }}>
                              <PayPalPaymentButton 
                                amount={selectedPlanDetails?.price || 0} 
                                credits={selectedPlanDetails?.credits || 0}
                                onSuccess={() => {
                                  onSuccess()
                                  onClose()
                                }} 
                              />
                            </PayPalScriptProvider>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="cod" className="mt-0 animate-in fade-in-50 slide-in-from-bottom-2">
                        <div className="space-y-6">
                          <div className="rounded-lg bg-blue-50/50 p-6 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Manual Payment Instructions
                            </h4>
                            <p className="text-sm text-blue-800/80 dark:text-blue-200/80 leading-relaxed">
                              Please contact our support team or follow the offline payment instructions provided by the admin. Your plan will be upgraded manually after payment verification.
                            </p>
                          </div>
                          <Button onClick={handleCODUpgrade} disabled={isProcessing} className="w-full h-11 text-base">
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Submit Upgrade Request"
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                )}
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Payments are secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
