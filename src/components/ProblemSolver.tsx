import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock,
  Lightbulb,
  Target,
  ChevronRight
} from 'lucide-react';

const sampleProblems = [
  {
    id: 1,
    title: "Train Speed Problem",
    difficulty: "intermediate",
    category: "Algebra",
    problem: "Two trains leave different cities at the same time. Train A travels at 60 mph toward City B, while Train B travels at 80 mph toward City A. If the cities are 420 miles apart, how long will it take for the trains to meet?",
    hints: [
      "Consider the combined speed of both trains",
      "Think about the total distance they need to cover together",
      "Use the formula: Time = Distance / Speed"
    ]
  },
  {
    id: 2,
    title: "Garden Area Optimization",
    difficulty: "advanced",
    category: "Calculus",
    problem: "A farmer wants to create a rectangular garden with an area of 200 square meters. He has 60 meters of fencing to use as the perimeter. What dimensions will give him the maximum area?",
    hints: [
      "Set up the constraint equation for the perimeter",
      "Express area in terms of one variable",
      "Use calculus to find the maximum"
    ]
  },
  {
    id: 3,
    title: "Investment Growth",
    difficulty: "beginner",
    category: "Basic Math",
    problem: "Sarah invests $1,000 at 5% annual compound interest. How much will her investment be worth after 3 years?",
    hints: [
      "Use the compound interest formula A = P(1 + r)^t",
      "P = principal, r = rate, t = time",
      "Remember to convert percentage to decimal"
    ]
  }
];

export function ProblemSolver() {
  const [selectedProblem, setSelectedProblem] = useState(sampleProblems[0]);
  const [userSolution, setUserSolution] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showHints, setShowHints] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const handleStartSolving = () => {
    setIsWorking(true);
    // Start timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    // Clean up timer when component unmounts or solving stops
    return () => clearInterval(timer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interactive Problem Solver</h1>
          <p className="text-gray-600 mt-1">Practice with guided step-by-step solutions</p>
        </div>
        <div className="flex items-center space-x-4">
          {isWorking && (
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">{formatTime(timeElapsed)}</span>
            </div>
          )}
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Step {currentStep} of 4
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Select Problem</span>
            </CardTitle>
            <CardDescription>Choose a problem type to practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleProblems.map((problem) => (
              <div
                key={problem.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedProblem.id === problem.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProblem(problem)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{problem.title}</h4>
                  <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{problem.category}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main Problem Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedProblem.title}</CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className={getDifficultyColor(selectedProblem.difficulty)}>
                    {selectedProblem.difficulty}
                  </Badge>
                  <span>{selectedProblem.category}</span>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {!isWorking ? (
                  <Button onClick={handleStartSolving} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Solving
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsWorking(false)}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button variant="outline" onClick={() => {
                  setCurrentStep(1);
                  setUserSolution('');
                  setTimeElapsed(0);
                  setIsWorking(false);
                }}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Problem Statement */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Problem Statement</h3>
              <p className="text-blue-800">{selectedProblem.problem}</p>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{currentStep}/4 steps</span>
              </div>
              <Progress value={(currentStep / 4) * 100} className="h-2" />
            </div>

            {/* Solution Area */}
            <Tabs defaultValue="solution" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="solution">Your Solution</TabsTrigger>
                <TabsTrigger value="hints">Hints</TabsTrigger>
                <TabsTrigger value="steps">Step Guide</TabsTrigger>
              </TabsList>
              
              <TabsContent value="solution" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write your solution approach:
                  </label>
                  <Textarea
                    placeholder="Start by identifying what you know and what you need to find..."
                    value={userSolution}
                    onChange={(e) => setUserSolution(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" disabled={currentStep === 1} onClick={() => setCurrentStep(prev => prev - 1)}>
                    Previous Step
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={currentStep === 4}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="hints" className="space-y-4">
                <div className="space-y-3">
                  {selectedProblem.hints.map((hint, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Hint {index + 1}</h4>
                        <p className="text-yellow-800 mt-1">{hint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="steps" className="space-y-4">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`p-4 rounded-lg border ${
                        step === currentStep
                          ? 'border-blue-300 bg-blue-50'
                          : step < currentStep
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step < currentStep
                            ? 'bg-green-600 text-white'
                            : step === currentStep
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Step {step}: {
                              step === 1 ? 'Understand the Problem' :
                              step === 2 ? 'Identify Variables' :
                              step === 3 ? 'Set Up Equations' :
                              'Solve and Verify'
                            }
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {step === 1 && 'Read carefully and identify what you know and need to find'}
                            {step === 2 && 'Define variables and understand the relationships'}
                            {step === 3 && 'Create mathematical expressions and equations'}
                            {step === 4 && 'Solve the equations and check your answer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}