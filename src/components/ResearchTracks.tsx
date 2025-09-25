import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  FileText, 
  Image as ImageIcon, 
  TrendingUp, 
  Brain,
  BarChart3,
  Target,
  Clock,
  Users,
  CheckCircle,
  PlayCircle,
  BookOpen
} from 'lucide-react';

const textProblems = [
  {
    id: 1,
    title: "Algebraic Word Problems",
    description: "Linear and quadratic equations in real-world contexts",
    difficulty: "Intermediate",
    progress: 75,
    problems: 24,
    completed: 18,
    accuracy: 92,
    timeSpent: "3.2h",
    status: "active"
  },
  {
    id: 2,
    title: "Calculus Applications",
    description: "Optimization and rate problems using derivatives",
    difficulty: "Advanced",
    progress: 45,
    problems: 18,
    completed: 8,
    accuracy: 87,
    timeSpent: "5.1h",
    status: "active"
  },
  {
    id: 3,
    title: "Statistical Word Problems",
    description: "Probability and statistical inference scenarios",
    difficulty: "Beginner",
    progress: 100,
    problems: 15,
    completed: 15,
    accuracy: 96,
    timeSpent: "2.8h",
    status: "completed"
  }
];

const visualProblems = [
  {
    id: 1,
    title: "Geometric Diagrams",
    description: "Shape analysis and measurement problems",
    difficulty: "Intermediate", 
    progress: 60,
    problems: 20,
    completed: 12,
    accuracy: 89,
    timeSpent: "4.3h",
    status: "active"
  },
  {
    id: 2,
    title: "Graph Interpretation",
    description: "Reading and analyzing mathematical graphs",
    difficulty: "Beginner",
    progress: 85,
    problems: 16,
    completed: 14,
    accuracy: 94,
    timeSpent: "2.1h",
    status: "active"
  },
  {
    id: 3,
    title: "Handwritten Equations",
    description: "OCR and solving handwritten mathematical expressions",
    difficulty: "Advanced",
    progress: 30,
    problems: 25,
    completed: 7,
    accuracy: 82,
    timeSpent: "6.2h",
    status: "active"
  }
];

const modelMetrics = [
  {
    model: "GPT-4 Turbo",
    textAccuracy: 94,
    visualAccuracy: 87,
    avgTime: "2.3s",
    status: "active"
  },
  {
    model: "LLaMA 3.1",
    textAccuracy: 91,
    visualAccuracy: 83,
    avgTime: "1.8s", 
    status: "testing"
  },
  {
    model: "Mistral Large",
    textAccuracy: 89,
    visualAccuracy: 85,
    avgTime: "2.1s",
    status: "testing"
  }
];

export function ResearchTracks() {
  const [activeTab, setActiveTab] = useState('text');
  const [selectedTrack, setSelectedTrack] = useState(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'testing': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderTrackCard = (track, type) => (
    <Card key={track.id} className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              type === 'text' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
            }`}>
              {type === 'text' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <CardTitle className="text-lg">{track.title}</CardTitle>
              <CardDescription>{track.description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className={getDifficultyColor(track.difficulty)}>
              {track.difficulty}
            </Badge>
            <Badge variant="outline" className={getStatusColor(track.status)}>
              {track.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{track.completed}/{track.problems} problems</span>
          </div>
          <Progress value={track.progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{track.accuracy}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{track.timeSpent}</div>
            <div className="text-xs text-gray-500">Time Spent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">{track.problems}</div>
            <div className="text-xs text-gray-500">Total Problems</div>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          {track.status === 'completed' ? (
            <Button variant="outline" size="sm" className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Review
            </Button>
          ) : (
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
              <PlayCircle className="w-4 h-4 mr-2" />
              Continue
            </Button>
          )}
          <Button variant="outline" size="sm">
            <BookOpen className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Research Tracks</h1>
          <p className="text-gray-600 mt-1">Compare AI performance across different problem types</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            3 Active Models
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            6 Tracks Running
          </Badge>
        </div>
      </div>

      {/* Research Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Text Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Visual Tracks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">91%</p>
                <p className="text-sm text-gray-600">Avg Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-sm text-gray-600">Research Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Tracks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Problem Tracks</span>
            </CardTitle>
            <CardDescription>Compare performance across different problem types</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Text Problems</span>
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>Visual Problems</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                {textProblems.map(track => renderTrackCard(track, 'text'))}
              </TabsContent>
              
              <TabsContent value="visual" className="space-y-4">
                {visualProblems.map(track => renderTrackCard(track, 'visual'))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Model Performance */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Model Performance</span>
              </CardTitle>
              <CardDescription>AI model comparison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {modelMetrics.map((model, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{model.model}</h4>
                    <Badge variant="outline" className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Text Accuracy</span>
                      <span className="font-medium">{model.textAccuracy}%</span>
                    </div>
                    <Progress value={model.textAccuracy} className="h-1.5" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Visual Accuracy</span>
                      <span className="font-medium">{model.visualAccuracy}%</span>
                    </div>
                    <Progress value={model.visualAccuracy} className="h-1.5" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Avg Response Time</span>
                    <span>{model.avgTime}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Research Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">Key Finding</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Transformer models show 15% better performance on algebraic word problems
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 text-sm">Improvement</h4>
                  <p className="text-green-800 text-sm mt-1">
                    Visual problem accuracy increased by 12% with fine-tuning
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 text-sm">Research Goal</h4>
                  <p className="text-purple-800 text-sm mt-1">
                    Target 95% accuracy across all problem types by Q2
                  </p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}