import { prisma } from "@/lib/db"
import { LoanCard } from "@/components/dashboard/LoanCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, LayoutDashboard } from "lucide-react"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Helper to get user from token server-side
async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })
    return user
  } catch (error) {
    return null
  }
}

export default async function DashboardPage() {
  const user = await getUser()

  const userIncome = user?.monthly_income ? Number(user.monthly_income) : 0
  const userScore = user?.credit_score ?? 0
  const userName = user?.display_name || 'User'

  // Fetch verified products from DB with personalization logic
  // Logic: 
  // 1. Must match credit score (roughly) - showing products where user score >= min score
  // 2. Must be affordable (Income >= min income)
  // 3. Sort by lowest APR
  const topProducts = await prisma.product.findMany({
    where: {
      AND: [
        { min_credit_score: { lte: userScore > 0 ? userScore : 900 } }, // Show all if no score
        { min_income: { lte: userIncome > 0 ? userIncome : 10000000 } }   // Show all if no income
      ]
    },
    take: 5,
    orderBy: {
      rate_apr: 'asc'
    },
    include: {
      chats: true // simple include to satisfy type if needed, or _count
    }
  })

  // Fallback if no personalized matches or user not imported yet, just show top 5 cheap ones
  const displayedProducts = topProducts.length > 0 ? topProducts : await prisma.product.findMany({
    take: 5,
    orderBy: { rate_apr: 'asc' }
  })

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-10 animate-in fade-in duration-700">

      {/* Welcome Section - Soft Gradient Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/30 border border-border/50 p-8 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Hello, {userName}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light">
              {userIncome > 0
                ? "Here are the best loan offers based on your profile."
                : "Import your financial data to see personalized offers."}
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-full shadow-md bg-primary text-primary-foreground hover:bg-primary/90">
              + Add Goal
            </Button>
          </div>
        </div>
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      </section>

      {/* Stats / Quick Overview Row (Optional but fits the design) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Credit Score", value: userScore > 0 ? userScore : '-', trend: userScore > 0 ? "+5 pts" : "No score", up: true },
          { label: "Monthly Income", value: userIncome > 0 ? `₹${(userIncome / 1000).toFixed(0)}k` : "₹0", trend: userIncome > 0 ? "Verified" : "Unverified", up: true },
          { label: "Loan Eligibility", value: userIncome > 50000 ? "High" : "Medium", trend: "98% match rate", up: true },
          { label: "Next EMI", value: "₹0", trend: "Due in 30 days", up: true },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.up ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Top Matches Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Your Top Matches</h2>
            <p className="text-muted-foreground font-light">Based on your credit profile and income.</p>
          </div>
          <Button variant="ghost" className="hover:bg-transparent hover:text-primary transition-colors gap-2 group" asChild>
            <Link href="/products">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Loan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product, index) => (
              <LoanCard
                key={product.id}
                product={{
                  ...product,
                  rate_apr: Number(product.rate_apr),
                  min_income: Number(product.min_income),
                  processing_fee_pct: Number(product.processing_fee_pct)
                } as any}
                isBestMatch={index === 0}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-4">
              <div className="p-4 bg-background rounded-full shadow-sm">
                <LayoutDashboard className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-lg font-light">No loan products found matching your profile.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
