import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CheckCircle2, 
  BarChart3, 
  Timer,
  Edit2,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/**
 * Sidebar Component
 * Main navigation for the application.
 * Includes user profile editing and tab switching.
 */
const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Alex Thorne');
  const [profession, setProfession] = useState('Pro Architect');

  // Navigation items configuration
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto flex flex-col py-8 gap-2 bg-[#1a1a1a] bg-gradient-to-r from-[#1a1a1a] to-[#0e0e0e] shadow-[40px_0_60px_-15px_rgba(188,135,254,0.08)] z-50">
      {/* Brand Section */}
      <div className="px-8 mb-10">
        <h1 className="text-xl font-black text-[#00F2FF] tracking-tighter">Nocturnal Architect</h1>
        <p className="text-[#adaaaa] text-xs font-medium uppercase tracking-widest mt-1">Premium Workspace</p>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-[calc(100%-16px)] mx-2 px-4 py-3 flex items-center gap-3 transition-all rounded-xl duration-200 text-left ${
                isActive 
                  ? 'bg-[#5e289b] text-white shadow-lg shadow-[#5e289b]/20' 
                  : 'text-[#adaaaa] hover:text-[#00F2FF] hover:bg-[#20201f]'
              }`}
            >
              <Icon size={20} className={isActive ? 'fill-current' : ''} />
              <span className={`text-sm tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section (Bottom) */}
      <div className="px-6 mt-auto">
        <div className="bg-surface-container-highest p-4 rounded-xl flex items-center gap-3 hover:bg-[#2c2c2c] transition-colors group relative">
          <div className="relative">
            <img 
              alt="User Profile Avatar" 
              className="w-10 h-10 rounded-full bg-black object-cover ring-2 ring-transparent group-hover:ring-secondary/50 transition-all" 
              src="https://images.unsplash.com/photo-1532693322450-2cb5c511067d?q=80&w=200&auto=format&fit=crop"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 rounded-full bg-black/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          
          <div className="overflow-hidden flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-1">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#3c3c3c] text-white text-xs font-bold rounded px-1 outline-none border border-primary/30"
                  autoFocus
                />
                <input 
                  type="text" 
                  value={profession} 
                  onChange={(e) => setProfession(e.target.value)}
                  className="bg-[#3c3c3c] text-[#adaaaa] text-[10px] rounded px-1 outline-none border border-primary/30"
                />
              </div>
            ) : (
              <>
                <p className="text-on-surface font-bold text-sm truncate">{name}</p>
                <p className="text-on-surface-variant text-xs truncate">{profession}</p>
              </>
            )}
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            {isEditing ? <Check size={14} /> : <Edit2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
