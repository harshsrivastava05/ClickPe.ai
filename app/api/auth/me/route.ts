import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        display_name: true,
        pan: true,
        monthly_income: true,
        credit_score: true
      }
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return Response.json({
      ...user,
      monthly_income: user.monthly_income?.toString() || null
    });

  } catch (error) {
    console.error('Me API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
