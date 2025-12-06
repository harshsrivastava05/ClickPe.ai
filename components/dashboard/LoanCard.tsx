'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChatSheet } from "./ChatSheet"
import { LoanProduct } from "@/types"
import { Check, Info, Sparkles, Zap } from "lucide-react"

interface LoanCardProps {
  product: LoanProduct
  isBestMatch?: boolean
}

export function LoanCard({ product, isBestMatch = false }: LoanCardProps) {
  const badges = []
  if (Number(product.rate_apr) < 10) badges.push({ label: "Low APR", icon: Sparkles, color: "bg-green-100 text-green-700 hover:bg-green-100" })
  if (product.prepayment_allowed) badges.push({ label: "No Prepayment Fee", icon: Check, color: "bg-blue-100 text-blue-700 hover:bg-blue-100" })
  if (product.disbursal_speed?.toLowerCase().includes('fast')) badges.push({ label: "Fast Disbursal", icon: Zap, color: "bg-amber-100 text-amber-700 hover:bg-amber-100" })
  if (product.docs_level?.toLowerCase() === 'low docs') badges.push({ label: "Minimal Docs", icon: Info, color: "bg-purple-100 text-purple-700 hover:bg-purple-100" })


  return (
    <Card className={`h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 ${isBestMatch
        ? 'ring-1 ring-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden bg-card'
        : 'hover:bg-secondary/20 shadow-sm bg-card/50'
      }`}>
      {isBestMatch && (
        <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold px-3 py-1 absolute top-0 right-0 rounded-bl-xl flex items-center gap-1 z-10 shadow-sm">
          <Sparkles className="w-3 h-3" /> Best Match
        </div>
      )}

      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{product.bank}</p>
            <h3 className="font-bold text-lg text-foreground leading-snug">{product.name}</h3>
          </div>
          <div className="text-right bg-primary/5 px-2 py-1 rounded-lg">
            <div className="text-xl font-bold text-primary">{Number(product.rate_apr)}%</div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase">APR</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4 px-5">
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-secondary text-secondary-foreground">{product.type.replace('_', ' ')}</Badge>
          {badges.map((b, i) => (
            <Badge key={i} variant="outline" className={`rounded-full px-2.5 py-0.5 gap-1 border-0 text-[10px] font-medium ${b.color}`}>
              <b.icon className="w-3 h-3" /> {b.label}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-medium">Min Income</span>
            <p className="font-semibold text-sm text-foreground">₹{Number(product.min_income).toLocaleString('en-IN')}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-medium">Credit Score</span>
            <p className="font-semibold text-sm text-foreground">≥ {product.min_credit_score}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-medium">Tenure</span>
            <p className="font-semibold text-sm text-foreground">{product.tenure_min_months} - {product.tenure_max_months}M</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-medium">Fee</span>
            <p className="font-semibold text-sm text-foreground">{Number(product.processing_fee_pct)}%</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 px-5 pb-5 mt-auto">
        <ChatSheet
          productId={product.id}
          productName={product.name}
          bankName={product.bank}
        />
      </CardFooter>
    </Card>
  )
}
