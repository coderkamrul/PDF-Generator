"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Transaction {
  _id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  currency: string
  provider: "stripe" | "paypal" | "cod"
  status: "pending" | "completed" | "failed"
  creditsAmount: number
  planUpgrade?: string
  createdAt: string
}

export default function TransactionsPage() {
  const { data, isLoading, mutate } = useSWR<{ transactions: Transaction[] }>("/api/admin/transactions", fetcher)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const transactions = data?.transactions || []
  const pendingCOD = transactions.filter(t => t.provider === "cod" && t.status === "pending")

  const handleApprove = async (transactionId: string) => {
    setApprovingId(transactionId)
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, action: "approve" }),
      })

      if (!res.ok) throw new Error("Failed to approve transaction")

      toast.success("Transaction approved and credits added")
      mutate()
    } catch (error) {
      toast.error("Failed to approve transaction")
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (transactionId: string) => {
    setApprovingId(transactionId)
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, action: "reject" }),
      })

      if (!res.ok) throw new Error("Failed to reject transaction")

      toast.success("Transaction rejected")
      mutate()
    } catch (error) {
      toast.error("Failed to reject transaction")
    } finally {
      setApprovingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>
      case "pending":
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>
      case "failed":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div>
      <DashboardHeader
        title="Transactions"
        description="Manage payment transactions and approve COD orders"
      />

      {pendingCOD.length > 0 && (
        <Card className="mb-6 border-orange-500/50 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              Pending COD Approvals ({pendingCOD.length})
            </CardTitle>
            <CardDescription>These orders require manual approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCOD.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{transaction.userName}</span>
                        <span className="text-xs text-muted-foreground">{transaction.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.planUpgrade ? (
                        <Badge variant="outline" className="capitalize">
                          Plan: {transaction.planUpgrade}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Credits</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.currency} {transaction.amount}
                    </TableCell>
                    <TableCell>{transaction.creditsAmount} credits</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(transaction._id)}
                          disabled={approvingId === transaction._id}
                        >
                          {approvingId === transaction._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(transaction._id)}
                          disabled={approvingId === transaction._id}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No transactions yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{transaction.userName}</span>
                        <span className="text-xs text-muted-foreground">{transaction.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{transaction.provider}</TableCell>
                    <TableCell>
                      {transaction.currency} {transaction.amount}
                    </TableCell>
                    <TableCell>{transaction.creditsAmount}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
