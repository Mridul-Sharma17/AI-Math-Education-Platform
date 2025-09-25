import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

const supabaseUrl = `https://${projectId}.supabase.co`

export const supabase = createClient(supabaseUrl, publicAnonKey)

// API helper functions
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-f2be3485`

export const api = {
  // Authentication
  async signup(userData: any) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  // User profile
  async getProfile(accessToken: string) {
    const response = await fetch(`${API_BASE}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.json()
  },

  // Problem solving
  async saveSolution(solutionData: any, accessToken: string) {
    const response = await fetch(`${API_BASE}/problems/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(solutionData)
    })
    return response.json()
  },

  async getSolutions(accessToken: string) {
    const response = await fetch(`${API_BASE}/problems/solutions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.json()
  },

  // AI solving
  async aiSolve(problemData: any, accessToken: string) {
    const response = await fetch(`${API_BASE}/ai/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(problemData)
    })
    return response.json()
  },

  // Research tracks
  async getResearchTracks() {
    const response = await fetch(`${API_BASE}/research/tracks`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    })
    return response.json()
  },

  async createResearchTrack(trackData: any, accessToken: string) {
    const response = await fetch(`${API_BASE}/research/tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(trackData)
    })
    return response.json()
  },

  // Team collaboration
  async getTeamMembers(accessToken: string) {
    const response = await fetch(`${API_BASE}/team/members`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.json()
  },

  async createProject(projectData: any, accessToken: string) {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(projectData)
    })
    return response.json()
  },

  async getProjects(accessToken: string) {
    const response = await fetch(`${API_BASE}/projects`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.json()
  },

  // Analytics
  async getDashboardAnalytics(accessToken: string) {
    const response = await fetch(`${API_BASE}/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    return response.json()
  }
}