// Gemini AI Integration Helper
import { GoogleGenerativeAI } from "npm:@google/generative-ai@^0.21.0";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") ?? '');

// System prompt for math tutor
const MATH_TUTOR_PROMPT = `
You are an expert mathematics tutor specializing in education. 
Your goal is to help students understand math concepts through clear explanations.

Guidelines:
- Break down problems into clear, logical steps
- Explain the reasoning behind each step
- Show all mathematical work and formulas
- Provide the final answer clearly
- Suggest alternative solution methods when applicable
- Rate your confidence in the solution (0-100)

Return response as JSON with this exact structure:
{
  "answer": "final answer as a clear string",
  "steps": [
    {
      "title": "Step title describing what we're doing",
      "content": "Detailed explanation of this step",
      "formula": "Mathematical formula or calculation shown"
    }
  ],
  "confidence": 95,
  "alternativeMethods": ["method1", "method2"]
}

IMPORTANT: Ensure the JSON is valid and follows the exact structure above.
`;

export interface MathSolution {
  answer: string;
  steps: Array<{
    title: string;
    content: string;
    formula: string;
  }>;
  confidence: number;
  alternativeMethods?: string[];
}

// Solve text-based math problem
export async function solveTextProblem(problemText: string): Promise<MathSolution> {
  try {
    console.log('🔍 Solving problem:', problemText.substring(0, 100) + '...');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });

    const prompt = `${MATH_TUTOR_PROMPT}\n\nProblem: ${problemText}\n\nProvide a complete step-by-step solution in JSON format.`;
    
    console.log('🤖 Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('📥 Gemini response received, length:', responseText.length);
    
    const solution = JSON.parse(responseText);
    
    // Validate response structure
    if (!solution.answer || !solution.steps || !Array.isArray(solution.steps)) {
      console.error('❌ Invalid solution structure:', solution);
      throw new Error('Invalid solution structure from Gemini');
    }
    
    console.log('✅ Solution validated, steps count:', solution.steps.length);
    
    // Ensure alternativeMethods exists
    if (!solution.alternativeMethods) {
      solution.alternativeMethods = [];
    }
    
    return solution;
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    throw new Error(`Failed to solve problem: ${error.message}`);
  }
}

// Solve image-based math problem
export async function solveImageProblem(imageBase64: string): Promise<MathSolution> {
  try {
    console.log('🖼️ Solving image problem...');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });

    const prompt = `${MATH_TUTOR_PROMPT}\n\nAnalyze this image containing a math problem. Extract the problem text and solve it completely. Provide a step-by-step solution in JSON format.`;
    
    // Remove data URL prefix if present
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;
    
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    };

    console.log('🤖 Calling Gemini Vision API...');
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    console.log('📥 Gemini Vision response received');
    
    const solution = JSON.parse(responseText);
    
    // Validate response structure
    if (!solution.answer || !solution.steps || !Array.isArray(solution.steps)) {
      console.error('❌ Invalid solution structure:', solution);
      throw new Error('Invalid solution structure from Gemini Vision');
    }
    
    console.log('✅ Vision solution validated');
    
    // Ensure alternativeMethods exists
    if (!solution.alternativeMethods) {
      solution.alternativeMethods = [];
    }
    
    return solution;
  } catch (error) {
    console.error('❌ Gemini Vision API error:', error);
    throw new Error(`Failed to solve image problem: ${error.message}`);
  }
}

// Test Gemini connection
export async function testGeminiConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Gemini connection...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent("What is 2+2? Answer in one word.");
    const response = result.response.text();
    console.log('✅ Gemini test successful, response:', response);
    return true;
  } catch (error) {
    console.error('❌ Gemini connection test failed:', error);
    return false;
  }
}
