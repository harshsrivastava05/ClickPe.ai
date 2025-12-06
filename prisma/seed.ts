import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up existing data
  await prisma.chatMessage.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Database cleaned. Users and Products removed.')

  const products = [
    {
      id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      name: "QuickStart Personal Loan",
      bank: "FinanceCo Bank",
      type: "personal",
      rate_apr: 10.50,
      min_income: 30000.00,
      min_credit_score: 680,
      tenure_min_months: 12,
      tenure_max_months: 48,
      processing_fee_pct: 1.5,
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "low",
      summary: "A competitive personal loan for all your immediate needs, featuring quick disbursal and low documentation requirements.",
      faq: JSON.stringify([
        { q: "What is the processing fee?", a: "1.5% of the loan amount." },
        { q: "Can I pre-pay the loan?", a: "Yes, prepayment is allowed." }
      ]),
      terms: JSON.stringify({
        penalty_for_late_payment: "2% of EMI",
        other_charges: "None"
      }),
      clauses: "1. Employment must be stable for at least 2 years. 2. Late payment penalty is strictly enforced at 2% of overdue amount. 3. Address verification via physical visit is mandatory."
    },
    {
      id: "b2c3d4e5-f6a7-8901-2345-67890abcdef123",
      name: "Future Scholar Education Loan",
      bank: "Global Trust",
      type: "education",
      rate_apr: 8.25,
      min_income: 45000.00,
      min_credit_score: 720,
      tenure_min_months: 24,
      tenure_max_months: 96,
      processing_fee_pct: 0.5,
      prepayment_allowed: false,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "A low-interest loan specifically for higher education, covering tuition and living expenses.",
      faq: JSON.stringify([
        { q: "What is the maximum loan term?", a: "8 years (96 months)." },
        { q: "Are there any fees?", a: "A one-time processing fee of 0.5% applies." }
      ]),
      terms: JSON.stringify({
        holiday_period: "Up to 1 year after course completion",
        guarantor_required: "Yes, for amounts over $50,000"
      }),
      clauses: "1. Grade reports must be submitted every semester. 2. Disbursement is made directly to the educational institution. 3. Co-borrower (parent/guardian) is mandatory."
    },
    {
      name: "Dream Home Mortgage",
      bank: "HDFC Bank",
      type: "home",
      rate_apr: 8.50,
      min_income: 60000.00,
      min_credit_score: 750,
      tenure_min_months: 60,
      tenure_max_months: 360,
      processing_fee_pct: 0.25,
      prepayment_allowed: true,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "Affordable home loans with extended tenure options.",
      faq: JSON.stringify([
        { q: "Is insurance mandatory?", a: "Property insurance is mandatory." }
      ]),
      terms: JSON.stringify({
        penalty_for_late_payment: "1.5% of EMI"
      }),
      clauses: "1. Property title search and valuation report are mandatory at borrower's cost. 2. Interest rate is floating and linked to the repo rate. 3. Property must not be in a dispute or litigation."
    },
    {
      name: "Drive Easy Car Loan",
      bank: "ICICI Bank",
      type: "vehicle",
      rate_apr: 9.00,
      min_income: 35000.00,
      min_credit_score: 700,
      tenure_min_months: 12,
      tenure_max_months: 84,
      processing_fee_pct: 1.0,
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "low",
      summary: "Get behind the wheel faster with minimal paperwork.",
      faq: JSON.stringify([
        { q: "Can I get 100% funding?", a: "Up to 90% of on-road price." }
      ]),
      terms: JSON.stringify({}),
      clauses: "1. Vehicle must be hypothecated to the bank until loan closure. 2. Comprehensive insurance is mandatory for the loan tenure. 3. Copy of RC book must be submitted within 30 days of purchase."
    },
    {
      name: "Prime Credit Line",
      bank: "Axis Bank",
      type: "credit_line",
      rate_apr: 12.50,
      min_income: 25000.00,
      min_credit_score: 650,
      tenure_min_months: 6,
      tenure_max_months: 36,
      processing_fee_pct: 2.0,
      prepayment_allowed: true,
      disbursal_speed: "instant",
      docs_level: "low",
      summary: "Flexible credit line for ongoing expenses.",
      faq: JSON.stringify([
        { q: "How is interest calculated?", a: "Only on the utilized amount." }
      ]),
      terms: JSON.stringify({}),
      clauses: "1. Annual renewal fee applies to keep the line active. 2. Interest is charged on a daily reducing balance method on the utilized amount. 3. Bank reserves the right to recall the facility with 30 days notice."
    },
    {
      name: "Consolidate Pro",
      bank: "Kotak Mahindra",
      type: "debt_consolidation",
      rate_apr: 11.25,
      min_income: 40000.00,
      min_credit_score: 700,
      tenure_min_months: 12,
      tenure_max_months: 60,
      processing_fee_pct: 1.0,
      prepayment_allowed: true,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "Simplify your finances by merging multiple debts.",
      faq: JSON.stringify([]),
      terms: JSON.stringify({}),
      clauses: "1. All existing debt details must be fully disclosed during application. 2. Bank will make direct payments to previous lenders to close accounts. 3. No new loans should be taken within 6 months of consolidation."
    },
    {
      name: "Elite Personal Loan",
      bank: "Standard Chartered",
      type: "personal",
      rate_apr: 9.99,
      min_income: 100000.00,
      min_credit_score: 800,
      tenure_min_months: 12,
      tenure_max_months: 60,
      processing_fee_pct: 0.75,
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "low",
      summary: "Exclusive personal loan rates for premium customers.",
      faq: JSON.stringify([
         { q: "Are there foreclosure charges?", a: "Nil after 12 EMIs." }
      ]),
      terms: JSON.stringify({}),
      clauses: "1. Valid only for customers with Priority Banking status. 2. Relationship value is considered for further rate discounts. 3. Zero foreclosure charges applicable only after 12 successful EMI payments."
    },
    {
      name: "Green Ride EV Loan",
      bank: "SBI",
      type: "vehicle",
      rate_apr: 8.80,
      min_income: 30000.00,
      min_credit_score: 700,
      tenure_min_months: 36,
      tenure_max_months: 84,
      processing_fee_pct: 0.5,
      prepayment_allowed: true,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "Special rates for Electric Vehicle purchases.",
      faq: JSON.stringify([
        { q: "Is this valid for 2-wheelers?", a: "Yes, both 2 and 4 wheelers." }
      ]),
      terms: JSON.stringify({}),
      clauses: "1. Valid only for FAME-II subsidy eligible vehicles. 2. Battery warranty certificate from manufacturer is required. 3. Green cess discount applies on processing fee."
    },
    {
      name: "Tech Upskill Loan",
      bank: "Avanse",
      type: "education",
      rate_apr: 10.50,
      min_income: 20000.00,
      min_credit_score: 650,
      tenure_min_months: 6,
      tenure_max_months: 36,
      processing_fee_pct: 1.5,
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "low",
      summary: "Funding for coding bootcamps and certifications.",
      faq: JSON.stringify([]),
      terms: JSON.stringify({}),
      clauses: "1. Course completion certificate must be submitted. 2. Moratorium period interest is calculated as simple interest. 3. Institute must be a recognized training partner."
    },
    {
      name: "Renovate Home Loan",
      bank: "Bajaj Finserv",
      type: "home",
      rate_apr: 9.50,
      min_income: 35000.00,
      min_credit_score: 700,
      tenure_min_months: 12,
      tenure_max_months: 120,
      processing_fee_pct: 1.0,
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "standard",
      summary: "Give your home a makeover with easy financing.",
      faq: JSON.stringify([]),
      terms: JSON.stringify({}),
      clauses: "1. Detailed quotation from contractor/architect required. 2. Disbursal made in tranches based on work progress. 3. End-use verification will be conducted."
    }
  ]

  for (const p of products) {
    await prisma.product.create({
      data: p
    })
  }

  console.log('Seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
