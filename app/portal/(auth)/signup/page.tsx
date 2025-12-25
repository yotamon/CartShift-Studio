'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { signUpWithEmail } from '@/lib/services/auth';
import { Suspense } from 'react';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupData = z.infer<typeof signupSchema>;

function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const prefilledEmail = searchParams.get('email');
  const redirectPath = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: prefilledEmail || '',
    },
  });

  useEffect(() => {
    if (prefilledEmail) {
      setValue('email', prefilledEmail);
    }
  }, [prefilledEmail, setValue]);

  const onSubmit = async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      await signUpWithEmail(data.email, data.password, data.name);
      router.push(redirectPath || '/portal/org/');
    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage =
        err.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : err.code === 'auth/weak-password'
          ? 'Password is too weak. Please choose a stronger password.'
          : err.message || 'Failed to create account. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] space-y-8">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
          C
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Get started with the CartShift portal</p>
        </div>
      </div>

      <PortalCard className="p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <PortalInput
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <PortalInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PortalInput
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <PortalInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {error && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <PortalButton
            type="submit"
            isLoading={loading}
            className="w-full h-11"
          >
            <span>Create Account</span>
            <ArrowRight size={16} />
          </PortalButton>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link
              href={redirectPath ? `/portal/login?redirect=${encodeURIComponent(redirectPath)}` : "/portal/login/"}
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </PortalCard>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mt-8">
        <ShieldCheck size={14} />
        <span>Secure Enterprise Access</span>
        <span className="mx-1">•</span>
        <span>&copy; {new Date().getFullYear()} CartShift Studio</span>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading signup...</p>
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
