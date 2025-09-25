import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Download
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AISolver() {
  const [inputText, setInputText] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [solution, setSolution] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(0);

  const handleTextSolve = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setAnalysisStep(0);
    
    try {
      // Get user session
      const { supabase } = await import('../utils/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        setIsProcessing(false);
        // Set a default error solution
        setSolution({
          answer: 'Please log in to use the AI solver',
          steps: [],
          alternativeMethods: [],
          confidence: 0
        });
        return;
      }

      // Simulate AI processing steps
      const steps = [
        "Parsing problem statement...",
        "Identifying mathematical concepts...",
        "Applying reasoning algorithms...",
        "Generating step-by-step solution...",
        "Validating answer..."
      ];
      
      for (let i = 0; i < steps.length; i++) {
        setAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Call backend AI solver
      const { api } = await import('../utils/supabase/client');
      const response = await api.aiSolve({
        problem: inputText,
        type: 'text'
      }, session.access_token);

      if (response.error) {
        console.error('AI solve error:', response.error);
        setIsProcessing(false);
        return;
      }

      // Ensure the solution object has all required properties
      const safeSolution = {
        ...response.solution,
        steps: response.solution?.steps || [],
        alternativeMethods: response.solution?.alternativeMethods || [],
        answer: response.solution?.answer || 'No answer provided',
        confidence: response.solution?.confidence || 0
      };

      setSolution(safeSolution);
    } catch (error) {
      console.error('Error solving problem:', error);
      // Set error solution
      setSolution({
        answer: 'An error occurred while solving the problem. Please try again.',
        steps: [],
        alternativeMethods: [],
        confidence: 0
      });
    }
    
    setIsProcessing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSolve = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    setAnalysisStep(0);
    
    try {
      // Get user session
      const { supabase } = await import('../utils/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        setIsProcessing(false);
        // Set a default error solution
        setSolution({
          answer: 'Please log in to use the AI solver',
          steps: [],
          alternativeMethods: [],
          confidence: 0
        });
        return;
      }

      const steps = [
        "Processing image...",
        "Extracting mathematical notation...",
        "Converting to symbolic form...",
        "Applying computer vision algorithms...",
        "Generating solution..."
      ];
      
      for (let i = 0; i < steps.length; i++) {
        setAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Call backend AI solver with image
      const { api } = await import('../utils/supabase/client');
      const response = await api.aiSolve({
        type: 'image',
        imageData: uploadedImage
      }, session.access_token);

      if (response.error) {
        console.error('AI solve error:', response.error);
        setIsProcessing(false);
        return;
      }

      // Ensure the solution object has all required properties
      const safeSolution = {
        ...response.solution,
        steps: response.solution?.steps || [],
        alternativeMethods: response.solution?.alternativeMethods || [],
        answer: response.solution?.answer || 'No answer provided',
        confidence: response.solution?.confidence || 0
      };

      setSolution(safeSolution);
    } catch (error) {
      console.error('Error solving image problem:', error);
      // Set error solution
      setSolution({
        answer: 'An error occurred while solving the image problem. Please try again.',
        steps: [],
        alternativeMethods: [],
        confidence: 0
      });
    }
    
    setIsProcessing(false);
  };

  const steps = [
    "Parsing problem statement...",
    "Identifying mathematical concepts...",
    "Applying reasoning algorithms...",
    "Generating step-by-step solution...",
    "Validating answer..."
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Math Solver</h1>
          <p className="text-gray-600 mt-1">Upload images or input text problems for instant AI solutions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            GPT-4 Powered
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            97% Accuracy
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Problem Input</span>
              </CardTitle>
              <CardDescription>Choose your input method</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Text Input</span>
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Image Upload</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter your math problem:
                    </label>
                    <Textarea
                      placeholder="e.g., Two trains leave different cities at the same time. Train A travels at 60 mph toward City B, while Train B travels at 80 mph toward City A. If the cities are 420 miles apart, how long will it take for the trains to meet?"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button 
                    onClick={handleTextSolve}
                    disabled={!inputText.trim() || isProcessing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Solve with AI
                      </>
                    )}
                  </Button>
                </TabsContent>
                
                <TabsContent value="image" className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload an image of your math problem</p>
                        <p className="text-sm text-gray-500 mt-1">Supports handwriting, printed text, and equations</p>
                      </label>
                    </div>
                    
                    {uploadedImage && (
                      <div className="space-y-3">
                        <div className="border rounded-lg p-2">
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded math problem" 
                            className="w-full h-40 object-contain rounded"
                          />
                        </div>
                        <Button 
                          onClick={handleImageSolve}
                          disabled={isProcessing}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing Image...
                            </>
                          ) : (
                            <>
                              <Brain className="w-4 h-4 mr-2" />
                              Solve from Image
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Processing Status */}
          {isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span>AI Processing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{steps[analysisStep]}</span>
                    <span>{Math.round(((analysisStep + 1) / steps.length) * 100)}%</span>
                  </div>
                  <Progress value={((analysisStep + 1) / steps.length) * 100} className="h-2" />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {steps.slice(0, analysisStep + 1).map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Solution Section */}
        <div className="space-y-6">
          {solution ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>AI Solution</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {solution.confidence || 0}% Confidence
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Final Answer */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">Final Answer</h3>
                  <p className="text-green-800 text-lg">{solution.answer || 'No answer provided'}</p>
                </div>

                {/* Step-by-step Solution */}
                {solution.steps && solution.steps.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Step-by-Step Solution</h3>
                    {solution.steps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-gray-900">{step.title}</h4>
                        </div>
                        <p className="text-gray-700 ml-8">{step.content}</p>
                        {step.formula && (
                          <div className="ml-8 p-2 bg-gray-50 rounded border font-mono text-sm">
                            {step.formula}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Alternative Methods */}
                {solution.alternativeMethods && solution.alternativeMethods.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Alternative Solution Methods</h3>
                    {solution.alternativeMethods.map((method, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{method}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Copy className="w-4 h-4" />
                    <span>Copy Solution</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Ready to Help</h3>
                <p className="text-gray-600">Enter a problem or upload an image to get started with AI-powered solving</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}