
"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, ShieldOff, Loader2, Settings2, Search, Plus } from "lucide-react"
import useSWR from "swr"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface User {
  id: string
  name: string
  email: string
  plan: string
  credits: number
  isAdmin: boolean
  isDisabled?: boolean
  apiLimit?: number | null
  maxApiKeys?: number | null
  createdAt: string
}

export default function AdminUsersPage() {
  const { data, isLoading, mutate } = useSWR<{ users: User[] }>("/api/admin/users", fetcher)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [customLimit, setCustomLimit] = useState<string>("")
  const [customKeyLimit, setCustomKeyLimit] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [creditUser, setCreditUser] = useState<User | null>(null)
  const [creditsToAdd, setCreditsToAdd] = useState("")
  const [isAddingCredits, setIsAddingCredits] = useState(false)

  const users = data?.users || []
  
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const isUserDisabled = (user: User) => {
    return user.isDisabled === true || String(user.isDisabled) === "true"
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    setIsUpdating(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "toggleAdmin", isAdmin: !currentStatus }),
      })

      if (!res.ok) throw new Error("Failed to update admin status")

      toast.success(`Admin status ${!currentStatus ? "granted" : "revoked"}`)
      mutate()
    } catch (error) {
      toast.error("Failed to update admin status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleToggleDisable = async (userId: string, currentStatus: boolean) => {
    setIsUpdating(true)
    try {
      const action = currentStatus ? "enable" : "disable"
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      })

      if (!res.ok) throw new Error(`Failed to ${action} user`)

      toast.success(`User ${currentStatus ? "enabled" : "disabled"} successfully`)
      mutate()
    } catch (error) {
      toast.error(`Failed to ${currentStatus ? "enable" : "disable"} user`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddCredits = async () => {
    if (!creditUser || !creditsToAdd) return
    const amount = Number.parseInt(creditsToAdd)
    if (isNaN(amount) || amount <= 0) return

    setIsAddingCredits(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: creditUser.id, action: "add_credits", amount }),
      })

      if (res.ok) {
        toast.success("Credits added successfully")
        mutate()
        setCreditUser(null)
        setCreditsToAdd("")
      } else {
        throw new Error("Failed to add credits")
      }
    } catch (error) {
      toast.error("Failed to add credits")
    } finally {
      setIsAddingCredits(false)
    }
  }

  const handleSetLimits = async () => {
    if (!selectedUser) return
    
    setIsUpdating(true)
    try {
      // Update API Limit
      const apiLimit = customLimit === "" ? null : parseInt(customLimit)
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, action: "setApiLimit", apiLimit }),
      })

      // Update Max Keys Limit
      const maxApiKeys = customKeyLimit === "" ? null : parseInt(customKeyLimit)
      await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, action: "setMaxApiKeys", maxApiKeys }),
      })

      toast.success("Limits updated successfully")
      setSelectedUser(null)
      setCustomLimit("")
      setCustomKeyLimit("")
      mutate()
    } catch (error) {
      toast.error("Failed to update limits")
    } finally {
      setIsUpdating(false)
    }
  }

  const getDefaultLimit = (plan: string) => {
    const limits: Record<string, string> = {
      free: "10",
      pro: "500",
      business: "Unlimited",
    }
    return limits[plan] || "10"
  }

  const getDefaultKeyLimit = (plan: string) => {
    const limits: Record<string, string> = {
      free: "1",
      pro: "5",
      business: "20",
    }
    return limits[plan] || "1"
  }

  return (
    <div>
      <DashboardHeader
        title="User Management"
        description="Manage users, admin roles, and limits"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="w-64 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No users found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>API Limit</TableHead>
                  <TableHead>Max Keys</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const disabled = isUserDisabled(user)
                  return (
                    <TableRow key={user.id} className={disabled ? "opacity-60 bg-muted/50" : ""}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.credits}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {user.apiLimit !== undefined && user.apiLimit !== null
                          ? user.apiLimit === -1
                            ? "Unlimited"
                            : `${user.apiLimit}/day`
                          : `${getDefaultLimit(user.plan)}/day`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {user.maxApiKeys !== undefined && user.maxApiKeys !== null
                          ? user.maxApiKeys
                          : getDefaultKeyLimit(user.plan)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge className="bg-primary">
                          <Shield className="mr-1 h-3 w-3" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.isDisabled ? (
                          <Badge variant="destructive" className="mr-2">Disabled</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600 border-green-600 mr-2">Active</Badge>
                        )}
                        {!user.isAdmin && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleToggleDisable(user.id, !!user.isDisabled)}
                            disabled={isUpdating}
                            title={user.isDisabled ? "Enable User" : "Disable User"}
                          >
                            {user.isDisabled ? (
                              <ShieldOff className="h-4 w-4 text-destructive" />
                            ) : (
                              <Shield className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCreditUser(user)}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Credits
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user)
                                setCustomLimit(
                                  user.apiLimit !== undefined && user.apiLimit !== null
                                    ? user.apiLimit === -1
                                      ? ""
                                      : user.apiLimit.toString()
                                    : ""
                                )
                                setCustomKeyLimit(
                                  user.maxApiKeys !== undefined && user.maxApiKeys !== null
                                    ? user.maxApiKeys.toString()
                                    : ""
                                )
                              }}
                            >
                              <Settings2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Set Limits for {user.name}</DialogTitle>
                              <DialogDescription>
                                Configure API request limits and maximum API keys.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Custom API Limit (requests/day)</Label>
                                <Input
                                  type="number"
                                  placeholder={`Default: ${getDefaultLimit(user.plan)}/day`}
                                  value={customLimit}
                                  onChange={(e) => setCustomLimit(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Enter -1 for unlimited, or leave empty to use plan default
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label>Max API Keys</Label>
                                <Input
                                  type="number"
                                  placeholder={`Default: ${getDefaultKeyLimit(user.plan)}`}
                                  value={customKeyLimit}
                                  onChange={(e) => setCustomKeyLimit(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Leave empty to use plan default
                                </p>
                              </div>

                              <Button onClick={handleSetLimits} disabled={isUpdating} className="w-full">
                                {isUpdating ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  "Update Limits"
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant={user.isAdmin ? "destructive" : "default"}
                          onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                          disabled={isUpdating}
                        >
                          {user.isAdmin ? (
                            <>
                              <ShieldOff className="mr-1 h-4 w-4" />
                              Revoke Admin
                            </>
                          ) : (
                            <>
                              <Shield className="mr-1 h-4 w-4" />
                              Make Admin
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!creditUser} onOpenChange={() => setCreditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>Add credits to {creditUser?.name}&apos;s account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current balance: {creditUser?.credits} credits</p>
              <Input
                type="number"
                placeholder="Amount to add"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreditUser(null)} disabled={isAddingCredits}>
              Cancel
            </Button>
            <Button onClick={handleAddCredits} disabled={isAddingCredits}>
              {isAddingCredits ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Credits
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
