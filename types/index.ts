import { Product as PrismaProduct, ChatMessage as PrismaChatMessage } from '@prisma/client'

export interface FAQItem {
  question: string
  answer: string
}

export interface LoanProduct extends PrismaProduct {
  faqList?: FAQItem[] // Parsed FAQ
  tags?: string[] // Derived from logic
}

export type ChatMessage = PrismaChatMessage
