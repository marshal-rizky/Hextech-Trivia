import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, PlayCircle, Trophy, Clock, Star, Info, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getQuizzes } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { getTotalUserCount } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch total user count
        const userCount = await getTotalUserCount();
        
        // 2. Fetch all quizzes for global stats
        const allQuizzes = await getQuizzes();
        const activeArtifacts = allQuizzes.length;
        const totalGlobalPlays = allQuizzes.reduce((sum, q) => sum + (q.plays || 0), 0);

        // 3. Filter for current user's trials
        const userTrials = allQuizzes.filter(q => q.author_id === user?.id);
        const sorted = userTrials.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setRecentQuizzes(sorted.slice(0, 2));

        setStats([
          { label: 'Total Players', value: userCount.toLocaleString(), icon: Users, color: 'text-blue-400' },
          { label: 'Total Artifacts', value: activeArtifacts.toString(), icon: PlayCircle, color: 'text-[var(--color-hextech-blue)]' },
          { label: 'Total Global Plays', value: totalGlobalPlays.toLocaleString(), icon: Trophy, color: 'text-[var(--color-gold)]' },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[var(--color-hextech-blue)] animate-spin" />
        <p className="text-gray-400 font-[Cinzel] tracking-widest animate-pulse">Synchronizing with Hextech Network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {isGuest && (
        <div className="bg-[var(--color-hextech-blue)]/10 border border-[var(--color-hextech-blue)] text-[var(--color-hextech-blue)] p-4 rounded-xl flex items-center gap-3 shadow-[0_0_15px_var(--color-hextech-blue-glow)]">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">You are exploring the Vault as a Wanderer. <button onClick={() => navigate('/register')} className="underline hover:text-white transition-colors">Create an account</button> to forge your own Artifacts and save your ranks.</p>
        </div>
      )}
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Maker Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.username || 'Summoner'}. Here is your current status.</p>
        </div>
        {!isGuest && (
          <Button onClick={() => navigate('/create')} className="w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create New Quiz
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-center p-6">
            <div className={`p-4 rounded-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] ${stat.color} mr-6`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-[Cinzel] font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Quizzes Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your Recent Artifacts</h2>
          <button 
            onClick={() => navigate('/vault')}
            className="text-[var(--color-hextech-blue)] text-sm font-medium hover:text-[var(--color-gold)] transition-colors flex items-center gap-1"
          >
            Enter Full Vault
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {recentQuizzes.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-[var(--color-glass-border)] bg-[var(--color-navy)]/30 backdrop-blur-md p-12 lg:p-20 text-center group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-hextech-blue)] opacity-[0.03] blur-[100px] group-hover:opacity-[0.08] transition-opacity duration-700" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-gold)] opacity-[0.03] blur-[100px] group-hover:opacity-[0.08] transition-opacity duration-700" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-deep-navy)] border border-[var(--color-glass-border)] flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:glow-blue transition-all duration-500">
                <Plus className="w-12 h-12 text-[var(--color-hextech-blue)]" />
              </div>
              
              <h3 className="text-4xl font-[Cinzel] font-bold text-white mb-4 tracking-wide">
                The Vault Awaits Its Architect
              </h3>
              <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-lg">
                Your personal repository of Trials is currently empty. You can begin by forging your own Artifact or explore the collective wisdom of the Hextech Network.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                <Button 
                  onClick={() => navigate('/create')}
                  className="!py-4 !px-10 text-lg shadow-[0_0_30px_rgba(0,163,255,0.2)] hover:shadow-[0_0_40px_rgba(0,163,255,0.4)] transition-all duration-300"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Forge New Trial
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/vault')}
                  className="!py-4 !px-10 text-lg border-[var(--color-gold)]/20 hover:border-[var(--color-gold)] text-[var(--color-gold)]/80 hover:text-[var(--color-gold)] bg-transparent hover:bg-[var(--color-gold)]/5 transition-all duration-300"
                >
                  <PlayCircle className="w-6 h-6 mr-2" />
                  Explore the Vault
                </Button>
              </div>
            </div>
            
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--color-hextech-blue)] opacity-20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--color-gold)] opacity-20 rounded-br-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentQuizzes.map((quiz) => (
              <Card key={quiz.id} className="group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-hextech-blue)] opacity-5 blur-[50px] group-hover:opacity-20 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[var(--color-gold)] transition-colors">
                    {quiz.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-[var(--color-hextech-blue)]" />
                      <span>{quiz.plays.toLocaleString()} plays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[var(--color-gold)]" />
                      <span>{quiz.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{quiz.questions.length} Trials</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button onClick={() => navigate(`/play/${quiz.id}`)} variant="primary" className="px-4 py-2 text-xs">Play Artifact</Button>
                    <Button variant="secondary" className="px-4 py-2 text-xs">Edit Rules</Button>
                    <Button 
                      onClick={() => navigate(`/leaderboard/${quiz.id}`)} 
                      variant="secondary" 
                      className="px-4 py-2 text-xs"
                    >
                      View Stats
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
