import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  exposeHeaders: ['*'],
}))

app.use('*', logger(console.log))

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Authentication routes
app.post('/make-server-f2be3485/auth/signup', async (c) => {
  try {
    const { email, password, name, institution, role } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        institution,
        role: role || 'student'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Create user profile in kv store
    await kv.set(`user_profile:${data.user.id}`, {
      id: data.user.id,
      name,
      email,
      institution,
      role,
      problemsSolved: 0,
      accuracy: 0,
      collaborations: 0,
      createdAt: new Date().toISOString()
    })

    return c.json({ user: data.user, message: 'User created successfully' })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get user profile
app.get('/make-server-f2be3485/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const profile = await kv.get(`user_profile:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json({ profile })
  } catch (error) {
    console.log('Profile fetch error:', error)
    return c.json({ error: 'Error fetching user profile' }, 500)
  }
})

// Save problem solution
app.post('/make-server-f2be3485/problems/solve', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { problemId, solution, accuracy, timeSpent, type } = await c.req.json()

    const solutionData = {
      id: crypto.randomUUID(),
      userId: user.id,
      problemId,
      solution,
      accuracy,
      timeSpent,
      type,
      solvedAt: new Date().toISOString()
    }

    await kv.set(`solution:${solutionData.id}`, solutionData)
    
    // Update user stats
    const profile = await kv.get(`user_profile:${user.id}`)
    if (profile) {
      const updatedProfile = {
        ...profile,
        problemsSolved: (profile.problemsSolved || 0) + 1,
        accuracy: Math.round(((profile.accuracy * (profile.problemsSolved || 0)) + accuracy) / ((profile.problemsSolved || 0) + 1))
      }
      await kv.set(`user_profile:${user.id}`, updatedProfile)
    }

    return c.json({ solution: solutionData, message: 'Solution saved successfully' })
  } catch (error) {
    console.log('Solution save error:', error)
    return c.json({ error: 'Error saving solution' }, 500)
  }
})

// Get user solutions
app.get('/make-server-f2be3485/problems/solutions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const solutions = await kv.getByPrefix(`solution:`)
    const userSolutions = solutions.filter(s => s.userId === user.id)
      .sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime())

    return c.json({ solutions: userSolutions })
  } catch (error) {
    console.log('Solutions fetch error:', error)
    return c.json({ error: 'Error fetching solutions' }, 500)
  }
})

// Research tracks endpoints
app.post('/make-server-f2be3485/research/tracks', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { title, description, type, difficulty, problems } = await c.req.json()

    const track = {
      id: crypto.randomUUID(),
      title,
      description,
      type, // 'text' or 'visual'
      difficulty,
      problems,
      createdBy: user.id,
      participants: [user.id],
      progress: 0,
      completed: 0,
      createdAt: new Date().toISOString()
    }

    await kv.set(`research_track:${track.id}`, track)
    return c.json({ track, message: 'Research track created successfully' })
  } catch (error) {
    console.log('Research track creation error:', error)
    return c.json({ error: 'Error creating research track' }, 500)
  }
})

// Get research tracks
app.get('/make-server-f2be3485/research/tracks', async (c) => {
  try {
    const tracks = await kv.getByPrefix('research_track:')
    return c.json({ tracks })
  } catch (error) {
    console.log('Research tracks fetch error:', error)
    return c.json({ error: 'Error fetching research tracks' }, 500)
  }
})

// Team collaboration endpoints
app.get('/make-server-f2be3485/team/members', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const profiles = await kv.getByPrefix('user_profile:')
    return c.json({ members: profiles })
  } catch (error) {
    console.log('Team members fetch error:', error)
    return c.json({ error: 'Error fetching team members' }, 500)
  }
})

// Project collaboration
app.post('/make-server-f2be3485/projects', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { title, description, participants, dueDate } = await c.req.json()

    const project = {
      id: crypto.randomUUID(),
      title,
      description,
      participants: [user.id, ...participants],
      progress: 0,
      status: 'active',
      dueDate,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    }

    await kv.set(`project:${project.id}`, project)
    return c.json({ project, message: 'Project created successfully' })
  } catch (error) {
    console.log('Project creation error:', error)
    return c.json({ error: 'Error creating project' }, 500)
  }
})

// Get projects
app.get('/make-server-f2be3485/projects', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const projects = await kv.getByPrefix('project:')
    const userProjects = projects.filter(p => p.participants.includes(user.id))

    return c.json({ projects: userProjects })
  } catch (error) {
    console.log('Projects fetch error:', error)
    return c.json({ error: 'Error fetching projects' }, 500)
  }
})

// AI solver with image processing
app.post('/make-server-f2be3485/ai/solve', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    const { problem, type, imageData } = await c.req.json()

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockSolution = {
      id: crypto.randomUUID(),
      userId: user.id,
      problem,
      type,
      steps: [
        {
          title: "Problem Analysis",
          content: "Analyzing the mathematical problem using advanced AI algorithms",
          formula: type === 'text' ? "Identified as algebraic word problem" : "Processed visual input"
        },
        {
          title: "Solution Strategy",
          content: "Applying optimal solution method based on problem type",
          formula: "Method: Step-by-step algebraic manipulation"
        },
        {
          title: "Final Answer",
          content: "Computed final result with high confidence",
          formula: "Answer validated using multiple approaches"
        }
      ],
      answer: type === 'text' ? "x = 3.5" : "Equation solution: x = 2, y = 5",
      confidence: Math.floor(Math.random() * 10) + 90,
      createdAt: new Date().toISOString()
    }

    await kv.set(`ai_solution:${mockSolution.id}`, mockSolution)
    return c.json({ solution: mockSolution })
  } catch (error) {
    console.log('AI solve error:', error)
    return c.json({ error: 'Error processing AI solution' }, 500)
  }
})

// Analytics dashboard
app.get('/make-server-f2be3485/analytics/dashboard', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401)
    }

    // Get user solutions for analytics
    const solutions = await kv.getByPrefix('solution:')
    const userSolutions = solutions.filter(s => s.userId === user.id)

    const analytics = {
      totalProblems: userSolutions.length,
      averageAccuracy: userSolutions.length > 0 
        ? Math.round(userSolutions.reduce((sum, s) => sum + s.accuracy, 0) / userSolutions.length)
        : 0,
      totalTimeSpent: userSolutions.reduce((sum, s) => sum + parseInt(s.timeSpent || '0'), 0),
      problemTypes: {
        text: userSolutions.filter(s => s.type === 'text').length,
        visual: userSolutions.filter(s => s.type === 'visual').length
      },
      recentActivity: userSolutions.slice(0, 5).map(s => ({
        type: 'solved',
        description: `Solved ${s.type} problem`,
        time: s.solvedAt,
        accuracy: s.accuracy
      }))
    }

    return c.json({ analytics })
  } catch (error) {
    console.log('Analytics fetch error:', error)
    return c.json({ error: 'Error fetching analytics' }, 500)
  }
})

// Health check
app.get('/make-server-f2be3485/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

serve(app.fetch)