"use client"

import { PayPalButtons } from "@paypal/react-paypal-js"
import { toast } from "sonner"

interface PayPalButtonProps {
  amount: number
  credits: number
  onSuccess: () => void
}

export function PayPalPaymentButton({ amount, credits, onSuccess }: PayPalButtonProps) {
  return (
    <PayPalButtons
      style={{ layout: "vertical" }}
      createOrder={async (data, actions) => {
        try {
          const res = await fetch("/api/payments/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider: "paypal",
              amount,
              credits,
            }),
          })
          const json = await res.json()
          if (json.error) throw new Error(json.error)
          return json.orderId
        } catch (err: any) {
          toast.error(err.message)
          throw err
        }
      }}
      onApprove={async (data, actions) => {
        try {
          // Verify on backend
          // We need the transactionId from the create step, but createOrder only returns orderId to PayPal.
          // We can store transactionId in localStorage or pass it via metadata if PayPal supports it.
          // Alternatively, we can lookup the transaction by orderId (providerTransactionId) on the backend.
          // Let's rely on providerTransactionId (data.orderID).

          // First we need to find the transaction ID associated with this order ID.
          // But wait, `createTransaction` returns `transactionId`.
          // We didn't save it anywhere accessible here easily.
          // We can modify `createOrder` to return `transactionId` but `createOrder` expects a string (orderID).
          
          // Actually, we can just send the orderID to verify, and the backend can find the transaction by providerTransactionId?
          // No, `createTransaction` saves `providerTransactionId`?
          // In `create/route.ts`, for PayPal, we return `orderId`. We didn't save `orderId` to the transaction yet because we just got it?
          // Wait, `createPaypalOrder` returns the order object which has ID.
          // We should update the transaction with the order ID in `create/route.ts`.
          
          // Let's fix `create/route.ts` first to save the providerTransactionId.
          
          const res = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // We don't have transactionId here easily.
              // But we can search by providerTransactionId if we saved it.
              // Let's assume we fix create/route.ts to save it.
              providerTransactionId: data.orderID,
              transactionId: "LOOKUP_BY_PROVIDER_ID", // Special flag or handle in backend
            }),
          })

          // Wait, `verify` endpoint expects `transactionId`.
          // I should probably update `verify` to allow lookup by `providerTransactionId`.
          
          if (res.ok) {
            toast.success("Payment successful! Credits added.")
            onSuccess()
          } else {
            toast.error("Payment verification failed")
          }
        } catch (err) {
          console.error(err)
          toast.error("Payment failed")
        }
      }}
    />
  )
}
