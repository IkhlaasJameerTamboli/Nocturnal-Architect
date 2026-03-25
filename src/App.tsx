/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Completed from './components/Completed';
import Analytics from './components/Analytics';
import FocusMode from './components/FocusMode';
import { Task } from './types';
import { getTasks, saveTasks } from './lib/db';

/**
 * Initial sample data for the application.
 * These represent architectural tasks for a futuristic project.
 */
const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Finalize structural blueprints for Neo-Tokyo Tower',
    meta: 'Architecture • Project Alpha',
    priority: 'high',
    completed: false,
    due: 'DUE IN 2H',
    xp: 250,
    users: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIVi8KB3uFR3jCZnYpIyc26cePbsQdexJhlDL8K6vs-m3nvcOzm64NIKUjlb_wxKYhIPrRzTo3F0MGNYEW6Bf2aGQIFPOaC3cseLUEpk2wsZiaGTcUwcxW_PO8dZU82aFfjqGLVw9G9iblFmy4GrxGdCaZBKbKgqLq-aOmBz5c-9EgKUXyj3Co_XTlyynu59oA4HGjGvFIcdBhZ9Hf6gSydt3O8nGKXwshXInVP7hAFS9R70CmPj9qIPzOOTtKrFlLWjMqYzIgVUAo',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGZRddaCnM49ws9cSjVh6_f5nlB-RfLpg_SnuxxkUksoAOBvZit6fUnGdbVjAN5HhF4Q9axtleahywPrb5J_PFb6R8wW_Ysk3XmupMtdE5fIZcAdCpblNVZlavshMOoJGcjVCUT5XsrK4TBYKXz3bzH1O98AikzQTUr0517L2hhu3yOEcqQRtRQIKSxHkrkqXedelPCPI5dhZwh1qNdMN5PpI6oX7aHx44AcgtlmXCqI7Q96LY_IYtA6rz6OmiOpFG1qcElGIpioSB'
    ]
  },
  {
    id: '2',
    title: 'Client review: Sustainable material selection',
    meta: 'Design • Eco-City',
    priority: 'high',
    completed: false,
    due: 'DUE TODAY',
    xp: 250,
    files: 4
  },
  {
    id: '3',
    title: 'Drafting community workspace layout',
    meta: 'Interior • Hub-01',
    priority: 'medium',
    completed: false,
    due: 'DUE TOMORROW',
    xp: 150,
    chats: 3
  },
  {
    id: '4',
    title: 'Solar integration feasibility study',
    meta: 'Engineering • Solaris',
    priority: 'medium',
    completed: false,
    due: 'DUE OCT 24',
    xp: 150
  },
  {
    id: '5',
    title: 'Weekly sync with lighting consultants',
    meta: 'Management • Studio',
    priority: 'medium',
    completed: false,
    due: 'DUE OCT 26',
    xp: 150
  },
  {
    id: '6',
    title: 'Archive Q3 project documentation',
    meta: 'Admin • Archive',
    priority: 'low',
    completed: false,
    due: 'NO DUE DATE',
    xp: 50
  },
  {
    id: '7',
    title: 'Update inspiration moodboard',
    meta: 'Personal • Growth',
    priority: 'low',
    completed: false,
    due: 'NO DUE DATE',
    xp: 50
  },
  {
    id: '8',
    title: 'Refactor Modular Core API',
    meta: 'Technical Debt Clearance • High Priority',
    priority: 'high',
    completed: true,
    completedAt: 'Oct 24, 14:32',
    xp: 450
  },
  {
    id: '9',
    title: 'Visual Design System Audit',
    meta: 'Creative Evolution • Styleguide',
    priority: 'medium',
    completed: true,
    completedAt: 'Oct 23, 09:15',
    xp: 250
  }
];

/**
 * Main Application Component
 * Manages global state for tasks and navigation.
 */
export default function App() {
  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Task state with initial load from IndexedDB or fallback to sample data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial data load from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTasks = await getTasks();
        if (savedTasks && savedTasks.length > 0) {
          setTasks(savedTasks);
        } else {
          // Fallback to initial tasks if DB is empty
          setTasks(INITIAL_TASKS);
          await saveTasks(INITIAL_TASKS);
        }
      } catch (error) {
        console.error('Failed to load tasks from IndexedDB:', error);
        setTasks(INITIAL_TASKS);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Persist tasks to IndexedDB whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks).catch(err => console.error('Failed to save tasks:', err));
    }
  }, [tasks, isLoaded]);

  /**
   * Adds a new task to the list.
   */
  const addTask = (title: string, priority: 'high' | 'medium' | 'low', due?: string) => {
    const xpMap = { high: 250, medium: 150, low: 50 };
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      meta: 'New Objective • Architecture',
      priority,
      completed: false,
      due: due || 'DUE TODAY',
      xp: xpMap[priority]
    };
    setTasks([newTask, ...tasks]);
  };

  /**
   * Toggles the completion status of a task and records the completion time.
   */
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? formattedDate : undefined
        };
      }
      return task;
    }));
  };

  /**
   * Removes a task from the list.
   */
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  /**
   * Updates specific fields of a task.
   */
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  /**
   * Renders the content based on the active tab.
   */
  const renderContent = () => {
    if (!isLoaded) return <div className="ml-64 pt-20 px-8">Loading your workspace...</div>;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} setActiveTab={setActiveTab} />;
      case 'tasks':
        return (
          <Tasks 
            tasks={tasks} 
            addTask={addTask} 
            toggleTaskCompletion={toggleTaskCompletion} 
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        );
      case 'completed':
        return <Completed tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} deleteTask={deleteTask} />;
      case 'analytics':
        return <Analytics tasks={tasks} setActiveTab={setActiveTab} />;
      case 'focus':
        return <FocusMode />;
      default:
        return <Dashboard tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Top Navigation Bar (Hidden in Focus Mode) */}
      {activeTab !== 'focus' && <TopBar />}
      
      {/* Main Content Area */}
      <main className="transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
}
