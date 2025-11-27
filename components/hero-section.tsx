import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileImage, Zap, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
            <span className="text-xs font-medium text-primary">New</span>
            <span className="text-xs text-muted-foreground">API v1 now available</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Convert images to PDF with <span className="text-primary">enterprise-grade</span> reliability
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Upload multiple images and merge them into a single PDF instantly. Powerful API for developers, intuitive
            interface for everyone.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Converting Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline">
                View API Docs
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileImage className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Multiple Formats</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Support for JPG, PNG, WebP, and more. Merge unlimited images into one PDF.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Lightning Fast</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Process images in seconds. Our optimized engine handles large batches efficiently.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Secure & Private</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Files are encrypted and automatically deleted. Your data stays private.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
