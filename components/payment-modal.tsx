"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { StripeForm } from "./payment/stripe-form"
import { PayPalPaymentButton } from "./payment/paypal-button"
import { toast } from "sonner"

interface PaymentModalProps {
  trigger?: React.ReactNode
}

export function PaymentModal({ trigger }: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState(10) // Default $10
  const [credits, setCredits] = useState(100) // Default 100 credits
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [stripePromise, setStripePromise] = useState<any>(null)

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data)
        if (data.payment.stripePublicKey) {
          setStripePromise(loadStripe(data.payment.stripePublicKey))
        }
        setLoading(false)
      })
  }, [])

  // Update credits based on amount (simple logic for now: $1 = 10 credits)
  useEffect(() => {
    setCredits(amount * 10)
  }, [amount])

  const initStripePayment = async () => {
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "stripe",
          amount,
          credits,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setClientSecret(data.clientSecret)
      setTransactionId(data.transactionId)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleCodPayment = async () => {
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "cod",
          amount,
          credits,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      toast.success("Order placed! Please contact admin to complete payment.")
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Buy Credits</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
          <DialogDescription>
            Purchase credits to generate more PDFs. Rate: $1 = 10 Credits.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount ({settings?.payment?.currency})</Label>
              <Input 
                type="number" 
                min="1" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <Label>Credits</Label>
              <Input value={credits} disabled />
            </div>
          </div>

          <Tabs defaultValue="stripe" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stripe" disabled={!settings?.payment?.isStripeEnabled}>Stripe</TabsTrigger>
              <TabsTrigger value="paypal" disabled={!settings?.payment?.isPaypalEnabled}>PayPal</TabsTrigger>
              <TabsTrigger value="cod" disabled={!settings?.payment?.isCodEnabled}>COD</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stripe" className="mt-4">
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeForm 
                    clientSecret={clientSecret} 
                    transactionId={transactionId} 
                    onSuccess={() => setIsOpen(false)} 
                  />
                </Elements>
              ) : (
                <Button onClick={initStripePayment} className="w-full">
                  Proceed with Stripe
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="paypal" className="mt-4">
              {settings?.payment?.paypalClientId ? (
                <PayPalScriptProvider options={{ clientId: settings.payment.paypalClientId, currency: settings.payment.currency }}>
                  <PayPalPaymentButton 
                    amount={amount} 
                    credits={credits} 
                    onSuccess={() => setIsOpen(false)} 
                  />
                </PayPalScriptProvider>
              ) : (
                <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                  PayPal is enabled but the Client ID is missing. Please contact support.
                </div>
              )}
            </TabsContent>

            <TabsContent value="cod" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Pay manually via Cash on Delivery or Bank Transfer. Your credits will be added once the admin approves the transaction.
                </p>
                <Button onClick={handleCodPayment} className="w-full">
                  Place Order
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
