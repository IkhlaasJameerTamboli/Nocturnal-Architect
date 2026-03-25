import React, { useState } from 'react';
import { 
  PlusCircle, 
  Bolt, 
  Paperclip, 
  MessageSquare, 
  Search,
  Trash2,
  Calendar,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Priority } from '../types';

interface TasksProps {
  tasks: Task[];
  addTask: (title: string, priority: Priority, due?: string) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
}

/**
 * Tasks Component
 * Displays active objectives organized by priority columns.
 * Allows creating, editing, and deleting tasks.
 */
const Tasks: React.FC<TasksProps> = ({ tasks, addTask, toggleTaskCompletion, deleteTask, updateTask }) => {
  // --- State ---
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('high');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [editingDueId, setEditingDueId] = useState<string | null>(null);
  const [tempDue, setTempDue] = useState('');

  // Filter for active (non-completed) tasks
  const activeTasks = tasks.filter(t => !t.completed);

  // Column definitions for priority levels
  const columns: { id: Priority; label: string; color: string; xp: string }[] = [
    {
      id: 'high',
      label: 'High Priority',
      color: 'error',
      xp: '250 XP EA.',
    },
    {
      id: 'medium',
      label: 'Medium Priority',
      color: 'secondary',
      xp: '150 XP EA.',
    },
    {
      id: 'low',
      label: 'Low Priority',
      color: 'primary',
      xp: '50 XP EA.',
    }
  ];

  // --- Handlers ---
  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle, newTaskPriority, newTaskDue || 'NO DUE DATE');
      setNewTaskTitle('');
      setNewTaskDue('');
    }
  };

  const startEditingDue = (task: Task) => {
    setEditingDueId(task.id);
    setTempDue(task.due || '');
  };

  const saveDue = (id: string) => {
    updateTask(id, { due: tempDue || 'NO DUE DATE' });
    setEditingDueId(null);
  };

  // Helper to get priority-specific styling
  const getColStyles = (color: string) => {
    switch (color) {
      case 'error':
        return {
          header: 'bg-error/5 border-error/10',
          dot: 'bg-error shadow-[0_0_12px_rgba(255,113,108,0.5)]',
          badge: 'text-error border-error/30',
          hover: 'hover:border-error/20'
        };
      case 'secondary':
        return {
          header: 'bg-secondary/5 border-secondary/10',
          dot: 'bg-secondary shadow-[0_0_12px_rgba(188,135,254,0.5)]',
          badge: 'text-secondary border-secondary/30',
          hover: 'hover:border-secondary/20'
        };
      case 'primary':
        return {
          header: 'bg-primary/5 border-primary/10',
          dot: 'bg-primary shadow-[0_0_12px_rgba(153,247,255,0.5)]',
          badge: 'text-primary border-primary/30',
          hover: 'hover:border-primary/20'
        };
      default:
        return {
          header: 'bg-primary/5 border-primary/10',
          dot: 'bg-primary shadow-[0_0_12px_rgba(153,247,255,0.5)]',
          badge: 'text-primary border-primary/30',
          hover: 'hover:border-primary/20'
        };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-64 pt-24 pb-48 px-6 md:px-10 min-h-screen max-w-[1600px] mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-2">Active Objectives</h1>
          <p className="text-on-surface-variant text-sm font-medium">Design, refine, and execute your daily architectural milestones.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="block text-2xl font-bold text-primary">{activeTasks.length.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Active</span>
          </div>
          <div className="w-px h-10 bg-outline-variant/20"></div>
          <div className="text-right">
            <span className="block text-2xl font-bold text-secondary">{tasks.filter(t => t.due && t.due !== 'NO DUE DATE' && !t.completed).length.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Priority Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {columns.map((col) => {
          const styles = getColStyles(col.color);
          const colTasks = activeTasks.filter(t => t.priority === col.id);
          return (
            <section key={col.id} className="flex flex-col gap-6">
              {/* Column Header */}
              <div className={`flex items-center justify-between px-2 py-3 rounded-xl border ${styles.header}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface">{col.label}</h2>
                </div>
                <span className={`text-[10px] font-black border px-2 py-1 rounded-md uppercase ${styles.badge}`}>{col.xp}</span>
              </div>
              
              {/* Task List */}
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {colTasks.map((task) => (
                    <motion.div 
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ 
                        opacity: 0, 
                        x: 500, 
                        backgroundColor: '#22c55e', // green-500
                        boxShadow: '0 0 50px rgba(34, 197, 94, 0.6)',
                        transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] } 
                      }}
                      className={`group bg-surface-container p-5 rounded-2xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] border border-transparent ${styles.hover} relative overflow-hidden`}
                    >
                      {/* Floating XP indicator on exit animation */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        exit={{ 
                          opacity: [0, 1, 0], 
                          y: -60, 
                          transition: { duration: 0.5 } 
                        }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 text-white font-black text-2xl pointer-events-none z-50"
                      >
                        +{task.xp} XP
                      </motion.div>

                      {/* Task Content */}
                      <div className="flex items-start gap-4 mb-4 relative z-10">
                        <div className="flex-grow">
                          <h3 className="font-bold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">{task.title}</h3>
                          <p className="text-[11px] text-on-surface-variant font-medium mb-3">{task.meta}</p>
                          
                          <button 
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary-fixed rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(0,241,254,0.4)] hover:-translate-y-0.5 active:scale-95"
                          >
                            <CheckCircle2 size={16} />
                            Mark Complete
                          </button>
                        </div>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Task Footer (Users, Files, Chats, Due Date) */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {task.users && (
                            <div className="flex -space-x-2">
                              {task.users.map((u, j) => (
                                <img key={j} alt="User" className="w-6 h-6 rounded-full border-2 border-surface-container" src={u} referrerPolicy="no-referrer" />
                              ))}
                            </div>
                          )}
                          {task.files && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                              <Paperclip size={14} className="text-on-surface-variant" />
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase">{task.files} FILES</span>
                            </div>
                          )}
                          {task.chats && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 rounded-lg border border-secondary/20">
                              <MessageSquare size={14} className="text-secondary" />
                              <span className="text-[10px] font-bold text-secondary uppercase">{task.chats} NEW</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {editingDueId === task.id ? (
                            <div className="flex items-center gap-1">
                              <input 
                                className="bg-surface-container-lowest border border-outline-variant/20 rounded px-2 py-0.5 text-[10px] font-bold text-on-surface focus:ring-1 focus:ring-primary outline-none"
                                value={tempDue}
                                onChange={(e) => setTempDue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && saveDue(task.id)}
                                autoFocus
                              />
                              <button onClick={() => saveDue(task.id)} className="text-primary hover:text-white"><PlusCircle size={12} /></button>
                              <button onClick={() => setEditingDueId(null)} className="text-on-surface-variant hover:text-white"><X size={12} /></button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startEditingDue(task)}
                              className={`text-[10px] font-black flex items-center gap-1 hover:text-primary transition-colors ${task.due && task.due.includes('DUE') && col.id === 'high' ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}
                            >
                              <Calendar size={12} />
                              {task.due}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          );
        })}
      </div>

      {/* Creation Bar (Fixed at bottom) */}
      <div className="fixed bottom-0 right-0 w-full lg:w-[calc(100%-16rem)] p-4 md:p-8 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <div className="max-w-5xl mx-auto">
          <div className="bg-surface-container-high border border-outline-variant/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-2.5 pl-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 group transition-all focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/40">
            <div className="flex items-center gap-4 w-full">
              <PlusCircle className="text-on-surface-variant group-focus-within:text-primary transition-colors flex-shrink-0" />
              <input 
                className="flex-grow bg-transparent border-none focus:ring-0 text-on-surface font-semibold placeholder:text-on-surface-variant/40 py-4" 
                placeholder="Design a new objective..." 
                type="text" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 pr-2 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-3 py-2 border border-outline-variant/10">
                <Calendar size={14} className="text-on-surface-variant" />
                <input 
                  className="bg-transparent border-none text-[10px] font-black text-on-surface-variant focus:ring-0 w-24 uppercase tracking-wider p-0 placeholder:text-on-surface-variant/30"
                  placeholder="DUE DATE"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                />
              </div>
              <select 
                className="bg-surface-container-lowest border-none text-xs font-black text-on-surface-variant rounded-xl focus:ring-0 cursor-pointer hover:text-on-surface transition-colors py-2 px-4 uppercase tracking-wider"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
              >
                <option value="high">High Priority (250 XP)</option>
                <option value="medium">Med Priority (150 XP)</option>
                <option value="low">Low Priority (50 XP)</option>
              </select>
              <button 
                onClick={handleCreateTask}
                className="bg-gradient-to-br from-primary via-primary to-[#00f1fe] hover:brightness-110 active:scale-95 text-on-primary-container px-6 md:px-10 py-3.5 rounded-xl font-black text-sm uppercase tracking-[0.15em] transition-all shadow-[0_0_25px_rgba(153,247,255,0.2)] hover:shadow-[0_0_35px_rgba(153,247,255,0.4)] whitespace-nowrap"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Tasks;
