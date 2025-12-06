"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export function ImportDataDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, login } = useAuth()

  const [formData, setFormData] = useState({
    pan: '',
    monthly_income: '',
    credit_score: '',
  })

  // Pre-fill data when dialog opens
  useEffect(() => {
    if (user && open) {
      setFormData({
        pan: user.pan || '',
        monthly_income: user.monthly_income?.toString() || '',
        credit_score: user.credit_score?.toString() || '',
      })
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        if (user) {
          // Refresh local user state if token logic allows, or just rely on router refresh
          // Ideally we might update the context immediately if we had the full user object, 
          // but reloading page/context is safer for now.
          // login(token, updatedUser) - we don't have token here easily unless stored.
          // Just triggering a full refresh for now.
        }
        setOpen(false)
        router.refresh()
        // Force reload to get fresh data in context (optional)
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update profile', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full shadow-sm bg-background/50 hover:bg-background border-primary/20 hover:border-primary/50 text-foreground transition-all">
          <UploadCloud className="w-4 h-4 mr-2 text-primary" />
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Import Financial Data</DialogTitle>
          <DialogDescription>
            Enter your details to get personalized loan recommendations based on your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pan" className="text-right text-xs uppercase tracking-wider text-muted-foreground w-full text-left">
              PAN Number
            </Label>
            <Input
              id="pan"
              placeholder="e.g. ABCDE1234F"
              className="col-span-3 rounded-xl uppercase"
              value={formData.pan}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
              required
              minLength={10}
              maxLength={10}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="income" className="text-right text-xs uppercase tracking-wider text-muted-foreground w-full text-left">
              Monthly Income (₹)
            </Label>
            <Input
              id="income"
              type="number"
              placeholder="e.g. 50000"
              className="col-span-3 rounded-xl"
              value={formData.monthly_income}
              onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="credit_score" className="text-right text-xs uppercase tracking-wider text-muted-foreground w-full text-left">
              Credit Score
            </Label>
            <Input
              id="credit_score"
              type="number"
              placeholder="e.g. 750"
              className="col-span-3 rounded-xl"
              value={formData.credit_score}
              onChange={(e) => setFormData({ ...formData, credit_score: e.target.value })}
              min={300}
              max={900}
              required
            />
          </div>

          <div className="bg-red-50 border border-red-100 rounded-lg p-3">
            <p className="text-xs text-red-600 font-medium leading-relaxed">
              Note: This data will be fetched and verified using your PAN card in the production environment.
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Find Loans
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
