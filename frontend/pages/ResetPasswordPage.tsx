import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Lock } from 'lucide-react';

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"), 
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// 👇 DHYAN DO: Yahan 'export const' hona zaruri hai
export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      // ✅ API call fix: api.resetPassword (no .auth)
      return await api.resetPassword(data);
    },
    onSuccess: () => {
      alert("Password has been reset successfully.");
      navigate('/login');
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to reset password');
    }
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 mb-6">
            <Lock className="h-6 w-6 text-zinc-100" />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">New Password</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Secure your account with a new password.
          </p>
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
               <div className="p-3 bg-zinc-900 text-zinc-500 text-xs rounded border border-zinc-800 font-mono">
                 Demo: Use <code>reset-token-[USER_ID]</code>
               </div>

              <Input
                label="Token"
                placeholder="Paste token here"
                error={errors.token?.message}
                {...register('token')}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="Confirm"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={mutation.isPending}
            >
              Update Password
            </Button>
            
            <p className="text-center text-sm text-zinc-500 mt-4">
               <Link to="/login" className="font-medium text-white hover:underline transition-all">
                Cancel
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};