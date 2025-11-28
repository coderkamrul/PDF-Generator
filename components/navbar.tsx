"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm py-3 border-b border-border/50" : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-foreground">PDFForge</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            Platform
          </Link>
          <Link href="/pricing" className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/docs" className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            Resources
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <ModeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="rounded-full px-6 font-medium">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-6 font-medium shadow-md shadow-primary/20 transition-transform hover:scale-105">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 border-t border-border bg-background px-6 py-6 shadow-xl md:hidden animate-in slide-in-from-top-5">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-base font-medium text-foreground/80 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Platform
            </Link>
            <Link href="/pricing" className="text-base font-medium text-foreground/80 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link href="/docs" className="text-base font-medium text-foreground/80 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
              Resources
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-foreground">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
