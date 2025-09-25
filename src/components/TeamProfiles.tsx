import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Mail, 
  MessageCircle, 
  Plus,
  Search,
  GraduationCap,
  Award,
  TrendingUp,
  Clock,
  BookOpen,
  Star
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';



export function TeamProfiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const { supabase } = await import('../utils/supabase/client');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { api } = await import('../utils/supabase/client');
        
        // Load team members
        const membersResponse = await api.getTeamMembers(session.access_token);
        if (!membersResponse.error) {
          setTeamMembers(membersResponse.members || []);
        }

        // Load projects
        const projectsResponse = await api.getProjects(session.access_token);
        if (!projectsResponse.error) {
          setProjects(projectsResponse.projects || []);
        }
      }
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'solved': return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'shared': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'collaboration': return <Users className="w-4 h-4 text-green-600" />;
      case 'mentoring': return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'development': return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Profiles</h1>
          <p className="text-gray-600 mt-1">Collaborate with researchers and track team progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            4 Active Members
          </Badge>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="relative rounded-xl overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGFjYWRlbWljfGVufDF8fHx8MTc1ODgyNDA0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Team collaboration"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 flex items-center">
          <div className="p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Mathematics Research Collective</h2>
            <p className="text-blue-100">Advancing AI-powered mathematical education through collaborative research</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">972</div>
                <div className="text-sm text-blue-200">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">93%</div>
                <div className="text-sm text-blue-200">Team Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">41</div>
                <div className="text-sm text-blue-200">Active Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Team Members</span>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredMembers.length > 0 ? filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {member.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(member.status || 'online')} border-2 border-white`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <Badge variant="outline" size="sm">
                          {member.role || 'Member'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{member.institution}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" size="sm" className="text-xs">
                          {member.role || 'Member'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{member.problemsSolved || 0}</div>
                        <div className="text-xs">Problems</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{member.accuracy || 0}%</div>
                        <div className="text-xs">Accuracy</div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="mt-4 pt-3 border-t">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Active member since {new Date(member.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members Yet</h3>
                <p className="text-gray-600">Invite colleagues to join your research team</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects & Collaboration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Active Projects</span>
              </CardTitle>
              <CardDescription>Collaborative research initiatives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    </div>
                    <Badge variant="outline" className={getProjectStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex -space-x-2">
                      {project.participants.map((participant, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {participant.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-gray-500">Due {project.dueDate}</span>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Team Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">972</div>
                  <div className="text-sm text-gray-600">Total Problems</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">93%</div>
                  <div className="text-sm text-gray-600">Avg Accuracy</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Active Collaborations</span>
                  <span className="font-medium">41</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Published Papers</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Research Hours</span>
                  <span className="font-medium">284h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}