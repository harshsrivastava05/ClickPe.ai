import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const updateSchema = z.object({
  pan: z.string().length(10).optional().or(z.literal('')),
  monthly_income: z.string().or(z.number()).transform(val => Number(val)).optional(),
  credit_score: z.string().or(z.number()).transform(val => Number(val)).optional(),
});

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any;
    
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(data.pan ? { pan: data.pan } : {}),
        ...(data.monthly_income ? { monthly_income: data.monthly_income } : {}),
        ...(data.credit_score ? { credit_score: data.credit_score } : {}),
      }
    });

    return Response.json(updatedUser);

  } catch (error) {
     if (error instanceof z.ZodError) {
        return new Response(JSON.stringify(error.errors), { status: 400 });
    }
    console.error('Update Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
