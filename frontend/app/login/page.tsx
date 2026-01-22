'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log('Sign in:', { email, password, rememberMe });
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left side - Image */}
      <div className="lg:flex lg:w-1/2 relative bg-gray-100">
        <Image
          src="/login-background.png"
          alt="Login visual"
          fill
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
            <div className="transform transition duration-500 hover:scale-105 flex top-4 left-4 z-50 lg:relative lg:top-0 lg:left-0 max-w-fit">
              <Link href="/" className="flex items-center gap-2 bg-black dark:bg-white px-3 py-2 lg:px-4 rounded-2xl text-white dark:text-black hover:opacity-80 shadow-md lg:shadow-none">
                <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="text-xs lg:text-sm font-medium">Return</span>
              </Link>
            </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border border-input bg-background accent-foreground"
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="transform transition duration-500 hover:scale-105 w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium hover:bg-primary/90 cursor-pointer"
            >
              Sign in
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}