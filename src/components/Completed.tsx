import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';

interface CompletedProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

/**
 * Completed Component
 * Displays a history of completed tasks (Archive of Excellence).
 * Includes progress visualization and task details.
 */
const Completed: React.FC<CompletedProps> = ({ tasks, toggleTaskCompletion, deleteTask }) => {
  // State to manage how many tasks are visible
  const [visibleCount, setVisibleCount] = useState(3);

  // Filter for completed tasks
  const completedTasks = tasks.filter(t => t.completed);

  // Tasks currently being displayed
  const displayedTasks = completedTasks.slice(0, visibleCount);

  // Helper to get priority-specific color classes
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'primary';
      case 'medium': return 'secondary';
      case 'low': return 'on-surface-variant';
      default: return 'primary';
    }
  };

  // Function to load all tasks in the archive
  const loadMore = () => {
    setVisibleCount(completedTasks.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-64 pt-16 h-screen overflow-y-auto no-scrollbar bg-surface"
    >
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter font-headline">Archive of Excellence</h1>
            <p className="text-on-surface-variant font-medium">Review your historical progress and technical milestones.</p>
          </div>
        </div>

        {/* Bento Grid Stats & Progress */}
        <div className="grid grid-cols-12 gap-6">
          {/* Quarterly Integrity Progress Card */}
          <div className="col-span-12 bg-surface-container rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl transition-all duration-300 hover:shadow-primary/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="flex flex-col md:flex-row justify-between items-start relative z-10 mb-8 gap-4">
              <div>
                <h2 className="text-xl font-bold font-headline mb-1">Quarterly Integrity</h2>
                <p className="text-on-surface-variant text-sm">
                  <span className="text-primary font-bold">{completedTasks.length}</span> of <span className="text-on-surface font-bold">{tasks.length}</span> objectives finalized
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-3xl font-black text-primary font-headline animate-pulse">
                  {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                </span>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">System Integrity Score</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden mb-4 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all duration-1000" 
                style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
              ></div>
            </div>
            {/* Progress Labels */}
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60 relative z-10">
              <span>Initiated ({tasks.length - completedTasks.length} Pending)</span>
              <span className="hidden sm:inline">Architectural Stability Reached</span>
              <span>100% Mastery</span>
            </div>
          </div>
        </div>

        {/* Task History List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold font-headline">Recent Completions</h3>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {displayedTasks.length > 0 ? (
                displayedTasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-all group relative gap-4"
                  >
                    <div className="flex items-center gap-6">
                      {/* Completion Toggle (Unmarks task) */}
                      <button 
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-${getPriorityColor(task.priority)}/10 group-hover:bg-${getPriorityColor(task.priority)}/20 flex-shrink-0`}
                      >
                        <CheckCircle2 className={`text-${getPriorityColor(task.priority)}`} fill="currentColor" size={24} />
                      </button>
                      <div>
                        <h4 className={`font-bold text-lg transition-colors group-hover:text-${getPriorityColor(task.priority)}`}>{task.title}</h4>
                        <p className="text-on-surface-variant text-sm">{task.meta}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8 text-right w-full md:w-auto">
                      <div className="hidden sm:block">
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Timestamp</p>
                        <p className="text-sm font-medium">{task.completedAt}</p>
                      </div>
                      <div className="w-24">
                        <p className={`text-xs font-bold uppercase tracking-widest text-${getPriorityColor(task.priority)}`}>XP Earned</p>
                        <p className={`text-lg font-black transition-transform origin-right group-hover:scale-110 text-${getPriorityColor(task.priority)}`}>+{task.xp} XP</p>
                      </div>
                      {/* Delete Task from History */}
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete from history"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-surface-container rounded-3xl border border-dashed border-outline-variant/20">
                  <p className="text-on-surface-variant font-medium">No completed objectives yet. Start building your legacy.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
          {/* Load More Button */}
          {completedTasks.length > visibleCount && (
            <div className="pt-8 text-center">
              <button 
                onClick={loadMore}
                className="px-8 py-3 bg-surface-container-highest text-on-surface-variant font-bold rounded-xl hover:text-on-surface hover:bg-surface-bright hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all active:scale-95 border border-outline-variant/5 hover:border-outline-variant/20"
              >
                Load History Archives
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Completed;
