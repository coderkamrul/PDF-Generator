"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Key, Activity, Ban, Plus, Trash2, Search, Loader2, CheckCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface User {
  id: string
  email: string
  name: string
  plan: "free" | "pro" | "business"
  credits: number
  isAdmin: boolean
  createdAt: string
}

interface PDFFile {
  id: string
  userId: string
  filename: string
  size: string
  pages: number
  createdAt: string
  apiGenerated: boolean
  downloadUrl: string
}

interface ApiKey {
  id: string
  userId: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
  usageCount: number
}

interface UsageLog {
  id: string
  userId: string
  action: string
  details: string
  ipAddress: string
  createdAt: string
}

export default function AdminPage() {
  const { data: statsData, isLoading: statsLoading } = useSWR("/api/admin/stats", fetcher)
  const {
    data: usersData,
    isLoading: usersLoading,
    mutate: mutateUsers,
  } = useSWR<{ users: User[] }>("/api/admin/users", fetcher)
  const {
    data: filesData,
    isLoading: filesLoading,
    mutate: mutateFiles,
  } = useSWR<{ files: PDFFile[] }>("/api/admin/files", fetcher)
  const { data: keysData, isLoading: keysLoading } = useSWR<{ keys: ApiKey[] }>("/api/admin/api-keys", fetcher)
  const { data: logsData, isLoading: logsLoading } = useSWR<{ logs: UsageLog[] }>("/api/admin/logs", fetcher)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [creditsToAdd, setCreditsToAdd] = useState("")
  const [isAddingCredits, setIsAddingCredits] = useState(false)
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null)
  const [isDeletingFile, setIsDeletingFile] = useState(false)
  const [disableUserId, setDisableUserId] = useState<string | null>(null)
  const [isDisabling, setIsDisabling] = useState(false)

  const users = usersData?.users || []
  const files = filesData?.files || []
  const apiKeys = keysData?.keys || []
  const usageLogs = logsData?.logs || []

  const stats = [
    { label: "Total Users", value: statsLoading ? "..." : statsData?.totalUsers || 0, icon: Users },
    { label: "PDFs Generated", value: statsLoading ? "..." : statsData?.totalFiles || 0, icon: FileText },
    { label: "API Keys", value: statsLoading ? "..." : statsData?.totalApiKeys || 0, icon: Key },
    { label: "API Requests", value: statsLoading ? "..." : statsData?.totalUsage || 0, icon: Activity },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCredits = async () => {
    if (!selectedUser || !creditsToAdd) return
    const amount = Number.parseInt(creditsToAdd)
    if (isNaN(amount) || amount <= 0) return

    setIsAddingCredits(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, action: "add_credits", amount }),
      })

      if (res.ok) {
        mutateUsers()
      }
    } catch (error) {
      console.error("Add credits error:", error)
    } finally {
      setIsAddingCredits(false)
      setSelectedUser(null)
      setCreditsToAdd("")
    }
  }

  const handleDeleteFile = async () => {
    if (!deleteFileId) return
    setIsDeletingFile(true)

    try {
      const res = await fetch(`/api/admin/files?id=${deleteFileId}`, { method: "DELETE" })
      if (res.ok) {
        mutateFiles()
      }
    } catch (error) {
      console.error("Delete file error:", error)
    } finally {
      setIsDeletingFile(false)
      setDeleteFileId(null)
    }
  }

  const handleDisableUser = async () => {
    if (!disableUserId) return
    setIsDisabling(true)

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: disableUserId, action: "disable" }),
      })

      if (res.ok) {
        mutateUsers()
      }
    } catch (error) {
      console.error("Disable user error:", error)
    } finally {
      setIsDisabling(false)
      setDisableUserId(null)
    }
  }

  return (
    <div>
      <DashboardHeader title="Admin Dashboard" description="Manage users, files, and system settings" />

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="logs">Usage Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Manage all registered users</CardDescription>
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
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No users found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs capitalize text-primary">
                            {user.plan}
                          </span>
                        </TableCell>
                        <TableCell>{user.credits}</TableCell>
                        <TableCell>
                          {user.isAdmin ? (
                            <span className="inline-flex items-center gap-1 text-xs text-primary">
                              <CheckCircle className="h-3 w-3" /> Admin
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">User</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                              <Plus className="mr-1 h-3 w-3" />
                              Credits
                            </Button>
                            {!user.isAdmin && (
                              <Button variant="ghost" size="icon" onClick={() => setDisableUserId(user.id)}>
                                <Ban className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Generated Files</CardTitle>
              <CardDescription>View and manage all generated PDFs</CardDescription>
            </CardHeader>
            <CardContent>
              {filesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : files.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No files generated yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.filename}</TableCell>
                        <TableCell>
                          <code className="text-xs">{file.userId.slice(0, 8)}...</code>
                        </TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.pages}</TableCell>
                        <TableCell>{file.apiGenerated ? "API" : "Web"}</TableCell>
                        <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setDeleteFileId(file.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>View all API keys across users</CardDescription>
            </CardHeader>
            <CardContent>
              {keysLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : apiKeys.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No API keys created yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <code className="text-xs">{key.userId.slice(0, 8)}...</code>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">{key.key}</code>
                        </TableCell>
                        <TableCell>{key.usageCount} requests</TableCell>
                        <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Usage Logs</CardTitle>
              <CardDescription>Recent activity across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : usageLogs.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No activity logs yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <code className="text-xs">{log.userId.slice(0, 8)}...</code>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full bg-secondary px-2 py-1 text-xs">{log.action}</span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">{log.details}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.ipAddress}</TableCell>
                        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>Add credits to {selectedUser?.name}&apos;s account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current balance: {selectedUser?.credits} credits</p>
              <Input
                type="number"
                placeholder="Amount to add"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedUser(null)} disabled={isAddingCredits}>
              Cancel
            </Button>
            <Button onClick={handleAddCredits} disabled={isAddingCredits}>
              {isAddingCredits ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteFileId} onOpenChange={() => setDeleteFileId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteFileId(null)} disabled={isDeletingFile}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFile} disabled={isDeletingFile}>
              {isDeletingFile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!disableUserId} onOpenChange={() => setDisableUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable User</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable this user account? They will no longer be able to log in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDisableUserId(null)} disabled={isDisabling}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisableUser} disabled={isDisabling}>
              {isDisabling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Disable Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
