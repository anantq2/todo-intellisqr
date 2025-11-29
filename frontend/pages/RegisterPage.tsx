import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      return await api.register(data);
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.message || 'Registration failed');
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-zinc-900 rounded-md flex items-center justify-center border border-zinc-800 mb-6">
            <UserPlus className="h-6 w-6 text-zinc-100" />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Join TaskFlow Pro today
          </p>
        </div>

        <div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                error={errors.name?.message}
                {...register('name')}
              />
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
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={mutation.isPending}
            >
              Register
            </Button>

            <p className="text-center text-sm text-zinc-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};