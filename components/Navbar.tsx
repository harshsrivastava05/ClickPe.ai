"use client"

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

export function Navbar() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/40 backdrop-blur-3xl border-b border-white/20 shadow-md supports-[backdrop-filter]:bg-white/40 transition-all duration-300">
      <div className="container flex h-20 items-center px-6">
        <div className="mr-8 flex items-center">
          <Link href="/" className="mr-8 flex items-center gap-3 group">
            {/* Logo */}
            <div className="relative w-9 h-9 overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Clickpe" className="object-cover w-full h-full" />
            </div>
            <span className="hidden font-bold text-2xl sm:inline-block tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
              clickpe
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-base font-medium">
            <Link href="/" className="transition-all hover:text-primary text-foreground/80 hover:bg-secondary/60 px-4 py-2 rounded-lg">
              Dashboard
            </Link>
            <Link href="/products" className="transition-all hover:text-primary text-foreground/80 hover:bg-secondary/60 px-4 py-2 rounded-lg">
              All Products
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-6">
          {!isLoading && (
            <>
              {user ? (
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
              ) : (
                <div className="flex gap-3">
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-base font-medium">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="text-base font-medium px-6 py-5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">Get Started</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
