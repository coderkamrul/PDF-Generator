// "use client"

// import { useState } from "react"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Key, Plus, Copy, Trash2, Check, Eye, EyeOff, Loader2 } from "lucide-react"
// import Link from "next/link"
// import useSWR from "swr"

// const fetcher = (url: string) => fetch(url).then((res) => res.json())

// interface ApiKey {
//   id: string
//   userId: string
//   name: string
//   key: string
//   createdAt: string
//   lastUsed: string | null
//   usageCount: number
// }

// export default function ApiKeysPage() {
//   const { data, isLoading, mutate } = useSWR<{ keys: ApiKey[] }>("/api/keys", fetcher)

//   const [newKeyName, setNewKeyName] = useState("")
//   const [newKey, setNewKey] = useState<string | null>(null)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [isCreating, setIsCreating] = useState(false)
//   const [copiedId, setCopiedId] = useState<string | null>(null)
//   const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
//   const [deleteId, setDeleteId] = useState<string | null>(null)
//   const [isDeleting, setIsDeleting] = useState(false)

//   const keys = data?.keys || []

//   const handleCreateKey = async () => {
//     if (!newKeyName.trim()) return
//     setIsCreating(true)

//     try {
//       const res = await fetch("/api/keys", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newKeyName.trim() }),
//       })

//       if (res.ok) {
//         const data = await res.json()
//         setNewKey(data.key.key) // Full key returned on creation
//         setNewKeyName("")
//         mutate()
//       }
//     } catch (error) {
//       console.error("Create key error:", error)
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   const handleCopy = async (key: string, id: string) => {
//     await navigator.clipboard.writeText(key)
//     setCopiedId(id)
//     setTimeout(() => setCopiedId(null), 2000)
//   }

//   const toggleKeyVisibility = (id: string) => {
//     setVisibleKeys((prev) => {
//       const next = new Set(prev)
//       if (next.has(id)) {
//         next.delete(id)
//       } else {
//         next.add(id)
//       }
//       return next
//     })
//   }

//   const handleDelete = async () => {
//     if (!deleteId) return
//     setIsDeleting(true)

//     try {
//       const res = await fetch(`/api/keys?id=${deleteId}`, { method: "DELETE" })
//       if (res.ok) {
//         mutate()
//       }
//     } catch (error) {
//       console.error("Delete key error:", error)
//     } finally {
//       setIsDeleting(false)
//       setDeleteId(null)
//     }
//   }

//   const maskKey = (key: string) => {
//     if (key.includes("...")) return key // Already masked from server
//     return key.slice(0, 7) + "•".repeat(20) + key.slice(-4)
//   }

//   return (
//     <div>
//       <DashboardHeader title="API Keys" description="Manage your API keys for programmatic access" />

//       <div className="mb-6 flex items-center justify-between">
//         <p className="text-sm text-muted-foreground">
//           {keys.length} API key{keys.length !== 1 ? "s" : ""} created
//         </p>
//         <Dialog
//           open={isDialogOpen}
//           onOpenChange={(open) => {
//             setIsDialogOpen(open)
//             if (!open) {
//               setNewKey(null)
//               setNewKeyName("")
//             }
//           }}
//         >
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Create New Key
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>{newKey ? "API Key Created" : "Create New API Key"}</DialogTitle>
//               <DialogDescription>
//                 {newKey
//                   ? "Make sure to copy your API key now. You won't be able to see it again!"
//                   : "Give your API key a name to help you identify it later."}
//               </DialogDescription>
//             </DialogHeader>

//             {newKey ? (
//               <div className="space-y-4">
//                 <div className="rounded-lg bg-secondary p-4">
//                   <code className="break-all text-sm text-foreground">{newKey}</code>
//                 </div>
//                 <Button
//                   className="w-full"
//                   onClick={() => {
//                     navigator.clipboard.writeText(newKey)
//                     setIsDialogOpen(false)
//                   }}
//                 >
//                   <Copy className="mr-2 h-4 w-4" />
//                   Copy & Close
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="keyName">Key Name</Label>
//                   <Input
//                     id="keyName"
//                     placeholder="e.g., Production, Development"
//                     value={newKeyName}
//                     onChange={(e) => setNewKeyName(e.target.value)}
//                   />
//                 </div>
//                 <DialogFooter>
//                   <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button onClick={handleCreateKey} disabled={!newKeyName.trim() || isCreating}>
//                     {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                     Create Key
//                   </Button>
//                 </DialogFooter>
//               </>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-16">
//               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : keys.length === 0 ? (
//             <div className="py-16 text-center">
//               <Key className="mx-auto h-16 w-16 text-muted-foreground/50" />
//               <h3 className="mt-4 text-lg font-medium text-foreground">No API keys yet</h3>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Create your first API key to start using the PDFForge API
//               </p>
//               <div className="mt-6 flex justify-center gap-3">
//                 <Button onClick={() => setIsDialogOpen(true)}>
//                   <Plus className="mr-2 h-4 w-4" />
//                   Create API Key
//                 </Button>
//                 <Link href="/docs">
//                   <Button variant="outline">View Documentation</Button>
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Key</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead>Last Used</TableHead>
//                   <TableHead>Usage</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {keys.map((apiKey) => (
//                   <TableRow key={apiKey.id}>
//                     <TableCell className="font-medium">{apiKey.name}</TableCell>
//                     <TableCell>
//                       <code className="text-xs">{visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}</code>
//                     </TableCell>
//                     <TableCell>{new Date(apiKey.createdAt).toLocaleDateString()}</TableCell>
//                     <TableCell>{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : "Never"}</TableCell>
//                     <TableCell>{apiKey.usageCount} requests</TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(apiKey.id)}>
//                           {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                         </Button>
//                         <Button variant="ghost" size="icon" onClick={() => handleCopy(apiKey.key, apiKey.id)}>
//                           {copiedId === apiKey.id ? (
//                             <Check className="h-4 w-4 text-primary" />
//                           ) : (
//                             <Copy className="h-4 w-4" />
//                           )}
//                         </Button>
//                         <Button variant="ghost" size="icon" onClick={() => setDeleteId(apiKey.id)}>
//                           <Trash2 className="h-4 w-4 text-destructive" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete API Key</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete this API key? Any applications using this key will stop working.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={isDeleting}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
//               {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Quick Start</CardTitle>
//           <CardDescription>Use your API key to convert images to PDF</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
//             <code className="text-sm text-foreground">{`curl -X POST ${typeof window !== "undefined" ? window.location.origin : "https://pdfforge.com"}/api/convert \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "images": ["data:image/jpeg;base64,..."],
//     "options": {
//       "pageSize": "a4",
//       "orientation": "portrait"
//     }
//   }'`}</code>
//           </pre>
//           <Link href="/docs" className="mt-4 inline-block text-sm text-primary hover:underline">
//             View full documentation →
//           </Link>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }





"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, Plus, Copy, Trash2, Check, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ApiKey {
  id: string
  userId: string
  name: string
  key: string // masked OR undefined in old entries
  createdAt: string
  lastUsed: string | null
  usageCount: number
}

