"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ImageIcon, Key, Zap, ArrowRight, Loader2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

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

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: filesData, isLoading: filesLoading } = useSWR<{ files: PDFFile[] }>(user ? "/api/files" : null, fetcher)

  const { data: usageData, isLoading: usageLoading } = useSWR<{
    apiUsage: number
    apiLimit: number | null
    keyCount: number
    keyLimit: number
  }>("/api/user/usage", fetcher)

  const userFiles = filesData?.files || []
  const recentFiles = userFiles.slice(0, 5)

  const stats = [
    { label: "PDFs Created", value: filesLoading ? "..." : userFiles.length, icon: FileText },
    { label: "Credits Remaining", value: user?.credits || 0, icon: Zap },
    {
      label: "API Usage (Today)",
      value: usageLoading
        ? "..."
        : `${usageData?.apiUsage} / ${usageData?.apiLimit === null ? "∞" : usageData?.apiLimit}`,
      icon: Key,
    },
    {
      label: "API Keys",
      value: usageLoading ? "..." : `${usageData?.keyCount} / ${usageData?.keyLimit}`,
      icon: Key,
    },
  ]

  return (
    <div>
      <DashboardHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`}
        description="Here's an overview of your PDF conversion activity"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/dashboard/convert">
              <Button className="w-full justify-between" variant="secondary">
                Convert Images to PDF
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/api-keys">
              <Button className="w-full justify-between" variant="secondary">
                Generate API Key
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button className="w-full justify-between" variant="secondary">
                View API Documentation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Files</CardTitle>
            <Link href="/dashboard/files">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {filesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentFiles.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No files yet</p>
                <Link href="/dashboard/convert">
                  <Button size="sm" className="mt-4">
                    Create your first PDF
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{file.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.pages} pages • {file.size}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(file.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
