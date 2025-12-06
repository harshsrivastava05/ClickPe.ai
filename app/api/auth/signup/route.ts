import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  display_name: z.string().min(2),
  pan: z.string().length(10).regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN format").optional().or(z.literal('')),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, display_name, pan } = signupSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        display_name,
        pan: pan || null,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret-key', // Use env var in prod
      { expiresIn: '7d' }
    );

    // Return token in cookie header (and body for client handling)
    return new Response(JSON.stringify({ token, user: { id: user.id, name: user.display_name, email: user.email } }), {
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
        return new Response(JSON.stringify(error.issues), { status: 400 });
    }
    console.error('Signup Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
