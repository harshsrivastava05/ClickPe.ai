import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
      console.log('Seeding database via API...')

      // Create a mock user
      await prisma.user.upsert({
        where: { email: 'demo@clickpe.com' },
        update: {},
        create: {
          email: 'demo@clickpe.com',
          display_name: 'Demo User',
        },
      })

      // Mock Products
      const products = [
        {
          name: 'Flexi Personal Loan',
          bank: 'HDFC Bank',
          type: 'personal',
          rate_apr: 10.5,
          min_income: 25000,
          min_credit_score: 700,
          summary: 'Instant personal loan with flexible repayment options.',
          faq: JSON.stringify([{ question: 'Is prepayment allowed?', answer: 'Yes, after 12 months.' }]),
          disbursal_speed: 'Fast Disbursal',
          prepayment_allowed: true,
        },
        {
          name: 'Dream Home Loan',
          bank: 'SBI',
          type: 'home',
          rate_apr: 8.4,
          min_income: 40000,
          min_credit_score: 750,
          summary: 'Lowest interest rates for your dream home.',
          faq: JSON.stringify([{ question: 'What is the max tenure?', answer: '30 years.' }]),
          tenure_max_months: 360,
        },
        // ... (rest of the products from seed.ts)
        {
          name: 'EduSmart Loan',
          bank: 'ICICI Bank',
          type: 'education',
          rate_apr: 9.0,
          min_income: 0,
          min_credit_score: 650,
          summary: 'Full coverage for tuition and living expenses.',
          disbursal_speed: 'Standard',
        },
        {
          name: 'Auto Drive Loan',
          bank: 'Axis Bank',
          type: 'vehicle',
          rate_apr: 9.25,
          min_income: 30000,
          min_credit_score: 700,
          summary: 'Get your dream car with minimal documentation.',
          docs_level: 'Low Docs',
        },
        {
          name: 'QuickCash Credit Line',
          bank: 'IDFC First',
          type: 'credit_line',
          rate_apr: 13.0,
          min_income: 20000,
          min_credit_score: 680,
          summary: 'Revolving credit line for everyday needs.',
        },
        {
          name: 'Debt Consolidation Plan',
          bank: 'Kotak Mahindra',
          type: 'debt_consolidation',
          rate_apr: 11.0,
          min_income: 35000,
          min_credit_score: 720,
          summary: 'Consolidate multiple loans into one EMI.',
        },
        {
          name: 'Premium Personal Loan',
          bank: 'Standard Chartered',
          type: 'personal',
          rate_apr: 10.25,
          min_income: 100000,
          min_credit_score: 800,
          summary: 'Exclusive rates for high-net-worth individuals.',
        },
        {
          name: 'Green Home Loan',
          bank: 'Union Bank',
          type: 'home',
          rate_apr: 8.35,
          min_income: 30000,
          min_credit_score: 700,
          summary: 'Special rates for eco-friendly homes.',
        },
      ]

      for (const p of products) {
        // Simple create if not exists based on name? Or just create.
        // Prisma create check logic:
        const existing = await prisma.product.findFirst({ where: { name: p.name } })
        if (!existing) {
            await prisma.product.create({
            data: {
                ...p,
            } as any
            })
        }
      }

      return NextResponse.json({ success: true, message: "Database seeded!" })
  } catch (e) {
      console.error(e)
      return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
