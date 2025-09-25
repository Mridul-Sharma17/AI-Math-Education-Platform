import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Brain, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuthPageProps {
  onLogin: (user: any) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    institution: '',
    role: 'student'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { supabase } = await import('../utils/supabase/client');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        console.error('Login error:', error);
        return;
      }

      if (data.session) {
        // Get user profile from backend
        const { api } = await import('../utils/supabase/client');
        const profileResponse = await api.getProfile(data.session.access_token);
        
        onLogin({
          ...profileResponse.profile,
          accessToken: data.session.access_token
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { api } = await import('../utils/supabase/client');
      
      const userData = {
        email: registerForm.email,
        password: registerForm.password,
        name: registerForm.name,
        institution: registerForm.institution,
        role: registerForm.role
      };

      const response = await api.signup(userData);
      
      if (response.error) {
        console.error('Registration error:', response.error);
        return;
      }

      // Auto-login after successful registration
      const { supabase } = await import('../utils/supabase/client');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: registerForm.email,
        password: registerForm.password,
      });

      if (!error && data.session) {
        onLogin({
          name: registerForm.name,
          email: registerForm.email,
          role: registerForm.role,
          institution: registerForm.institution,
          accessToken: data.session.access_token
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MathAI Platform</h1>
              <p className="text-lg text-gray-600">AI-Powered Mathematics Education & Research</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Interactive Learning</h3>
                <p className="text-gray-600">Solve complex math problems with AI assistance and step-by-step guidance</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Brain className="w-6 h-6 text-indigo-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Advanced AI Models</h3>
                <p className="text-gray-600">Leverage cutting-edge transformer models for mathematical reasoning</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758685733737-71f8945decf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbiUyMGFjYWRlbWljfGVufDF8fHx8MTc1ODgyNDAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Mathematics education"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Right side - Authentication */}
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Email address"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Full name"
                      className="pl-10"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="pl-10"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <Input
                    placeholder="Institution"
                    value={registerForm.institution}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, institution: e.target.value }))}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}