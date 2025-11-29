import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api'; // Correct Import
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { KeyRound, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      // FIX: 'api.auth' hataya -> direct 'api.forgotPassword'
      return await api.forgotPassword(data.email);
    },
    onSuccess: () => {
      alert("Password reset link 'sent'. Redirecting to reset page.");
      navigate('/reset-password');
    },
    onError: () => {
      alert("If an account exists, a reset link has been sent.");
    }
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 mb-6">
            <KeyRound className="h-6 w-6 text-zinc-100" />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Reset Password</h2>
          <p className="mt-2 text-sm text-zinc-500">
            We'll send you instructions to reset your password.
          </p>
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={mutation.isPending}
            >
              Send Instructions
            </Button>

            <div className="text-center mt-4">
              <Link to="/login" className="inline-flex items-center text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="h-3 w-3 mr-1" />
                Return to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};