import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Square,
  History as HistoryIcon,
  Trash2,
  Check,
  X,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Session {
  id: string;
  name: string;
  duration: number;
  timestamp: string;
}

const INITIAL_TIME = 0;
const MAX_TIME = 24 * 60 * 60; // 24 hours in seconds

/**
 * FocusMode Component
 * A productivity timer (stopwatch style) to track deep work sessions.
 * Includes session history and persistence via localStorage.
 */
const FocusMode: React.FC = () => {
  // --- State ---
  const [timeElapsed, setTimeElapsed] = useState(INITIAL_TIME);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('focus_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [pendingTime, setPendingTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist sessions to localStorage
  useEffect(() => {
    localStorage.setItem('focus_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeElapsed < MAX_TIME) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timeElapsed >= MAX_TIME) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeElapsed]);

  // --- Handlers ---
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (timeElapsed > 0) {
      setIsActive(false);
      setPendingTime(timeElapsed);
      setShowConfirm(true);
    } else {
      setIsActive(false);
      setTimeElapsed(INITIAL_TIME);
    }
  };

  const stopTimer = () => {
    if (timeElapsed > 0) {
      setIsActive(false);
      setPendingTime(timeElapsed);
      setShowConfirm(true);
    } else {
      setIsActive(false);
      setTimeElapsed(INITIAL_TIME);
    }
  };

  const handleConfirmRecord = (record: boolean) => {
    if (record) {
      setShowNamePrompt(true);
      setShowConfirm(false);
    } else {
      setShowConfirm(false);
      setTimeElapsed(INITIAL_TIME);
      setPendingTime(0);
    }
  };

  const handleSaveWithName = () => {
    if (pendingTime > 0) {
      const newSession: Session = {
        id: Date.now().toString(),
        name: sessionName.trim() || 'Focus Session',
        duration: pendingTime,
        timestamp: new Date().toLocaleString(),
      };
      setSessions([newSession, ...sessions]);
    }
    setShowNamePrompt(false);
    setSessionName('');
    setTimeElapsed(INITIAL_TIME);
    setPendingTime(0);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const clearHistory = () => {
    if (window.confirm('Clear all session history?')) {
      setSessions([]);
    }
  };

  // Helper to format seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Progress circle calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = timeElapsed / MAX_TIME;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ml-64 min-h-screen bg-surface relative overflow-hidden flex flex-col lg:flex-row items-center justify-center p-6 md:p-8 gap-12"
    >
      {/* Background Atmospheric Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Timer Display Section */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full">
        <div className="relative flex items-center justify-center">
          {/* Animated Progress Ring */}
          <svg className="w-64 h-64 md:w-96 md:h-96 -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              fill="transparent" 
              r={radius} 
              stroke="rgba(40, 40, 40, 0.3)" 
              strokeWidth="2"
            />
            <motion.circle 
              className={isActive ? "pulse-cyan" : ""} 
              cx="50" 
              cy="50" 
              fill="transparent" 
              r={radius} 
              stroke="url(#timerGradient)" 
              strokeLinecap="round" 
              strokeWidth="3" 
              style={{ 
                strokeDasharray: circumference,
              }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#99f7ff', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#00f1fe', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Time and Controls Overlay */}
          <div className="absolute flex flex-col items-center text-center">
            <span className={`text-on-surface-variant tracking-[0.4em] font-bold text-[10px] md:text-xs mb-1 ${isActive ? 'animate-pulse' : ''}`}>
              {isActive ? 'FOCUSING' : 'READY'}
            </span>
            <h2 className="text-5xl md:text-8xl font-extralight tracking-tighter text-on-surface tabular-nums">
              {formatTime(timeElapsed)}
            </h2>
            
            <div className="flex gap-4 md:gap-6 mt-8">
              {/* Reset Button */}
              <button 
                onClick={resetTimer}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-all border border-outline-variant/20 active:scale-90 group"
                title="Reset"
              >
                <RotateCcw size={20} className="md:size-24 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              {/* Play/Pause Button */}
              <button 
                onClick={toggleTimer}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_30px_rgba(0,241,254,0.4)] hover:scale-105 active:scale-95 transition-all group"
                title={isActive ? "Pause" : "Start"}
              >
                {isActive ? <Pause size={32} className="md:size-40" fill="currentColor" /> : <Play size={32} fill="currentColor" className="md:size-40 ml-1" />}
              </button>
              {/* Stop Button */}
              <button 
                onClick={stopTimer}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-error hover:bg-surface-container-high transition-all border border-outline-variant/20 active:scale-90"
                title="Stop"
              >
                <Square size={20} className="md:size-24" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Session History Sidebar */}
      <div className="relative z-10 w-full lg:w-96 h-[500px] md:h-[600px] bg-surface-container-low/50 backdrop-blur-xl rounded-3xl border border-outline-variant/10 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-bottom border-outline-variant/10 flex justify-between items-center bg-surface-container-high/30">
          <h3 className="text-sm font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
            <HistoryIcon size={18} className="text-primary" />
            Focus History
          </h3>
          {sessions.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-[10px] font-bold uppercase text-on-surface-variant hover:text-error transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          <AnimatePresence initial={false}>
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-surface-container-high/50 rounded-2xl border border-outline-variant/5 group hover:border-primary/20 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                          {session.name}
                        </p>
                        <p className="text-lg font-black text-on-surface tracking-tight">
                          {formatTime(session.duration)}
                        </p>
                        <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">
                          {session.timestamp}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteSession(session.id)}
                      className="p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/20">
                  <HistoryIcon size={32} />
                </div>
                <p className="text-xs font-medium text-on-surface-variant">
                  No sessions recorded yet.<br />Complete a focus session to see it here.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals Overlay */}
      <AnimatePresence>
        {/* Record Confirmation Modal */}
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-container-high w-full max-w-sm rounded-[32px] p-8 border border-outline-variant/20 shadow-2xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                <HistoryIcon size={40} />
              </div>
              <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-2">Record Session?</h2>
              <p className="text-on-surface-variant text-sm font-medium mb-8 leading-relaxed">
                You've focused for <span className="text-primary font-bold">{formatTime(pendingTime)}</span>.<br />Would you like to save this to your history?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleConfirmRecord(false)}
                  className="flex-1 py-4 rounded-2xl bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Discard
                </button>
                <button 
                  onClick={() => handleConfirmRecord(true)}
                  className="flex-1 py-4 rounded-2xl bg-primary text-on-primary-fixed font-bold text-sm hover:shadow-[0_0_20px_rgba(0,241,254,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Record
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Session Naming Modal */}
        {showNamePrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-container-high w-full max-w-sm rounded-[32px] p-8 border border-outline-variant/20 shadow-2xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6 text-secondary">
                <Play size={40} className="ml-1" />
              </div>
              <h2 className="text-2xl font-black text-on-surface tracking-tighter mb-2">Name Your Session</h2>
              <p className="text-on-surface-variant text-sm font-medium mb-6 leading-relaxed">
                Give this focus block a technical designation.
              </p>
              
              <div className="mb-8">
                <input 
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g. Architectural Review"
                  autoFocus
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface font-medium focus:outline-none focus:border-primary transition-colors text-center"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveWithName()}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setShowNamePrompt(false);
                    setSessionName('');
                    setTimeElapsed(INITIAL_TIME);
                    setPendingTime(0);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveWithName}
                  className="flex-1 py-4 rounded-2xl bg-secondary text-on-secondary-fixed font-bold text-sm hover:shadow-[0_0_20px_rgba(188,135,254,0.4)] transition-all"
                >
                  Save Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FocusMode;
