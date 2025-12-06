import { prisma } from "@/lib/db"
import { LoanCard } from "@/components/dashboard/LoanCard"
import { ProductFilters } from "@/components/products/ProductFilters"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const bank = params.bank as string | undefined
  const maxApr = params.maxApr ? Number(params.maxApr) : undefined
  const income = params.income ? Number(params.income) : undefined
  const creditScore = params.creditScore ? Number(params.creditScore) : undefined

  const where: any = {}
  
  if (bank) {
    where.bank = { contains: bank }
  }
  if (maxApr) {
    where.rate_apr = { lte: maxApr }
  }
  if (income) {
    where.min_income = { lte: income }
  }
  if (creditScore) {
    where.min_credit_score = { lte: creditScore }
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { rate_apr: 'asc' }
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">All Loan Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <ProductFilters />
        </aside>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.length > 0 ? (
                products.map(p => (
                   <LoanCard 
                     key={p.id} 
                     product={{
                       ...p,
                       rate_apr: Number(p.rate_apr),
                       min_income: Number(p.min_income),
                       processing_fee_pct: Number(p.processing_fee_pct)
                     } as any} 
                   />
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
                    No products found matching your filters.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
