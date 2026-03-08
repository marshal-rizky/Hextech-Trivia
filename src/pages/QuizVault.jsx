import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlayCircle, Star, Clock, Users, ArrowLeft, Filter, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getQuizzes } from '../utils/storage';

const QuizVault = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      try {
        const vault = await getQuizzes();
        // Sort by newest first
        const sorted = vault.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setQuizzes(sorted);
        setFilteredQuizzes(sorted);
      } catch (error) {
        console.error("Error fetching vault:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVault();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [searchQuery, quizzes]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[var(--color-hextech-blue)] animate-spin" />
        <p className="text-gray-400 font-[Cinzel] tracking-widest animate-pulse">Unlocking the Cloud Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Search Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-[var(--color-navy)] text-gray-400 hover:text-[var(--color-gold)] transition-all border border-transparent hover:border-[var(--color-glass-border)]"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">The Artifact Vault</h1>
              <p className="text-gray-400">Discover and challenge every trial in the Hextech Network.</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[var(--color-hextech-blue)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for an Artifact (e.g. League Tactics...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-hextech-blue)]/50 focus:border-[var(--color-hextech-blue)] transition-all shadow-lg"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono tracking-tighter uppercase">Ctrl + K</span>
            <div className="h-4 w-[1px] bg-[var(--color-glass-border)] mx-1" />
            <Filter className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-glass-border)] pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {searchQuery ? `Search Results (${filteredQuizzes.length})` : `All Artifacts (${quizzes.length})`}
          </h2>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="glass-panel rounded-xl p-16 text-center border border-[var(--color-glass-border)] border-dashed border-2">
            <Search className="w-16 h-16 mx-auto text-gray-600 mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Artifacts Found</h3>
            <p className="text-gray-500">The Vault does not contain matches for "{searchQuery}". Try a different term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="group relative overflow-hidden flex flex-col h-full hover:glow-blue transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-hextech-blue)] opacity-5 blur-[40px] group-hover:opacity-15 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[var(--color-gold)] transition-colors truncate">
                      {quiz.title}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-gray-400 mb-6">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-4 h-4 text-[var(--color-hextech-blue)]" />
                        <span>{quiz.plays.toLocaleString()} plays</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[var(--color-gold)]" />
                        <span>{quiz.rating} rating</span>
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
                  </div>

                  <div className="pt-4 border-t border-[var(--color-glass-border)] flex gap-2">
                    <Button onClick={() => navigate(`/play/${quiz.id}`)} variant="primary" className="flex-1 text-xs">Play</Button>
                    <Button onClick={() => navigate(`/leaderboard/${quiz.id}`)} variant="secondary" className="px-4 text-xs">View Stats</Button>
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

export default QuizVault;
