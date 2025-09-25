import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Calculator as CalculatorIcon, 
  History, 
  Sigma,
  X,
  Plus,
  Minus,
  Divide,
  Equal,
  Delete,
  RotateCcw
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([
    { expression: '√(25)', result: '5' },
    { expression: 'sin(30°)', result: '0.5' },
    { expression: '2³', result: '8' },
    { expression: '15 × 8', result: '120' }
  ]);
  const [scientificInput, setScientificInput] = useState('');

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Add to history
      setHistory(prev => [{
        expression: `${currentValue} ${operation} ${inputValue}`,
        result: String(newValue)
      }, ...prev.slice(0, 19)]);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      
      // Add to history
      setHistory(prev => [{
        expression: `${previousValue} ${operation} ${inputValue}`,
        result: String(newValue)
      }, ...prev.slice(0, 19)]);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const handleScientificCalculation = () => {
    try {
      // This is a mock implementation - in a real app you'd use a math library
      let result = '';
      const input = scientificInput.toLowerCase();
      
      if (input.includes('sin(')) {
        result = 'sin function calculated';
      } else if (input.includes('cos(')) {
        result = 'cos function calculated';
      } else if (input.includes('sqrt(')) {
        result = 'square root calculated';
      } else if (input.includes('log(')) {
        result = 'logarithm calculated';
      } else {
        result = eval(scientificInput.replace(/×/g, '*').replace(/÷/g, '/'));
      }
      
      setHistory(prev => [{
        expression: scientificInput,
        result: String(result)
      }, ...prev.slice(0, 19)]);
      
      setScientificInput('');
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const calculatorButtons = [
    [{ text: 'AC', action: clear, variant: 'secondary' }, { text: 'CE', action: clearEntry, variant: 'secondary' }, { text: '⌫', action: () => setDisplay(display.slice(0, -1) || '0'), variant: 'secondary' }, { text: '÷', action: () => inputOperation('÷'), variant: 'operation' }],
    [{ text: '7', action: () => inputNumber(7) }, { text: '8', action: () => inputNumber(8) }, { text: '9', action: () => inputNumber(9) }, { text: '×', action: () => inputOperation('×'), variant: 'operation' }],
    [{ text: '4', action: () => inputNumber(4) }, { text: '5', action: () => inputNumber(5) }, { text: '6', action: () => inputNumber(6) }, { text: '-', action: () => inputOperation('-'), variant: 'operation' }],
    [{ text: '1', action: () => inputNumber(1) }, { text: '2', action: () => inputNumber(2) }, { text: '3', action: () => inputNumber(3) }, { text: '+', action: () => inputOperation('+'), variant: 'operation' }],
    [{ text: '±', action: () => setDisplay(String(-parseFloat(display))), variant: 'secondary' }, { text: '0', action: () => inputNumber(0) }, { text: '.', action: () => setDisplay(display.includes('.') ? display : display + '.') }, { text: '=', action: performCalculation, variant: 'equals' }]
  ];

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'log'],
    ['ln', '√', 'x²', 'xʸ'],
    ['π', 'e', '(', ')'],
    ['1/x', '%', '±', 'C']
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Calculator</h1>
          <p className="text-gray-600 mt-1">Basic, scientific, and graphing calculator tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalculatorIcon className="w-5 h-5 text-green-600" />
              <span>Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
                <TabsTrigger value="graphing">Graphing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                {/* Display */}
                <div className="bg-gray-900 text-white p-6 rounded-lg">
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">
                      {previousValue && operation ? `${previousValue} ${operation}` : ''}
                    </div>
                    <div className="text-3xl font-mono">{display}</div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {calculatorButtons.flat().map((button, index) => (
                    <Button
                      key={index}
                      onClick={button.action}
                      variant={button.variant === 'operation' ? 'default' : button.variant === 'equals' ? 'default' : 'outline'}
                      className={`h-14 text-lg ${
                        button.variant === 'operation' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : button.variant === 'equals'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : button.variant === 'secondary'
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          : 'bg-white hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      {button.text}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="scientific" className="space-y-4">
                <div className="space-y-4">
                  <Input
                    placeholder="Enter scientific expression (e.g., sin(30), sqrt(25), log(100))"
                    value={scientificInput}
                    onChange={(e) => setScientificInput(e.target.value)}
                    className="text-lg p-4"
                  />
                  <Button 
                    onClick={handleScientificCalculation}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Calculate
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {scientificButtons.flat().map((func, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-12"
                      onClick={() => setScientificInput(prev => prev + func + '(')}
                    >
                      {func}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="graphing" className="space-y-4">
                <div className="text-center py-12">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1711344397160-b23d5deaa012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjYWxjdWxhdG9yJTIwbWF0aCUyMHRvb2xzfGVufDF8fHx8MTc1ODgyNDA0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Graphing calculator preview"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Graphing Calculator</h3>
                  <p className="text-gray-600 mb-4">Advanced graphing capabilities coming soon</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Feature in Development
                  </Badge>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* History and Functions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5 text-blue-600" />
                <span>History</span>
              </CardTitle>
              <CardDescription>Recent calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Latest calculations</span>
                <Button variant="ghost" size="sm" onClick={() => setHistory([])}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((entry, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setDisplay(entry.result)}
                  >
                    <div className="text-sm text-gray-600">{entry.expression}</div>
                    <div className="font-medium text-gray-900">= {entry.result}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sigma className="w-5 h-5 text-purple-600" />
                <span>Quick Functions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setScientificInput('sin(')}>
                  sin
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScientificInput('cos(')}>
                  cos
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScientificInput('tan(')}>
                  tan
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScientificInput('log(')}>
                  log
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScientificInput('sqrt(')}>
                  √
                </Button>
                <Button variant="outline" size="sm" onClick={() => setScientificInput(prev => prev + '²')}>
                  x²
                </Button>
              </div>
              
              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Constants</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setScientificInput(prev => prev + Math.PI.toFixed(6))}
                    className="text-xs"
                  >
                    π = 3.14159...
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setScientificInput(prev => prev + Math.E.toFixed(6))}
                    className="text-xs"
                  >
                    e = 2.71828...
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}