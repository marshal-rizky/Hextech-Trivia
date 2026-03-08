import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus, Trash2, Image as ImageIcon, Save, CheckCircle, Clock, Trophy, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { saveQuiz } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

const initialQuestion = {
  id: 1,
  text: '',
  image: null,
  timeLimit: 20,
  points: 1000,
  answers: [
    { id: 1, text: '', isCorrect: false, color: 'border-red-500 hover:bg-red-500/10' },
    { id: 2, text: '', isCorrect: false, color: 'border-blue-500 hover:bg-blue-500/10' },
    { id: 3, text: '', isCorrect: false, color: 'border-yellow-500 hover:bg-yellow-500/10' },
    { id: 4, text: '', isCorrect: false, color: 'border-green-500 hover:bg-green-500/10' }
  ]
};

const QuizMaker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ ...initialQuestion }]);
  const [activeId, setActiveId] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const activeQuestion = questions.find(q => q.id === activeId);

  const handleAddQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const newQ = { ...initialQuestion, id: newId };
    newQ.answers = initialQuestion.answers.map(a => ({ ...a }));
    setQuestions([...questions, newQ]);
    setActiveId(newId);
  };

  const handleDeleteQuestion = (e, id) => {
    e.stopPropagation();
    if (questions.length <= 1) return;
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    if (activeId === id) setActiveId(updated[0].id);
  };

  const updateActiveQuestion = (updates) => {
    setQuestions(questions.map(q => q.id === activeId ? { ...q, ...updates } : q));
  };

  const updateAnswer = (answerId, text, isCorrect = null) => {
    updateActiveQuestion({
      answers: activeQuestion.answers.map(a => {
        if (a.id === answerId) {
          return { ...a, text, isCorrect: isCorrect !== null ? isCorrect : a.isCorrect };
        }
        return a;
      })
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateActiveQuestion({ image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    updateActiveQuestion({ image: null });
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!quizTitle.trim()) {
      alert("Please enter an Artifact Title before saving.");
      return;
    }
    
    // Basic validation
    const isValid = questions.every(q => 
      q.text.trim() !== '' && 
      q.answers.some(a => a.isCorrect) &&
      q.answers.every(a => a.text.trim() !== '')
    );

    if (!isValid) {
      alert("Please ensure all trials have a question, 4 answers, and at least 1 correct answer selected.");
      return;
    }

    setIsSaving(true);
    try {
      const quizData = {
        title: quizTitle,
        questions: questions,
        authorId: user?.id || 'guest',
        createdAt: new Date().toISOString(),
        plays: 0,
        rating: "New",
        time: `${questions.reduce((acc, curr) => acc + curr.timeLimit, 0)}s` 
      };

      const saved = await saveQuiz(quizData);
      if (saved) {
        navigate('/vault');
      } else {
        alert("Failed to save to Cloud Vault. Please check your internet connection.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      
      {/* Top Header */}
      <div className="flex justify-between items-center bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-xl p-4 mb-6 shadow-lg z-20">
        <div className="flex items-center gap-4 flex-1">
          <Settings className="w-6 h-6 text-[var(--color-hextech-blue)]" />
          <input 
            type="text" 
            placeholder="Enter Artifact Title..." 
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            disabled={isSaving}
            className="bg-transparent border-none text-xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-0 w-1/2 disabled:opacity-50"
          />
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="!py-2" disabled={isSaving}>Preview</Button>
          <Button onClick={handleSave} className="!py-2 min-w-[160px]" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Forging...' : 'Save to Vault'}
          </Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Left Sidebar - Question List */}
        <div className="w-48 xl:w-64 glass-panel rounded-xl flex flex-col overflow-hidden border border-[var(--color-glass-border)]">
          <div className="p-4 border-b border-[var(--color-glass-border)] bg-[var(--color-navy)] backdrop-blur-md">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Trials ({questions.length})</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {questions.map((q, idx) => (
              <div 
                key={q.id}
                onClick={() => !isSaving && setActiveId(q.id)}
                className={`relative group cursor-pointer rounded-lg p-3 border-2 transition-all duration-200 ${
                  activeId === q.id 
                    ? 'border-[var(--color-hextech-blue)] bg-[var(--color-hextech-blue)]/10 glow-blue' 
                    : 'border-[var(--color-glass-border)] bg-[var(--color-navy)] hover:border-[var(--color-gold)]'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-xs text-gray-400 mb-1 font-bold">Q{idx + 1}</div>
                <div className="text-sm text-white truncate">{q.text || 'Empty Question'}</div>
                
                {questions.length > 1 && !isSaving && (
                  <button 
                    onClick={(e) => handleDeleteQuestion(e, q.id)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-[var(--color-glass-border)] bg-[var(--color-navy)] backdrop-blur-md">
            <Button onClick={handleAddQuestion} variant="secondary" className="w-full !px-2 !py-2 text-xs flex items-center justify-center" disabled={isSaving}>
              <Plus className="w-4 h-4 mr-2" /> Add Trial
            </Button>
          </div>
        </div>

        {/* Main Editor Area */}
        {activeQuestion && (
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Question Title Input */}
            <div className="glass-panel rounded-xl p-8 border border-[var(--color-glass-border)] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-hextech-blue)] opacity-50"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-hextech-blue)] opacity-50"></div>
              
              <input
                type="text"
                placeholder="Type your question here..."
                value={activeQuestion.text}
                onChange={(e) => updateActiveQuestion({ text: e.target.value })}
                disabled={isSaving}
                className="w-full bg-transparent border-none text-center text-3xl font-[Cinzel] font-bold text-white placeholder-gray-600 focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Media Upload Area */}
            <div 
              className={`h-64 glass-panel rounded-xl border-2 border-dashed border-[var(--color-glass-border)] hover:border-[var(--color-hextech-blue)] transition-colors flex flex-col items-center justify-center cursor-pointer group bg-[var(--color-navy)]/30 relative overflow-hidden ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isSaving && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              
              {activeQuestion.image ? (
                <>
                  <img src={activeQuestion.image} alt="Question Media" className="w-full h-full object-cover z-10" />
                  {!isSaving && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center">
                      <p className="text-white font-medium mb-2">Click to replace image</p>
                      <div onClick={(e) => e.stopPropagation()}>
                          <Button 
                              variant="danger" 
                              onClick={removeImage} 
                              className="!py-1 !px-3 text-xs"
                          >
                              <Trash2 className="w-4 h-4 mr-2"/> Remove
                          </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-hextech-blue)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <ImageIcon className="w-16 h-16 text-gray-500 group-hover:text-[var(--color-hextech-blue)] group-hover:scale-110 transition-all duration-300 mb-4 z-10" />
                  <p className="text-gray-400 group-hover:text-white font-medium z-10 transition-colors">Drag & drop Runeterra imagery</p>
                  <p className="text-xs text-gray-500 mt-2 z-10">or click to browse local files</p>
                </>
              )}
            </div>

            {/* Answers Grid */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              {activeQuestion.answers.map((answer) => (
                <div 
                  key={answer.id}
                  className={`relative flex items-center glass-panel rounded-xl border-l-[6px] ${answer.color} shadow-lg transition-all focus-within:ring-2 focus-within:ring-[var(--color-hextech-blue)] p-1 ${isSaving ? 'opacity-50' : ''}`}
                >
                  <input
                    type="text"
                    placeholder={`Add answer ${answer.id}...`}
                    value={answer.text}
                    onChange={(e) => updateAnswer(answer.id, e.target.value)}
                    disabled={isSaving}
                    className="flex-1 bg-transparent border-none text-white text-lg px-4 py-6 focus:outline-none placeholder-gray-600 font-medium z-10 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => !isSaving && updateAnswer(answer.id, answer.text, !answer.isCorrect)}
                    disabled={isSaving}
                    className={`absolute right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      !isSaving && 'hover:scale-110'
                    } ${
                      answer.isCorrect 
                        ? 'bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
                        : 'bg-[var(--color-deep-navy)] border-gray-600 hover:border-gray-400'
                    } ${isSaving ? 'cursor-not-allowed' : ''}`}
                    title={answer.isCorrect ? "Correct Answer" : "Mark as Correct"}
                  >
                    {answer.isCorrect && <CheckCircle className="w-6 h-6 text-white" />}
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Right Sidebar - Settings */}
        {activeQuestion && (
          <div className="w-64 glass-panel rounded-xl border border-[var(--color-glass-border)] p-6 space-y-8 h-fit sticky top-0">
            <div className={isSaving ? 'opacity-50 pointer-events-none' : ''}>
              <div className="flex items-center gap-2 mb-4 text-[var(--color-gold)]">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Time Limit</h3>
              </div>
              <select 
                value={activeQuestion.timeLimit}
                onChange={(e) => updateActiveQuestion({ timeLimit: Number(e.target.value) })}
                className="w-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] appearance-none cursor-pointer"
              >
                <option value={10}>10 Seconds (Blitz)</option>
                <option value={20}>20 Seconds (Standard)</option>
                <option value={30}>30 Seconds (Tactical)</option>
                <option value={60}>60 Seconds (Lore Master)</option>
              </select>
            </div>

            <div className={isSaving ? 'opacity-50 pointer-events-none' : ''}>
              <div className="flex items-center gap-2 mb-4 text-[var(--color-gold)]">
                <Trophy className="w-5 h-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Points Reward</h3>
              </div>
              <select 
                value={activeQuestion.points}
                onChange={(e) => updateActiveQuestion({ points: Number(e.target.value) })}
                className="w-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] appearance-none cursor-pointer"
              >
                <option value={0}>0 (Practice)</option>
                <option value={500}>500 (Easy Trial)</option>
                <option value={1000}>1000 (Standard Bounty)</option>
                <option value={2000}>2000 (Double Points!)</option>
              </select>
            </div>
            
            <div className="pt-6 border-t border-[var(--color-glass-border)]">
               <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Tip: Use high-quality splash arts to make the trial more immersive for the challengers.
               </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizMaker;
