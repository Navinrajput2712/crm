"use client";

import React, { useState } from 'react';
import { login } from '../../lib/auth';
import { Rocket, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      setIsLoading(false);
    }
  };

  const inputBaseClass = "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-400 transition-colors";
  const inputNormalClass = "border-gray-200 focus:ring-blue-600";
  const inputErrorClass = "border-red-300 focus:ring-red-500 text-red-900";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">GrowEasy</span>
      </div>

      <div className="w-full max-w-[420px]">
        {/* Form Card */}
        <div className="bg-white p-8 rounded-[20px] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Log in to manage your leads
          </p>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className={`${inputBaseClass} ${error ? inputErrorClass : inputNormalClass}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`${inputBaseClass} ${error ? inputErrorClass : inputNormalClass} pr-10`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none ${error ? 'text-red-400 hover:text-red-500' : 'text-gray-400 hover:text-gray-500'}`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Contact your administrator to create an account.
        </p>
      </div>
    </div>
  );
}
