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
    data: filesData,
    isLoading: filesLoading,
    mutate: mutateFiles,
  } = useSWR<{ files: PDFFile[] }>("/api/admin/files", fetcher)
  const { data: keysData, isLoading: keysLoading } = useSWR<{ keys: ApiKey[] }>("/api/admin/api-keys", fetcher)
  const { data: logsData, isLoading: logsLoading } = useSWR<{ logs: UsageLog[] }>("/api/admin/logs", fetcher)

  const [deleteFileId, setDeleteFileId] = useState<string | null>(null)
  const [isDeletingFile, setIsDeletingFile] = useState(false)

  const files = filesData?.files || []
  const apiKeys = keysData?.keys || []
  const usageLogs = logsData?.logs || []

  const stats = [
    { label: "Total Users", value: statsLoading ? "..." : statsData?.totalUsers || 0, icon: Users },
    { label: "PDFs Generated", value: statsLoading ? "..." : statsData?.totalFiles || 0, icon: FileText },
    { label: "API Keys", value: statsLoading ? "..." : statsData?.totalApiKeys || 0, icon: Key },
    { label: "API Requests", value: statsLoading ? "..." : statsData?.totalUsage || 0, icon: Activity },
  ]

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

      <Tabs defaultValue="files" className="space-y-6">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="logs">Usage Logs</TabsTrigger>
        </TabsList>

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
    </div>
  )
}
