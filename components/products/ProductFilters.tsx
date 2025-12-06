'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/lib/hooks"
import { SlidersHorizontal, X } from "lucide-react"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    bank: searchParams.get('bank') || '',
    maxApr: searchParams.get('maxApr') || '',
    income: searchParams.get('income') || '',
    creditScore: searchParams.get('creditScore') || '',
  })

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(Boolean)

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedFilters.bank) params.set('bank', debouncedFilters.bank)
    if (debouncedFilters.maxApr) params.set('maxApr', debouncedFilters.maxApr)
    if (debouncedFilters.income) params.set('income', debouncedFilters.income)
    if (debouncedFilters.creditScore) params.set('creditScore', debouncedFilters.creditScore)
    router.push(`/products?${params.toString()}`)
  }, [debouncedFilters, router])

  return (
    <div className="space-y-6 p-6 border border-border/50 rounded-3xl bg-card/80 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between">
         <h3 className="font-semibold text-lg flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" /> 
            Filters
         </h3>
         {hasActiveFilters && (
             <Button 
                variant="ghost" 
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => setFilters({ bank: '', maxApr: '', income: '', creditScore: '' })}
             >
                Reset
             </Button>
         )}
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Bank Name</Label>
          <Input 
            placeholder="Search e.g. HDFC" 
            value={filters.bank} 
            onChange={(e) => setFilters({...filters, bank: e.target.value})}
            className="rounded-xl bg-secondary/30 border-transparent focus-visible:bg-background transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Max APR (%)</Label>
          <Input 
            type="number" 
            placeholder="e.g. 12" 
            value={filters.maxApr} 
            onChange={(e) => setFilters({...filters, maxApr: e.target.value})}
            className="rounded-xl bg-secondary/30 border-transparent focus-visible:bg-background transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Min Income (₹)</Label>
          <Input 
            type="number" 
            placeholder="e.g. 50000" 
            value={filters.income} 
            onChange={(e) => setFilters({...filters, income: e.target.value})}
            className="rounded-xl bg-secondary/30 border-transparent focus-visible:bg-background transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Min Credit Score</Label>
          <Input 
            type="number" 
            placeholder="e.g. 750" 
            value={filters.creditScore} 
            onChange={(e) => setFilters({...filters, creditScore: e.target.value})}
            className="rounded-xl bg-secondary/30 border-transparent focus-visible:bg-background transition-all"
          />
        </div>
      </div>
    </div>
  )
}
