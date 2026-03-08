import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, incrementQuizPlays, saveScore } from '../utils/storage';
import { Trophy, Clock, XCircle, CheckCircle, ArrowRight, Info, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const GameTaker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Game State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Load Quiz
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const loadedQuiz = await getQuizById(id);
        if (!loadedQuiz) {
          alert("Artifact not found in Vault.");
          navigate('/');
          return;
        }
        setQuiz(loadedQuiz);
        setTimeLeft(loadedQuiz.questions[0].timeLimit);
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [id, navigate]);

  const currentQuestion = quiz?.questions[currentIndex];

  // Timer Logic
  useEffect(() => {
    if (!currentQuestion || isAnswered || isGameOver) return;

    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isGameOver, currentQuestion]);

  const handleTimeUp = useCallback(() => {
    setIsAnswered(true);
    setSelectedAnswerId(null); 
  }, []);

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswerId(answer.id);

    if (answer.isCorrect) {
      const timeRatio = Math.max(0.5, timeLeft / currentQuestion.timeLimit);
      const pointsEarned = Math.round(currentQuestion.points * timeRatio);
      setScore(prev => prev + pointsEarned);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswerId(null);
      setTimeLeft(quiz.questions[currentIndex + 1].timeLimit);
    } else {
      setIsFinishing(true);
      try {
        await incrementQuizPlays(id);
        
        // Save score for registered users
        if (!isGuest && user) {
          const totalPossible = quiz.questions.reduce((acc, q) => acc + q.points, 0);
          const percentage = Math.round((score / totalPossible) * 100) || 0;
          
          let rankTier = "Iron";
          if (percentage > 90) rankTier = "Challenger";
          else if (percentage > 75) rankTier = "Diamond";
          else if (percentage > 50) rankTier = "Gold";
          else if (percentage > 25) rankTier = "Silver";

          await saveScore(id, {
            userId: user.id,
            username: user.username,
            score,
            percentage,
            rank: rankTier
          });
        }
        setIsGameOver(true);
      } catch (error) {
        console.error("Error saving game results:", error);
      } finally {
        setIsFinishing(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[var(--color-hextech-blue)] animate-spin" />
        <p className="text-gray-400 font-[Cinzel] tracking-widest animate-pulse">Initializing Trial Core...</p>
      </div>
    );
  }

  if (isGameOver) {
    const totalPossible = quiz.questions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((score / totalPossible) * 100) || 0;
    
    let rankTier = "Iron";
    if (percentage > 90) rankTier = "Challenger";
    else if (percentage > 75) rankTier = "Diamond";
    else if (percentage > 50) rankTier = "Gold";
    else if (percentage > 25) rankTier = "Silver";

    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] animate-in zoom-in duration-500">
        <Card className="p-12 text-center w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-5 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-hextech-blue)] opacity-5 blur-[100px]" />
          
          <Trophy className="w-24 h-24 mx-auto text-[var(--color-gold)] mb-6 glow-blue" />
          <h1 className="text-4xl font-[Cinzel] font-bold text-white mb-2">Artifact Conquered</h1>
          <p className="text-xl text-gray-400 mb-8">{quiz.title}</p>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="glass-panel p-6 rounded-xl border border-[var(--color-glass-border)]">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Final Score</p>
              <p className="text-5xl font-bold text-gradient-gold">{score.toLocaleString()}</p>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-[var(--color-glass-border)]">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Rank Achieved</p>
              <p className="text-5xl font-bold text-[var(--color-hextech-blue)] drop-shadow-[0_0_10px_rgba(10,200,185,0.5)]">{rankTier}</p>
            </div>
          </div>
          
          {isGuest && (
             <div className="flex items-center justify-center gap-2 text-[var(--color-gold)] mb-8 bg-[var(--color-gold)]/10 p-4 rounded-lg border border-[var(--color-gold)]/20">
                <span className="text-sm font-medium">Guest Score - Not Recorded. Create an account to climb the ranks!</span>
             </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate(`/leaderboard/${id}`)} variant="secondary" className="flex-1">
               <Trophy className="w-4 h-4 mr-2" /> View Leaderboard
            </Button>
            <Button onClick={() => navigate('/dashboard')} className="flex-1">Return to Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  const defaultColors = [
    'bg-red-600 border-red-500 hover:bg-red-500', 
    'bg-blue-600 border-blue-500 hover:bg-blue-500',
    'bg-yellow-600 border-yellow-500 hover:bg-yellow-500',
    'bg-green-600 border-green-500 hover:bg-green-500'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      {/* HUD Header */}
      <div className="flex justify-between items-center bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-xl p-4 mb-6 shadow-lg z-20">
        <div className="flex items-center gap-4">
          <div className="glass-panel px-4 py-2 rounded-lg border border-[var(--color-glass-border)] flex items-center gap-2">
            <span className="text-gray-400 text-sm font-bold tracking-wider">TRIAL</span>
            <span className="text-xl font-bold text-white">{currentIndex + 1} / {quiz.questions.length}</span>
          </div>
        </div>
        
        {/* Timer UI */}
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 transition-all duration-300 ${
            timeLeft <= 5 && !isAnswered ? 'border-red-500 bg-red-500/20 animate-pulse' : 'border-[var(--color-hextech-blue)] bg-[var(--color-hextech-blue)]/10'
        }`}>
          <Clock className={`w-6 h-6 ${timeLeft <= 5 && !isAnswered ? 'text-red-500' : 'text-[var(--color-hextech-blue)]'}`} />
          <span className={`text-3xl font-bold tabular-nums ${timeLeft <= 5 && !isAnswered ? 'text-red-500' : 'text-white'}`}>
            {timeLeft}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-panel px-4 py-2 rounded-lg border border-[var(--color-glass-border)] flex flex-col items-end">
            <span className="text-gray-400 text-xs font-bold tracking-wider">SCORE</span>
            <span className="text-2xl font-bold text-gradient-gold leading-none">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Gameplay Area */}
      <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto">
        
        {/* Question Display */}
        <div className="glass-panel rounded-xl p-8 border border-[var(--color-glass-border)] shadow-2xl relative text-center flex flex-col items-center justify-center min-h-[200px]">
           <div className="absolute top-0 left-0 w-4 h-full border-l-4 border-[var(--color-hextech-blue)]"></div>
           <div className="absolute top-0 right-0 w-4 h-full border-r-4 border-[var(--color-hextech-blue)]"></div>
           
           <h2 className="text-4xl font-[Cinzel] font-bold text-white mb-6 leading-tight max-w-3xl">
             {currentQuestion.text}
           </h2>

           {currentQuestion.image && (
             <div className="w-full max-w-2xl h-64 relative rounded-xl overflow-hidden border-2 border-[var(--color-glass-border)] shadow-lg mt-4">
               <img src={currentQuestion.image} alt="Question Context" className="w-full h-full object-cover" />
             </div>
           )}
        </div>

        {/* Answer Grid ( Kahoot Style) */}
        <div className="grid grid-cols-2 gap-4 flex-1 mb-8">
          {currentQuestion.answers.map((answer, i) => {
            const hasText = answer.text && answer.text.trim() !== '';
            if (!hasText) return null; 
            
            let stateClass = '';
            let opacityClass = 'opacity-100';

            if (isAnswered) {
              if (answer.isCorrect) {
                 stateClass = 'ring-4 ring-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)] z-10 scale-[1.02]';
              } else if (selectedAnswerId === answer.id) {
                 stateClass = 'ring-4 ring-red-500 bg-red-900 border-red-500';
              } else {
                 opacityClass = 'opacity-50 grayscale saturate-0';
              }
            }

            return (
              <button
                key={answer.id}
                disabled={isAnswered}
                onClick={() => handleAnswerSelect(answer)}
                className={`
                  relative flex items-center justify-center p-8 rounded-xl border-b-8 transition-all duration-300
                  ${defaultColors[i % 4]} text-white border-black/20 text-2xl font-bold shadow-xl overflow-hidden
                  ${!isAnswered ? 'hover:-translate-y-2 hover:shadow-2xl active:translate-y-1 active:border-b-0' : 'cursor-default'}
                  ${stateClass} ${opacityClass}
                `}
              >
                {isAnswered && answer.isCorrect && (
                  <CheckCircle className="absolute top-4 right-4 w-8 h-8 text-white drop-shadow-md animate-in zoom-in duration-300" />
                )}
                {isAnswered && selectedAnswerId === answer.id && !answer.isCorrect && (
                  <XCircle className="absolute top-4 right-4 w-8 h-8 text-white opacity-50 drop-shadow-md animate-in zoom-in duration-300" />
                )}
                
                <span className="relative z-10 drop-shadow-md">{answer.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="fixed bottom-0 left-0 w-full bg-[var(--color-deep-navy)]/90 backdrop-blur-md border-t border-[var(--color-glass-border)] p-6 flex justify-center z-50 animate-in slide-in-from-bottom-full duration-300">
           <Button 
            onClick={handleNextQuestion} 
            disabled={isFinishing}
            className="text-xl !py-4 px-12 shadow-[0_0_20px_var(--color-hextech-blue-glow)] min-w-[200px]"
           >
             {isFinishing ? (
               <Loader2 className="w-6 h-6 animate-spin" />
             ) : (
               <>
                 {currentIndex < quiz.questions.length - 1 ? 'Next Trial' : 'View Results'}
                 <ArrowRight className="w-6 h-6 ml-2" />
               </>
             )}
           </Button>
        </div>
      )}
    </div>
  );
};

export default GameTaker;
