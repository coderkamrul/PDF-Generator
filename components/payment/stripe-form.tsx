"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface StripeFormProps {
  clientSecret: string
  transactionId: string
  onSuccess: () => void
}

export function StripeForm({ clientSecret, transactionId, onSuccess }: StripeFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/billing`,
        },
        redirect: "if_required",
      })

      if (error) {
        toast.error(error.message || "Payment failed")
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Verify on backend
        const res = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId,
            providerTransactionId: paymentIntent.id,
          }),
        })

        if (res.ok) {
          toast.success("Payment successful! Credits added.")
          onSuccess()
        } else {
          toast.error("Payment verification failed")
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Pay Now
      </Button>
    </form>
  )
}
