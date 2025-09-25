import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  BookOpen, 
  Brain, 
  Calculator as CalculatorIcon, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onNavigate: (page: string) => void;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      if (user?.accessToken) {
        const { api } = await import('../utils/supabase/client');
        const response = await api.getDashboardAnalytics(user.accessToken);
        
        if (!response.error) {
          setAnalytics(response.analytics);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentProblems = analytics?.recentActivity?.map((activity, index) => ({
    id: index + 1,
    title: activity.description || "Problem solved",
    type: activity.type === 'text' ? 'text' : 'visual',
    difficulty: "intermediate",
    accuracy: activity.accuracy || null,
    timeSpent: "N/A",
    status: "completed"
  })) || [
    {
      id: 1,
      title: "Linear Algebra Word Problem",
      type: "text",
      difficulty: "intermediate",
      accuracy: 95,
      timeSpent: "12 min",
      status: "completed"
    }
  ];

  const researchMetrics = [
    { label: "Problems Solved", value: analytics?.totalProblems?.toString() || "0", change: "+12%" },
    { label: "Accuracy Rate", value: `${analytics?.averageAccuracy || 0}%`, change: "+3%" },
    { label: "Research Hours", value: `${Math.round((analytics?.totalTimeSpent || 0) / 60)}h`, change: "+8%" },
    { label: "Team Collaboration", value: "5 projects", change: "+2" }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-gray-600 mt-1">Continue your mathematics research and learning journey</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {user?.role || 'Researcher'}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {researchMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Jump into your most used tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => onNavigate('problem-solver')}
              className="h-24 flex-col space-y-2 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200"
              variant="ghost"
            >
              <BookOpen className="w-8 h-8" />
              <span>Solve Problems</span>
            </Button>
            <Button
              onClick={() => onNavigate('ai-solver')}
              className="h-24 flex-col space-y-2 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border border-indigo-200"
              variant="ghost"
            >
              <Brain className="w-8 h-8" />
              <span>AI Solver</span>
            </Button>
            <Button
              onClick={() => onNavigate('calculator')}
              className="h-24 flex-col space-y-2 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border border-green-200"
              variant="ghost"
            >
              <CalculatorIcon className="w-8 h-8" />
              <span>Calculator</span>
            </Button>
            <Button
              onClick={() => onNavigate('research')}
              className="h-24 flex-col space-y-2 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200"
              variant="ghost"
            >
              <TrendingUp className="w-8 h-8" />
              <span>Research</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Problems</CardTitle>
              <CardDescription>Your latest problem-solving sessions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('problem-solver')}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProblems.map((problem) => (
              <div key={problem.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    problem.type === 'text' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {problem.type === 'text' ? <BookOpen className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{problem.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" size="sm">
                        {problem.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {problem.timeSpent}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {problem.status === 'completed' && problem.accuracy && (
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">{problem.accuracy}%</span>
                      <p className="text-gray-500">Accuracy</p>
                    </div>
                  )}
                  {problem.status === 'in-progress' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      In Progress
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance & Team */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span>This Week</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Problems Solved</span>
                  <span>12/15</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Research Goals</span>
                  <span>3/4</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Team Collaboration</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Team Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">JD</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">John solved 3 problems</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-600">MK</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Maria shared research</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => onNavigate('team')}
                >
                  View Team
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}