import { prisma } from '@/lib/db';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const bank = searchParams.get('bank');
  const maxApr = searchParams.get('maxApr');
  const income = searchParams.get('income'); 
  const creditScore = searchParams.get('creditScore');

  const where: any = {};

  if (bank) {
    where.bank = { contains: bank } 
  }
  if (maxApr) {
    where.rate_apr = { lte: Number(maxApr) };
  }
  if (income) {
     // Show products where the required income is less than or equal to what user makes (if interpreted as "I have this income")
     // OR if interpreted as "Filter by property", usually people want to see products they qualify for.
    where.min_income = { lte: Number(income) };
  }
  if (creditScore) {
    where.min_credit_score = { lte: Number(creditScore) };
  }

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy: { rate_apr: 'asc' }
    });
    return Response.json(products);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
