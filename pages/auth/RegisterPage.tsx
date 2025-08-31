
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useToast } from '../../components/ui/Toast';
import Logo from '../../components/common/Logo';
import type { User } from '../../types';


const registerSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });
    
    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, {
                displayName: data.displayName
            });

            const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: data.displayName,
                photoURL: firebaseUser.photoURL,
                plan: 'free',
                credits: 10,
                emailVerified: firebaseUser.emailVerified,
                createdAt: new Date().toISOString(),
            };

            await setDoc(doc(db, "users", firebaseUser.uid), newUser);
            
            toast({ title: "Success", description: "Account created successfully." });
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast({ title: "Registration Failed", description: error.message, variant: 'destructive' });
        }
    };

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
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Name</Label>
                <Input id="displayName" placeholder="John Doe" {...register('displayName')} />
                {errors.displayName && <p className="text-sm text-red-500">{errors.displayName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create an account'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="underline">Login</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
