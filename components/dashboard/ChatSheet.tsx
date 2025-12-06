'use client'

import { Button } from "@/components/ui/button"
import { MessageCircleQuestion } from "lucide-react"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet"

interface ChatSheetProps {
  productId: string
  productName: string
  bankName: string
}

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export function ChatSheet({ productId, productName, bankName }: ChatSheetProps) {
  const [open, setOpen] = useState(false)
  const [initialMessages, setInitialMessages] = useState<any[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (open && user) {
      fetch(`/api/user?productId=${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data.chats) {
            const formatted = data.chats.map((c: any) => ({
              id: c.id,
              role: c.role,
              content: c.content
            }))
            setInitialMessages(formatted)
          }
        })
        .catch(err => console.error("Failed to fetch history:", err))
    }
  }, [open, productId, user])

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !user) {
      router.push('/auth/signin')
      return
    }
    setOpen(isOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors">
          <MessageCircleQuestion className="w-4 h-4" />
          Ask About Product
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-md w-full h-[100vh] !p-0">
        <SheetTitle className="sr-only"></SheetTitle>
        <div className="flex-1 h-full">
          <ChatInterface
            key={initialMessages.length}
            productId={productId}
            productName={productName}
            bankName={bankName}
            initialMessages={initialMessages}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
