import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api'; // Correct import
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { SquareTerminal } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      // FIX: 'api.auth.login' hata diya, ab direct 'api.login' hai.
      // Aur hum pura 'data' object bhej rahe hain backend ko.
      return await api.login(data);
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate('/');
    },
    onError: (error: any) => {
      // Backend se specific error message dikhayenge agar available ho
      const msg = error.response?.data?.message || 'Login failed';
      alert(msg);
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 mb-6">
            <SquareTerminal className="h-6 w-6 text-zinc-100" />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Access Dashboard</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Enter your credentials to continue
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
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={mutation.isPending}
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-zinc-500 mt-4">
              New here?{' '}
              <Link to="/register" className="font-medium text-white hover:underline transition-all">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};