export default function ApiKeysPage() {
  const { data, isLoading, mutate } = useSWR<{ keys: ApiKey[] }>("/api/keys", fetcher)

  const [newKeyName, setNewKeyName] = useState("")
  const [newKey, setNewKey] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const keys = data?.keys || []

  // ⭐ SAFE MASK FUNCTION
  const maskKey = (key: string | undefined | null) => {
    if (!key || typeof key !== "string") return "invalid-key"
    if (key.includes("...")) return key // already masked
    if (key.length < 12) return key

    return key.slice(0, 7) + "•".repeat(20) + key.slice(-4)
  }

  // CREATE
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return
    setIsCreating(true)

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setNewKey(data.key.key) // full key returned ONLY now
        setNewKeyName("")
        mutate()
      }
    } catch (error) {
      console.error("Create key error:", error)
    } finally {
      setIsCreating(false)
    }
  }

  // COPY FULL KEY
  const handleCopy = async (key: string, id: string) => {
    if (!key) return
    await navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // VISIBILITY TOGGLE
  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // DELETE
  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/keys?id=${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) mutate()
    } catch (error) {
      console.error("Delete key error:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div>
      <DashboardHeader title="API Keys" description="Manage your API keys for programmatic access" />

      {/* CREATE NEW KEY */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {keys.length} API key{keys.length !== 1 ? "s" : ""}
        </p>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setNewKey(null)
              setNewKeyName("")
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Key
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{newKey ? "API Key Created" : "Create New API Key"}</DialogTitle>
              <DialogDescription>
                {newKey
                  ? "Copy your full API key now. You will not be able to view it again."
                  : "Choose a helpful name for your API key."}
              </DialogDescription>
            </DialogHeader>

            {/* Show key after creation */}
            {newKey ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-secondary p-4">
                  <code className="break-all text-sm">{newKey}</code>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(newKey)
                    setIsDialogOpen(false)
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy & Close
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Production / Development"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey} disabled={!newKeyName.trim() || isCreating}>
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Key
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* KEY LIST */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : keys.length === 0 ? (
            <div className="py-16 text-center">
              <Key className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No API keys yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create your first API key to begin.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {keys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>

                    <TableCell>
                      <code className="text-xs">
                        {visibleKeys.has(apiKey.id)
                          ? apiKey.key || "invalid-key"
                          : maskKey(apiKey.key)}
                      </code>
                    </TableCell>

                    <TableCell>{new Date(apiKey.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : "Never"}</TableCell>
                    <TableCell>{apiKey.usageCount} requests</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">

                        {/* TOGGLE VIEW */}
                        <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(apiKey.id)}>
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        {/* COPY */}
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(apiKey.key, apiKey.id)}>
                          {copiedId === apiKey.id ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>

                        {/* DELETE */}
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(apiKey.id)}>
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

      {/* DELETE MODAL */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QUICK START */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Use your API key to convert images to PDF</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
            <code className="text-sm">
{`curl -X POST ${typeof window !== "undefined" ? window.location.origin : "https://pdfforge.com"}/api/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "images": ["data:image/jpeg;base64,..."],
    "options": {
      "pageSize": "a4",
      "orientation": "portrait"
    }
  }'`}
            </code>
          </pre>

          <Link href="/docs" className="mt-4 inline-block text-sm text-primary hover:underline">
            View full documentation →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
