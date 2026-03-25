import React, { useMemo } from 'react';
import { 
  BarChart3, 
  Trees, 
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AnalyticsProps {
  tasks: Task[];
  setActiveTab: (tab: string) => void;
}

/**
 * Analytics Component
 * Visualizes task performance data using Recharts.
 * Includes a historical productivity chart and a growth index (XP system).
 */
const Analytics: React.FC<AnalyticsProps> = ({ tasks, setActiveTab }) => {
  // --- Data Calculations ---
  const completedTasks = tasks.filter(t => t.completed);
  const totalXP = tasks.reduce((acc, t) => acc + (t.completed ? t.xp : 0), 0);
  
  // Level system: 500 XP per level
  const level = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const levelProgress = Math.round((xpInLevel / 500) * 100);

  // Generate historical data for the last 7 days (simulated for visualization)
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    const totalCount = tasks.length;
    const completedCount = completedTasks.length;
    const incompleteCount = totalCount - completedCount;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Simulate historical trends leading up to the current state
      const factor = (7 - i) / 7;
      const simulatedTotal = Math.max(1, Math.round(totalCount * (0.8 + Math.random() * 0.4)));
      const simulatedCompleted = Math.round(completedCount * factor * (0.9 + Math.random() * 0.2));
      const simulatedIncomplete = Math.max(0, simulatedTotal - simulatedCompleted);

      data.push({
        date: dateStr,
        completed: i === 0 ? completedCount : simulatedCompleted,
        incomplete: i === 0 ? incompleteCount : simulatedIncomplete,
        total: i === 0 ? totalCount : simulatedTotal,
      });
    }
    return data;
  }, [tasks, completedTasks]);

  // Productivity velocity metric
  const productivityVelocity = Math.min(100, 60 + completedTasks.length * 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-64 min-h-screen bg-surface p-6 md:p-12 overflow-y-auto max-h-screen no-scrollbar max-w-[1600px] mx-auto"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div className="max-w-2xl">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Executive Insights</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface leading-none">Cognitive Performance</h1>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-surface-container-high rounded-full flex items-center gap-3 border border-primary/20 hover:border-primary/40 transition-colors group cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#99f7ff]"></span>
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">Live Velocity Monitoring</span>
          </div>
        </div>
      </header>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Productivity Velocity Chart Card */}
        <div className="col-span-12 lg:col-span-8">
          <section className="bg-surface-container rounded-3xl p-6 md:p-8 relative overflow-hidden group/chart border border-white/5 flex flex-col min-h-[500px] md:min-h-[550px] shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <div>
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <Activity className="text-primary" size={20} />
                  Productivity Velocity
                </h3>
                <p className="text-on-surface-variant text-sm">Historical task progression (Last 7 Days)</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(153,247,255,0.3)]">
                  {productivityVelocity}%
                </span>
                <p className="text-[10px] text-tertiary-dim uppercase font-bold">+{completedTasks.length * 2}% vs Average</p>
              </div>
            </div>

            {/* Recharts AreaChart Container */}
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIncomplete" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#484847" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#adaaaa" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#adaaaa', fontWeight: 'bold' }}
                  />
                  <YAxis 
                    stroke="#adaaaa" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#adaaaa', fontWeight: 'bold' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid rgba(153, 247, 255, 0.2)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#ffffff'
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                    name="Completed"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="incomplete" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorIncomplete)" 
                    name="Incomplete"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stackId="1" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                    name="Total Capacity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between mt-6 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span>{chartData[0].date}</span>
              <span className="text-primary flex items-center gap-1">
                <Calendar size={12} />
                Now
              </span>
            </div>
          </section>
        </div>

        {/* Sidebar Analytics Cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          {/* Growth Index (XP) Card */}
          <section className="bg-gradient-to-br from-secondary-container to-surface-container rounded-3xl p-8 shadow-[0_20px_40px_-10px_rgba(94,40,155,0.4)] border border-white/5 hover:border-white/10 transition-all group/xp flex-1 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full group-hover/xp:opacity-40 transition-opacity"></div>
                <div className="relative bg-surface-container-highest w-full h-full rounded-full flex items-center justify-center border-2 border-primary-dim/30 shadow-inner group-hover/xp:border-primary transition-colors">
                  <Trees className="text-primary drop-shadow-[0_0_8px_rgba(153,247,255,0.5)]" size={40} fill="currentColor" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-secondary tracking-[0.2em] uppercase mb-1">Growth Index</h3>
              <p className="text-4xl font-black text-on-surface tracking-tighter group-hover/xp:scale-105 transition-transform duration-500">{totalXP.toLocaleString()} <span className="text-lg font-normal text-on-surface-variant opacity-50">XP</span></p>
              
              {/* Level Progress Bar */}
              <div className="w-full bg-surface-container-lowest h-3 rounded-full mt-6 overflow-hidden relative border border-white/5 cursor-help">
                <div className="bg-primary h-full rounded-full shadow-[0_0_15px_#99f7ff] relative overflow-hidden transition-all duration-1000 ease-out" style={{ width: `${levelProgress}%` }}>
                  <div className="absolute inset-0 progress-shimmer"></div>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-4 uppercase font-bold tracking-widest group-hover/xp:text-primary-dim transition-colors">Level {level}: {500 - xpInLevel} XP to Next Mastery</p>
              
              {/* XP Breakdown Stats */}
              <div className="grid grid-cols-3 gap-2 w-full mt-8 pt-6 border-t border-white/5">
                <div className="text-left">
                  <p className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-60">Total XP</p>
                  <p className="text-lg font-black text-on-surface">{totalXP.toLocaleString()}</p>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-60">Mastery</p>
                  <p className="text-lg font-black text-on-surface">Lvl {level}</p>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-60">Surmounted</p>
                  <p className="text-lg font-black text-on-surface">{level - 1}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Active Status Quick View Card */}
          <section 
            onClick={() => setActiveTab('tasks')}
            className="bg-surface-container rounded-3xl p-8 border border-white/5 flex flex-col justify-center shadow-xl cursor-pointer hover:bg-surface-container-high hover:border-primary/20 transition-all group/status"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest group-hover/status:text-primary transition-colors">Active Status</h3>
              <span className="text-[10px] text-primary font-bold px-2 py-0.5 bg-primary/10 rounded uppercase">View Tasks</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-high border-l-4 border-primary group-hover/status:bg-surface-container-highest transition-colors">
              <p className="text-sm font-bold text-on-surface">
                {tasks.length - completedTasks.length} Pending Objectives
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Workspace optimization level: {completedTasks.length > 5 ? 'Optimal' : 'Standard'}</p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
