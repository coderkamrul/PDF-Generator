"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus, Pencil, Trash2, Check, X } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Plan {
  _id: string
  name: string
  key: string
  
  // Monthly
  monthlyPrice: number
  monthlyCredits: number
  monthlyApiLimit: number
  monthlyMaxApiKeys: number
  monthlyFeatures: string[]

  // Yearly
  yearlyEnabled: boolean
  yearlyPrice: number
  yearlyCredits: number
  yearlyApiLimit: number
  yearlyMaxApiKeys: number
  yearlyFeatures: string[]

  isPopular?: boolean
}

export default function AdminPlansPage() {
  const { data, isLoading, mutate } = useSWR<{ plans: Plan[] }>("/api/admin/plans", fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    
    monthlyPrice: 0,
    monthlyCredits: 100,
    monthlyApiLimit: 100,
    monthlyMaxApiKeys: 1,
    monthlyFeatures: "",

    yearlyEnabled: true,
    yearlyPrice: 0,
    yearlyCredits: 1200,
    yearlyApiLimit: 100,
    yearlyMaxApiKeys: 1,
    yearlyFeatures: "",

    isPopular: false
  })

  const resetForm = () => {
    setFormData({
      name: "",
      key: "",
      
      monthlyPrice: 0,
      monthlyCredits: 100,
      monthlyApiLimit: 100,
      monthlyMaxApiKeys: 1,
      monthlyFeatures: "",

      yearlyEnabled: true,
      yearlyPrice: 0,
      yearlyCredits: 1200,
      yearlyApiLimit: 100,
      yearlyMaxApiKeys: 1,
      yearlyFeatures: "",

      isPopular: false
    })
    setEditingPlan(null)
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      key: plan.key,
      
      monthlyPrice: plan.monthlyPrice || 0,
      monthlyCredits: plan.monthlyCredits || 100,
      monthlyApiLimit: plan.monthlyApiLimit || 100,
      monthlyMaxApiKeys: plan.monthlyMaxApiKeys || 1,
      monthlyFeatures: (plan.monthlyFeatures || []).join("\n"),

      yearlyEnabled: plan.yearlyEnabled !== false,
      yearlyPrice: plan.yearlyPrice || 0,
      yearlyCredits: plan.yearlyCredits || 1200,
      yearlyApiLimit: plan.yearlyApiLimit || 100,
      yearlyMaxApiKeys: plan.yearlyMaxApiKeys || 1,
      yearlyFeatures: (plan.yearlyFeatures || []).join("\n"),

      isPopular: plan.isPopular || false
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return

    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete plan")
      toast.success("Plan deleted successfully")
      mutate()
    } catch (error) {
      toast.error("Failed to delete plan")
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        monthlyFeatures: formData.monthlyFeatures.split("\n").filter(f => f.trim() !== ""),
        yearlyFeatures: formData.yearlyFeatures.split("\n").filter(f => f.trim() !== "")
      }

      const url = editingPlan ? `/api/admin/plans/${editingPlan._id}` : "/api/admin/plans"
      const method = editingPlan ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save plan")

      toast.success(`Plan ${editingPlan ? "updated" : "created"} successfully`)
      setIsDialogOpen(false)
      resetForm()
      mutate()
    } catch (error) {
      toast.error("Failed to save plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateSavings = () => {
    if (formData.monthlyPrice <= 0 || formData.yearlyPrice <= 0) return 0
    const monthlyCost = formData.monthlyPrice * 12
    const savings = ((monthlyCost - formData.yearlyPrice) / monthlyCost) * 100
    return Math.round(savings)
  }

  return (
    <div>
      <DashboardHeader
        title="Plan Management"
        description="Create and manage subscription plans"
      >
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle>
              <DialogDescription>Configure plan details, pricing, and benefits for each billing cycle.</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Pro Plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plan Key (Unique)</Label>
                  <Input 
                    value={formData.key} 
                    onChange={(e) => setFormData({...formData, key: e.target.value})} 
                    placeholder="e.g. pro"
                  />
                </div>
              </div>

              <Tabs defaultValue="monthly" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly Configuration</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly Configuration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly" className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/10">
                  <div className="space-y-2">
                    <Label>Monthly Price ($)</Label>
                    <Input 
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthlyPrice} 
                      onChange={(e) => setFormData({...formData, monthlyPrice: parseFloat(e.target.value)})} 
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Credits</Label>
                      <Input 
                        type="number"
                        value={formData.monthlyCredits} 
                        onChange={(e) => setFormData({...formData, monthlyCredits: parseInt(e.target.value)})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Limit (Daily)</Label>
                      <Input 
                        type="number"
                        value={formData.monthlyApiLimit} 
                        onChange={(e) => setFormData({...formData, monthlyApiLimit: parseInt(e.target.value)})} 
                        placeholder="-1 for unlimited"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max API Keys</Label>
                      <Input 
                        type="number"
                        value={formData.monthlyMaxApiKeys} 
                        onChange={(e) => setFormData({...formData, monthlyMaxApiKeys: parseInt(e.target.value)})} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Monthly Features (One per line)</Label>
                    <Textarea 
                      value={formData.monthlyFeatures} 
                      onChange={(e) => setFormData({...formData, monthlyFeatures: e.target.value})} 
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      rows={5}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="yearly" className="space-y-4 mt-4 p-4 border rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={formData.yearlyEnabled} 
                        onCheckedChange={(checked) => setFormData({...formData, yearlyEnabled: checked})} 
                      />
                      <Label>Enable Yearly Billing</Label>
                    </div>
                    {formData.yearlyEnabled && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {calculateSavings()}% Savings vs Monthly
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4 opacity-100 data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none" data-disabled={!formData.yearlyEnabled}>
                    <div className="space-y-2">
                      <Label>Yearly Price ($)</Label>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.yearlyPrice} 
                        onChange={(e) => setFormData({...formData, yearlyPrice: parseFloat(e.target.value)})} 
                        disabled={!formData.yearlyEnabled}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Credits</Label>
                        <Input 
                          type="number"
                          value={formData.yearlyCredits} 
                          onChange={(e) => setFormData({...formData, yearlyCredits: parseInt(e.target.value)})} 
                          disabled={!formData.yearlyEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>API Limit (Daily)</Label>
                        <Input 
                          type="number"
                          value={formData.yearlyApiLimit} 
                          onChange={(e) => setFormData({...formData, yearlyApiLimit: parseInt(e.target.value)})} 
                          placeholder="-1 for unlimited"
                          disabled={!formData.yearlyEnabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max API Keys</Label>
                        <Input 
                          type="number"
                          value={formData.yearlyMaxApiKeys} 
                          onChange={(e) => setFormData({...formData, yearlyMaxApiKeys: parseInt(e.target.value)})} 
                          disabled={!formData.yearlyEnabled}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Yearly Features (One per line)</Label>
                      <Textarea 
                        value={formData.yearlyFeatures} 
                        onChange={(e) => setFormData({...formData, yearlyFeatures: e.target.value})} 
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        rows={5}
                        className="font-mono text-sm"
                        disabled={!formData.yearlyEnabled}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setFormData({...formData, yearlyFeatures: formData.monthlyFeatures})}
                        disabled={!formData.yearlyEnabled}
                      >
                        Copy from Monthly
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={formData.isPopular} 
                  onCheckedChange={(checked) => setFormData({...formData, isPopular: checked})} 
                />
                <Label>Mark as Popular</Label>
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <Card>
        <CardHeader>
          <CardTitle>Active Plans</CardTitle>
          <CardDescription>Manage your subscription tiers and pricing models</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Yearly</TableHead>
                  <TableHead>Credits (M/Y)</TableHead>
                  <TableHead>Limits (M/Y)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.plans?.map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium">
                      {plan.name}
                      {plan.isPopular && <Badge variant="secondary" className="ml-2 text-xs">Popular</Badge>}
                    </TableCell>
                    <TableCell>${plan.monthlyPrice}</TableCell>
                    <TableCell>
                      {plan.yearlyEnabled ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">${plan.yearlyPrice}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Disabled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {plan.monthlyCredits} / {plan.yearlyEnabled ? plan.yearlyCredits : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        <div>API: {plan.monthlyApiLimit === -1 ? "Unl" : plan.monthlyApiLimit} / {plan.yearlyEnabled ? (plan.yearlyApiLimit === -1 ? "Unl" : plan.yearlyApiLimit) : '-'}</div>
                        <div>Keys: {plan.monthlyMaxApiKeys} / {plan.yearlyEnabled ? plan.yearlyMaxApiKeys : '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(plan._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.plans || data.plans.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No plans found. Create one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
