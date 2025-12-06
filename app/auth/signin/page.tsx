'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

type SigninForm = z.infer<typeof signinSchema>;

export default function SigninPage() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<SigninForm>({
        resolver: zodResolver(signinSchema),
    });

    const onSubmit = async (data: SigninForm) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error('Invalid credentials');
            }

            const result = await res.json();
            login(result.token, result.user);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to Clickpe</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Welcome back to your dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" type="email" {...register('email')} className="mt-1" />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register('password')} className="mt-1" />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link href="/auth/signup" className="font-semibold text-primary hover:text-primary/90">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
