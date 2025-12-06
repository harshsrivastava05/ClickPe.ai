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

const signupSchema = z.object({
    display_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    pan: z.string().length(10, 'PAN must be 10 chars').regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN format").optional().or(z.literal('')),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupForm) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Signup failed');
            }

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
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Get started with personalized loan offers
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="display_name">Full Name</Label>
                            <Input id="display_name" {...register('display_name')} placeholder="John Doe" className="mt-1" />
                            {errors.display_name && <p className="text-xs text-red-500 mt-1">{errors.display_name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" type="email" {...register('email')} placeholder="john@example.com" className="mt-1" />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register('password')} className="mt-1" />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="pan">PAN Number (Optional)</Label>
                            <Input id="pan" {...register('pan')} placeholder="ABCDE1234F" className="mt-1 uppercase" />
                            {errors.pan && <p className="text-xs text-red-500 mt-1">{errors.pan.message}</p>}
                        </div>
                    </div>

                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign Up
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="font-semibold text-primary hover:text-primary/90">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
