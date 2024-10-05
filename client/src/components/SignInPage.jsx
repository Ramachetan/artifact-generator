import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Lottie from 'lottie-react';
import animationData from '../assets/animation.json';
import { Sparkles } from 'lucide-react';

const SignInPage = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication logic
    if (username === 'admin' && password === 'admin') {
      onSignIn();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex w-full max-w-5xl shadow-lg rounded-3xl overflow-hidden">
        {/* Left Side */}
        <div className="w-2/5 p-8 flex items-center justify-center bg-gray-100">
          <Lottie animationData={animationData} className="w-full h-full" />
        </div>
        {/* Right Side */}
        <Card className="w-3/5 bg-gray-200">
          <CardContent className="p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 mx-auto text-[#003478] mb-4" />
              <h2 className="text-4xl font-bold text-[#003478]">Headstart UI</h2>
              <p className="text-lg text-gray-500 mt-2">Gen AI-Powered Interface Design</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full rounded-md border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="rounded-md">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-[#003478] hover:bg-blue-600 text-white rounded-md py-3 text-lg font-semibold transition-colors duration-200"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
