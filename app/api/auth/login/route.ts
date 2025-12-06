import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return new Response('Invalid credentials', { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response('Invalid credentials', { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );

    return new Response(JSON.stringify({ token, user: { id: user.id, name: user.display_name, email: user.email } }), {
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
        return new Response(JSON.stringify(error.errors), { status: 400 });
    }
    console.error('Login Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
