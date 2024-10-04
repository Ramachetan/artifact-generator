import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Lottie from 'lottie-react';
import animationData from '../assets/animation.json';

const SignInPage = ({ onSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onSignIn();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF]">
      <div className="flex w-full max-w-5xl bg-white/40 shadow-3xl rounded-r-3xl">
        <div className="w-2/5 p-8 flex items-center justify-center bg-[#001F3F] rounded-l-3xl">
          <Lottie animationData={animationData} className="w-full h-full" />
        </div>
        <Card className="w-3/5 bg-transparent shadow-none">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <img src="https://www.ford.com/cmslibs/etc/designs/brand_ford/brand/skin/ford/img/bri-icons/Ford-logo.svg" alt="Ford Logo" className="h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#003478]">Ford Performance RapidTag</h2>
              <p className="text-sm text-gray-600 mt-2">Instant Image Tagging for Race Teams</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="rounded-lg">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-[#003478] hover:bg-[#002356] text-white rounded-full py-3 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105">
                Sign In
              </Button>
            </form>
            <div className="mt-8 text-center">
              <div className="text-sm text-gray-600 flex flex-col items-center justify-center">
                <p>Powered by</p>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" 
                  alt="Gemini Logo" 
                  className="h-7 mt-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;