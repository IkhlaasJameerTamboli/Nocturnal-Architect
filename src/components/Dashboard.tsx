import React from 'react';
import { 
  Plus, 
  Bolt, 
  PieChart as PieChartIcon, 
  Sprout, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2,
  Radar as RadarIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip
} from 'recharts';
import { Task } from '../types';

interface DashboardProps {
  tasks: Task[];
  toggleTaskCompletion: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

/**
 * Dashboard Component
 * Provides a high-level overview of tasks, progress, and performance metrics.
 */
const Dashboard: React.FC<DashboardProps> = ({ tasks, toggleTaskCompletion, setActiveTab }) => {
  // Filter tasks into active and completed categories
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  // Calculate counts for various task statuses
  const completedCount = completedTasks.length;
  const activeTasksCount = activeTasks.length;
  const totalTasks = tasks.length || 1;
  
  const overdueCount = activeTasks.filter(t => t.due && t.due.includes('OVERDUE')).length;
  const pendingCount = activeTasks.filter(t => t.due === 'NO DUE DATE').length;
  const inProgressCount = activeTasksCount - overdueCount - pendingCount;
  
  // Calculate overall progress percentage
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  // Data for the Status Allocation Pie Chart
  const statusData = [
    { name: 'Completed', value: completedCount, color: '#99f7ff' },
    { name: 'In Progress', value: inProgressCount, color: '#00f1fe' },
    { name: 'Pending', value: pendingCount, color: '#5e289b' },
    { name: 'Overdue', value: overdueCount, color: '#ff716c' },
  ].filter(d => d.value > 0);

  // Calculate XP and Level progress
  const totalXP = tasks.reduce((acc, t) => acc + (t.completed ? t.xp : 0), 0);
  const level = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const levelProgress = Math.round((xpInLevel / 500) * 100);

  // Identify critical tasks (high priority or due soon)
  const criticalTasks = activeTasks
    .filter(t => t.priority === 'high' || (t.due && t.due.includes('DUE')))
    .slice(0, 4);

  // Data for the Architectural Performance Radar Chart
  const radarData = [
    { subject: 'High', A: tasks.filter(t => t.priority === 'high').length },
    { subject: 'Medium', A: tasks.filter(t => t.priority === 'medium').length },
    { subject: 'Low', A: tasks.filter(t => t.priority === 'low').length },
    { subject: 'Done', A: completedTasks.length },
    { subject: 'Active', A: activeTasks.length },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-64 pt-20 px-8 pb-12 min-h-screen max-w-[1600px] mx-auto"
    >
      {/* Header Section: Title and Quick Action */}
      <section className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface">Architectural Overview</h2>
          <p className="text-on-surface-variant mt-2 font-medium">Welcome back, your focus is currently at peak levels.</p>
        </div>
        <button 
          onClick={() => setActiveTab('tasks')}
          className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/10 transition-all hover:shadow-[0_0_20px_rgba(0,241,254,0.4)] hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} />
          New Initiative
        </button>
      </section>

      {/* Bento Grid Layout: Responsive grid for dashboard widgets */}
      <div className="grid grid-cols-12 gap-6">
        {/* Focus Timer Widget: Encourages deep work sessions */}
        <div 
          onClick={() => setActiveTab('focus')}
          className="col-span-12 lg:col-span-4 bg-surface-container-high rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden focus-aura border border-primary/5 group cursor-pointer hover:bg-surface-container-highest transition-all"
        >
          <div className="absolute top-0 right-0 p-4 transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Clock className="text-primary/40" size={24} />
          </div>
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full border-2 border-primary/20 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
              <div className="text-center">
                <span className="text-4xl font-black text-on-surface tracking-tighter block">00:00:00</span>
                <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Ready to Focus</span>
              </div>
            </div>
          </div>
          <button className="px-6 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest group-hover:bg-primary group-hover:text-on-primary-fixed transition-all">
            Start Session
          </button>
          <p className="text-on-surface-variant text-[10px] mt-4 font-bold uppercase tracking-widest opacity-60">
            Click to enter deep work mode
          </p>
        </div>

        {/* Status Allocation Widget: Visualizes task distribution by status */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-high rounded-xl p-8 flex flex-col border border-white/5 group">
          <h3 className="text-lg font-bold text-on-surface mb-6 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <PieChartIcon className="text-secondary" size={20} />
              Status Allocation
            </span>
            <span className="text-[10px] font-black uppercase text-on-surface-variant/40">Real-time</span>
          </h3>
          <div className="flex-1 flex items-center justify-center mb-6 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #484847', borderRadius: '8px' }}
                  itemStyle={{ color: '#ffffff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <p className="text-3xl font-black text-on-surface">{progressPercent}%</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Progress</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 group/legend cursor-default">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <p className="text-[10px] font-bold text-on-surface-variant group-hover/legend:text-on-surface transition-colors">
                  {item.value} {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Tree Widget: Gamification element showing XP and Level progress */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-high rounded-xl p-8 border border-white/5 flex flex-col justify-between group hover:border-tertiary/20 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-on-surface">Growth Tree</h3>
              <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[10px] font-black uppercase rounded ring-1 ring-tertiary/20">Sapling Phase</span>
            </div>
            <div className="flex items-center gap-6 my-6">
              <div className="p-5 bg-surface-container rounded-2xl relative overflow-hidden group-hover:bg-tertiary/5 transition-colors">
                <Sprout className="text-tertiary relative z-10 group-hover:scale-110 transition-transform" size={40} />
                <div className="absolute inset-0 bg-tertiary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                <p className="text-4xl font-black text-on-surface tracking-tighter">{totalXP.toLocaleString()} <span className="text-sm font-medium text-on-surface-variant">XP</span></p>
                <p className="text-xs font-semibold text-on-surface-variant/80 mt-1 flex items-center gap-1">
                  <TrendingUp size={14} />
                  Next phase: {((level) * 500).toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span>Current Level: {level}</span>
              <span>{levelProgress}% Complete</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-tertiary to-tertiary-fixed rounded-full shadow-[0_0_15px_rgba(45,231,210,0.3)] transition-all duration-1000" style={{ width: `${levelProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Performance Radar Chart: Multi-dimensional view of task priorities and completion */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-high rounded-xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <RadarIcon className="text-primary" size={20} />
                Architectural Performance
              </h3>
              <p className="text-sm text-on-surface-variant">Multi-dimensional analysis of your project output</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-on-surface-variant/40 tracking-widest">Radar Analysis</p>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#484847" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#adaaaa', fontSize: 10, fontWeight: 700 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, Math.max(tasks.length, 5)]} 
                  tick={false} 
                  axisLine={false}
                />
                <Radar
                  name="Tasks"
                  dataKey="A"
                  stroke="#00f1fe"
                  fill="#00f1fe"
                  fillOpacity={0.4}
                  animationDuration={1500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-5 gap-2 mt-4">
            {radarData.map((item) => (
              <div key={item.subject} className="text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{item.subject}</p>
                <p className="text-lg font-black text-on-surface">{item.A}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Path Widget: Highlights urgent and high-priority tasks */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-high rounded-xl p-8 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-on-surface">Critical Path</h3>
            <span 
              onClick={() => setActiveTab('tasks')}
              className="text-primary text-xs font-bold hover:underline cursor-pointer flex items-center gap-1 group"
            >
              View all 
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="space-y-4">
            {criticalTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => setActiveTab('tasks')}
                className={`group p-4 rounded-xl border-l-4 flex items-center justify-between hover:bg-surface-container transition-all cursor-pointer active:scale-[0.98] ${
                  task.priority === 'high' ? 'border-error hover:shadow-lg hover:shadow-error/5' : 'border-primary/20 hover:shadow-lg'
                }`}
              >
                <div className="flex-grow">
                  <p className={`text-sm font-bold text-on-surface transition-colors ${
                    task.priority === 'high' ? 'group-hover:text-error' : ''
                  }`}>
                    {task.title}
                  </p>
                  <p className={`text-[10px] flex items-center gap-1 mt-1 font-semibold ${
                    task.due && task.due.includes('OVERDUE') ? 'text-error/80' : 'text-on-surface-variant'
                  }`}>
                    {task.due && task.due.includes('OVERDUE') ? <AlertCircle size={12} /> : <Clock size={12} className={task.priority === 'high' ? 'text-error' : ''} />}
                    {task.due}
                  </p>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskCompletion(task.id);
                    }}
                    className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary-fixed rounded-lg text-[10px] font-black uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,241,254,0.3)] active:scale-95"
                  >
                    <CheckCircle2 size={14} />
                    Complete
                  </button>
                </div>
                <ChevronRight size={16} className={`text-on-surface-variant transition-all group-hover:translate-x-1 ${
                  task.priority === 'high' ? 'group-hover:text-error' : 'group-hover:text-primary'
                }`} />
              </div>
            ))}
            {criticalTasks.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <CheckCircle2 className="mx-auto mb-2" size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">Path Clear</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
