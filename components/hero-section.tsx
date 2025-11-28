import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileImage, Zap, Shield, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-background">
      {/* Background Effects - Lattice style soft blobs */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/4 rounded-full bg-primary/5 blur-[120px] opacity-60 dark:bg-primary/20" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/4 rounded-full bg-secondary blur-[120px] opacity-60 dark:bg-secondary/20" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 shadow-sm transition-colors hover:bg-accent/50 backdrop-blur-sm">
              <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3">New</Badge>
              <span className="text-sm font-medium text-foreground">API v2.0 is live</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.1]">
              The PDF platform developers love
            </h1>

            {/* Subheadline */}
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Convert images to PDF with enterprise-grade reliability. 
              Built for modern teams who need speed, security, and scalability.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="h-14 min-w-[180px] gap-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105">
                  Start for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="h-14 min-w-[180px] rounded-full border-2 border-border bg-transparent text-base font-semibold text-foreground transition-all hover:bg-accent">
                  Read Documentation
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>99.9% Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Card based like Lattice */}
          <div className="relative lg:ml-auto">
            <div className="relative rounded-[2rem] border border-border bg-card p-2 shadow-2xl shadow-primary/5">
              <div className="overflow-hidden rounded-[1.5rem] bg-muted/30 border border-border/50">
                 {/* Mock UI Interface */}
                 <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">PDF</div>
                        <div>
                          <div className="h-2.5 w-24 bg-muted rounded-full mb-1.5"></div>
                          <div className="h-2 w-16 bg-muted/60 rounded-full"></div>
                        </div>
                      </div>
                      <div className="h-8 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">Processing</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border shadow-sm">
                        <div className="h-12 w-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500"><FileImage className="h-6 w-6" /></div>
                        <div className="flex-1">
                          <div className="h-2.5 w-32 bg-muted rounded-full mb-1.5"></div>
                          <div className="h-2 w-20 bg-muted/60 rounded-full"></div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border shadow-sm">
                        <div className="h-12 w-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500"><FileImage className="h-6 w-6" /></div>
                        <div className="flex-1">
                          <div className="h-2.5 w-28 bg-muted rounded-full mb-1.5"></div>
                          <div className="h-2 w-24 bg-muted/60 rounded-full"></div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border shadow-sm">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500"><FileImage className="h-6 w-6" /></div>
                        <div className="flex-1">
                          <div className="h-2.5 w-36 bg-muted rounded-full mb-1.5"></div>
                          <div className="h-2 w-16 bg-muted/60 rounded-full"></div>
                        </div>
                        <div className="h-5 w-5 rounded-full border-2 border-muted border-t-primary animate-spin"></div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-card p-4 shadow-xl border border-border animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-red-100 border-2 border-background"></div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 border-2 border-background"></div>
                  <div className="h-8 w-8 rounded-full bg-green-100 border-2 border-background"></div>
                </div>
                <div className="text-sm font-semibold text-foreground">10k+ Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
