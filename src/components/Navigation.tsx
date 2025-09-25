import React from 'react';
import { 
  Home, 
  Calculator as CalculatorIcon, 
  Brain, 
  Zap, 
  BookOpen, 
  Users, 
  LogOut,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
  onLogout: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'problem-solver', label: 'Problem Solver', icon: BookOpen },
  { id: 'ai-solver', label: 'AI Solver', icon: Brain },
  { id: 'calculator', label: 'Calculator', icon: CalculatorIcon },
  { id: 'research', label: 'Research Tracks', icon: Zap },
  { id: 'team', label: 'Team', icon: Users },
];

export function Navigation({ currentPage, onNavigate, user, onLogout }: NavigationProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">MathAI Platform</h1>
            <p className="text-sm text-gray-500">Education & Research</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start space-x-3 ${
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                  : "hover:bg-blue-50 text-gray-700"
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start space-x-2 text-gray-600 hover:text-red-600"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}