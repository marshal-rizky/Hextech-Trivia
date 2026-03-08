import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Users, Star, Clock, ArrowLeft, Medal, Calendar, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getQuizById, getLeaderboard } from '../utils/storage';

const LeaderboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [loadedQuiz, loadedLeaderboard] = await Promise.all([
          getQuizById(id),
          getLeaderboard(id)
        ]);

        if (!loadedQuiz) {
          alert("Artifact not found in Vault.");
          navigate('/');
          return;
        }

        setQuiz(loadedQuiz);
        setLeaderboard(loadedLeaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[var(--color-hextech-blue)] animate-spin" />
        <p className="text-gray-400 font-[Cinzel] tracking-widest animate-pulse">Retrieving Scroll of Records...</p>
      </div>
    );
  }

  if (!quiz) return <div className="text-white text-center mt-20 font-[Cinzel]">Artifact Not Found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] text-[var(--color-hextech-blue)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-[Cinzel] font-bold text-white mb-2">{quiz.title}</h1>
            <p className="text-gray-400">Chronicle of Champions and Trial Statistics</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/play/${id}`)} variant="primary" className="w-full md:w-auto">
          Challenge Trial
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 flex flex-col items-center text-center">
          <Users className="w-8 h-8 text-[var(--color-hextech-blue)] mb-3" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">Total Plays</p>
          <h3 className="text-3xl font-bold text-white mt-1">{quiz.plays.toLocaleString()}</h3>
        </Card>
        <Card className="p-6 flex flex-col items-center text-center">
          <Star className="w-8 h-8 text-[var(--color-gold)] mb-3" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">Rating</p>
          <h3 className="text-3xl font-bold text-white mt-1">{quiz.rating}</h3>
        </Card>
        <Card className="p-6 flex flex-col items-center text-center">
          <Clock className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">Est. Time</p>
          <h3 className="text-3xl font-bold text-white mt-1">{quiz.time}</h3>
        </Card>
        <Card className="p-6 flex flex-col items-center text-center">
          <Medal className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">Difficulty</p>
          <h3 className="text-3xl font-bold text-white mt-1">Veteran</h3>
        </Card>
      </div>

      {/* Leaderboard Section */}
      <div className="glass-panel rounded-2xl border border-[var(--color-glass-border)] overflow-hidden">
        <div className="bg-[var(--color-navy)]/50 p-6 border-b border-[var(--color-glass-border)] flex items-center gap-3">
          <Trophy className="w-6 h-6 text-[var(--color-gold)]" />
          <h2 className="text-xl font-[Cinzel] font-bold text-white">The Hall of Legends</h2>
        </div>

        {leaderboard.length === 0 ? (
          <div className="p-20 text-center">
            <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-20" />
            <p className="text-gray-500 italic">No legends have emerged for this Trial yet. Be the first to claim a rank!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-navy)]/30 text-gray-400 uppercase text-xs tracking-widest">
                  <th className="px-8 py-4 font-bold">Rank</th>
                  <th className="px-8 py-4 font-bold">Summoner</th>
                  <th className="px-8 py-4 font-bold">Score</th>
                  <th className="px-8 py-4 font-bold">Rank Tier</th>
                  <th className="px-8 py-4 font-bold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-glass-border)]">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-[Cinzel] ${
                        index === 0 ? 'bg-[var(--color-gold)] text-black' :
                        index === 1 ? 'bg-gray-300 text-black' :
                        index === 2 ? 'bg-amber-600 text-black' :
                        'bg-[var(--color-navy)] text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-white font-bold group-hover:text-[var(--color-hextech-blue)] transition-colors">{entry.username}</span>
                    </td>
                    <td className="px-8 py-6 font-mono text-[var(--color-gold)] font-bold">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-[var(--color-hextech-blue)]/10 border border-[var(--color-hextech-blue)]/30 text-[var(--color-hextech-blue)] text-xs font-bold uppercase tracking-wider">
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-gray-500 text-sm flex items-center justify-end gap-2">
                       <Calendar className="w-4 h-4" />
                       {new Date(entry.timestamp || entry.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pt-8 text-center text-gray-500 text-sm italic">
        "Victory is not in the scroll, but in the heart of the champion."
      </div>
    </div>
  );
};

export default LeaderboardPage;
