"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Download, Trash2, Eye, Code, Loader2, Calendar, HardDrive, Cloud } from "lucide-react"
import Link from "next/link"
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
  cloudinaryPublicId: string
}

export default function FilesPage() {
  const { data, isLoading, mutate } = useSWR<{ files: PDFFile[] }>("/api/files", fetcher)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewFile, setPreviewFile] = useState<PDFFile | null>(null)

  const files = data?.files || []

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/files?id=${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleDownload = (file: PDFFile) => {
    const link = document.createElement("a")
    link.href = file.downloadUrl
    link.download = file.filename
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <DashboardHeader
        title="My Files"
        description="View and manage all your generated PDF files stored in the cloud"
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : files.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No files yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create your first PDF to see it here</p>
              <Link href="/dashboard/convert">
                <Button className="mt-6">Convert Images to PDF</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{file.filename}</span>
                        <Cloud className="h-3 w-3 text-muted-foreground" title="Stored in cloud" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <HardDrive className="h-3 w-3" />
                        {file.size}
                      </div>
                    </TableCell>
                    <TableCell>{file.pages}</TableCell>
                    <TableCell>
                      {file.apiGenerated ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                          <Code className="h-3 w-3" />
                          API
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Web App</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(file.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setPreviewFile(file)} title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(file)} title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(file.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This will also remove it from cloud storage. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {previewFile?.filename}
              <Cloud className="h-4 w-4 text-muted-foreground" />
            </DialogTitle>
            <DialogDescription>
              {previewFile?.pages} page{previewFile?.pages !== 1 ? "s" : ""} - {previewFile?.size}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[60vh] overflow-hidden rounded-lg border border-border bg-secondary">
            {previewFile && (
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewFile.downloadUrl)}&embedded=true`}
                className="h-full w-full"
                title={previewFile.filename}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewFile(null)}>
              Close
            </Button>
            {previewFile && (
              <Button onClick={() => handleDownload(previewFile)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
