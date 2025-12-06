import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        chats: productId ? {
          where: { product_id: productId },
          orderBy: { created_at: 'asc' }
        } : false
      }
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // @ts-ignore
    const { password, ...userWithoutPassword } = user;
    return Response.json(userWithoutPassword);
  } catch (error) {
    console.error('User API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
