"use client"


import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Wallet, UserCircle, LogOut } from "lucide-react"
import { ImportDataDialog } from "@/components/dashboard/ImportDataDialog"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false)

  const NavLinks = () => (
    <>
      <Link href="/" className="transition-all hover:text-primary text-foreground/80 hover:bg-secondary/60 px-4 py-2 rounded-lg" onClick={() => setIsOpen(false)}>
        Dashboard
      </Link>
      <Link href="/products" className="transition-all hover:text-primary text-foreground/80 hover:bg-secondary/60 px-4 py-2 rounded-lg" onClick={() => setIsOpen(false)}>
        All Products
      </Link>
    </>
  )

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => {
    if (isLoading) return null;

    if (user) {
      if (mobile) {
        return (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2 py-2 border-b">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.display_name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )
      }

      return (
        <>
          <ImportDataDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-6 border-l border-border/60 outline-none">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-semibold text-foreground/90">{user.display_name}</span>
                  <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[100px]">{user.email}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-background shadow-sm hover:bg-primary/20 transition-colors">
                  <UserCircle className="w-6 h-6" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }

    return (
      <div className={mobile ? "flex flex-col gap-3" : "flex gap-3"}>
        <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
          <Button variant="ghost" className={mobile ? "w-full justify-start pl-2" : "text-base font-medium"}>Sign In</Button>
        </Link>
        <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
          <Button className={mobile ? "w-full" : "text-base font-medium px-6 py-5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"}>Get Started</Button>
        </Link>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/40 backdrop-blur-3xl border-b border-white/20 shadow-md supports-[backdrop-filter]:bg-white/40 transition-all duration-300">
      <div className="container flex h-20 items-center px-6 justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-8 flex items-center gap-3 group">
            <div className="relative w-9 h-9 overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Clickpe" className="object-cover w-full h-full" />
            </div>
            <span className="font-bold text-2xl inline-block tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
              clickpe
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-base font-medium">
            <NavLinks />
          </nav>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-4">
          {/* Show small profile icon on mobile top bar if logged in, optional, but lets keep it clean with just burger */}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col gap-6 pt-10">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-bold flex items-center gap-2">
                  <div className="relative w-7 h-7 overflow-hidden rounded-lg">
                    <img src="/logo.png" alt="Clickpe" className="object-cover w-full h-full" />
                  </div>
                  Clickpe
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                <NavLinks />
              </div>

              <div className="h-px bg-border/50 my-2" />

              <div className="mt-auto md:mt-0">
                <AuthButtons mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
