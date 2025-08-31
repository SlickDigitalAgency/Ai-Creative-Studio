
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useToast } from '../../components/ui/Toast';
import Logo from '../../components/common/Logo';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });
    
    const onSubmit = async (data: LoginFormValues) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            toast({ title: "Success", description: "Logged in successfully." });
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast({ title: "Login Failed", description: error.message, variant: 'destructive' });
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast({ title: "Success", description: "Logged in successfully with Google." });
            navigate('/dashboard');
        } catch (error: any) {
             console.error(error);
            toast({ title: "Login Failed", description: error.message, variant: 'destructive' });
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mx-auto max-w-sm w-[400px]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Logo />
            </div>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="ml-auto inline-block text-sm underline">Forgot your password?</Link>
                </div>
                <Input id="password" type="password" {...register('password')} />
                 {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin} disabled={isSubmitting}>
                Login with Google
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="underline">Sign up</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
