# AI Math Education Platform

An AI-powered mathematics education platform that helps students solve math problems with step-by-step explanations using Google Gemini AI.

🔗 **Live Demo**: [https://ai-math-education-platform-dla49bhva.vercel.app](https://ai-math-education-platform-dla49bhva.vercel.app)

## Features

- AI-powered math problem solver (text and image input)
- Step-by-step solution explanations
- Interactive calculator
- User authentication
- Research tracks and team profiles

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno)
- **AI**: Google Gemini 2.5 Flash
- **Deployment**: Vercel (frontend), Supabase (backend)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```