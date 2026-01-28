import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import {
  BookOpen, Clock, Target, Bell, Lightbulb, Play, Pause, Square,
  Plus, Trash2, LogOut, TrendingUp, Calendar, Flame, ChevronRight, X
} from 'lucide-react';
import { getRandomTip, getAIStudyRecommendation } from '../data/studyTips';
import type { StudyTip } from '../types';

export function Dashboard() {
  const {
    user, sessions, goals, reminders,
    isTimerRunning, timerSeconds, currentSubject,
    setTimerRunning, setTimerSeconds, setCurrentSubject,
    addSession, deleteSession, addGoal, deleteGoal,
    addReminder, updateReminder, deleteReminder, logout
  } = useStore();

  const [activeTab, setActiveTab] = useState<'timer' | 'sessions' | 'goals' | 'reminders' | 'tips'>('timer');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [currentTip, setCurrentTip] = useState<StudyTip>(getRandomTip());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const sendNotification = useCallback((title: string, body: string) => {
    if (notificationPermission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, [notificationPermission]);

  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimerSeconds(timerSeconds + 1);
        if ((timerSeconds + 1) % (25 * 60) === 0) {
          sendNotification('StudyFlow', 'Time for a 5-minute break! 🎉');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, setTimerSeconds, sendNotification]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentDay = format(now, 'EEEE').toLowerCase();
      const currentTime = format(now, 'HH:mm');
      reminders.forEach(reminder => {
        if (reminder.enabled && reminder.days.includes(currentDay) && reminder.time === currentTime) {
          sendNotification('Study Reminder', reminder.title);
        }
      });
    };
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders, sendNotification]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopTimer = () => {
    if (timerSeconds >= 60) {
      const session = {
        id: Date.now().toString(),
        userId: user?.id || '',
        subject: currentSubject || 'General',
        duration: Math.floor(timerSeconds / 60),
        date: new Date().toISOString(),
        completed: true,
        createdAt: new Date().toISOString()
      };
      addSession(session);
      sendNotification('Session Complete!', `You studied ${currentSubject || 'General'} for ${Math.floor(timerSeconds / 60)} minutes!`);
    }
    setTimerRunning(false);
    setTimerSeconds(0);
    setCurrentSubject('');
  };

  const todaySessions = sessions.filter(s => 
    format(parseISO(s.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekSessions = sessions.filter(s => 
    isWithinInterval(parseISO(s.date), { start: weekStart, end: weekEnd })
  );
  const weekMinutes = weekSessions.reduce((acc, s) => acc + s.duration, 0);

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasSession = sessions.some(s => format(parseISO(s.date), 'yyyy-MM-dd') === dateStr);
      if (hasSession) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const streak = calculateStreak();
  const subjects = [...new Set(todaySessions.map(s => s.subject))];
  const aiRecommendation = getAIStudyRecommendation(todayMinutes / 60, streak, subjects);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background - Futuristic City */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `
            url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80'),
            linear-gradient(135deg, #0c1445 0%, #1a1a3e 50%, #2d1b4e 100%)
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900/85 via-indigo-900/75 to-purple-900/85" />
      
      {/* Decorative Orbs - contained within viewport */}
      <div className="fixed -top-20 -right-20 w-80 h-80 md:w-[400px] md:h-[400px] bg-cyan-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed -bottom-20 -left-20 w-72 h-72 md:w-[350px] md:h-[350px] bg-purple-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed top-1/2 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark w-full">
        <div className="max-w-6xl mx-auto px-4 py-4 w-full">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white text-shadow">StudyFlow</h1>
                <p className="text-purple-200 text-sm font-medium">Welcome, {user?.name || user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 btn-glass rounded-xl text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 w-full">
            {[
              { icon: Clock, label: 'Today', value: `${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m` },
              { icon: Calendar, label: 'This Week', value: `${Math.floor(weekMinutes / 60)}h ${weekMinutes % 60}m` },
              { icon: Flame, label: 'Streak', value: `${streak} days` },
              { icon: TrendingUp, label: 'Sessions', value: sessions.length.toString() },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 text-purple-200 mb-1">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white text-shadow">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* AI Coach */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="glass rounded-2xl p-5 border-l-4 border-amber-400">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-amber-300 text-sm uppercase tracking-wider mb-1">AI Study Coach</p>
              <p className="text-white font-medium leading-relaxed">{aiRecommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notificationPermission === 'default' && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-300" />
              <p className="text-white font-medium">Enable notifications for reminders and break alerts</p>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="btn-solid px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
            >
              Enable Notifications
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'timer', label: 'Timer', icon: Clock },
            { id: 'sessions', label: 'Sessions', icon: BookOpen },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'reminders', label: 'Reminders', icon: Bell },
            { id: 'tips', label: 'Study Tips', icon: Lightbulb },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'glass text-white hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div className="glass-card rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white text-shadow mb-6">Study Timer</h2>
            
            {!isTimerRunning && timerSeconds === 0 && (
              <div className="mb-8">
                <label className="block text-sm text-white/80 mb-3 font-semibold">What are you studying?</label>
                <input
                  type="text"
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  placeholder="e.g., Mathematics, History, Programming..."
                  className="w-full max-w-md mx-auto px-5 py-4 input-glass rounded-xl text-center text-lg"
                />
              </div>
            )}

            <div className="text-6xl md:text-8xl font-mono font-bold text-white text-shadow-lg mb-8 tracking-tight">
              {formatTime(timerSeconds)}
            </div>

            {currentSubject && (
              <p className="text-purple-200 mb-8 text-lg font-medium">
                📚 Studying: <span className="text-white">{currentSubject}</span>
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-4">
              {!isTimerRunning ? (
                <button
                  onClick={() => setTimerRunning(true)}
                  className="flex items-center gap-3 px-10 py-5 btn-success rounded-2xl text-lg"
                >
                  <Play className="w-6 h-6" />
                  Start Studying
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setTimerRunning(false)}
                    className="flex items-center gap-3 px-8 py-5 btn-warning rounded-2xl text-lg"
                  >
                    <Pause className="w-6 h-6" />
                    Pause
                  </button>
                  <button
                    onClick={handleStopTimer}
                    className="flex items-center gap-3 px-8 py-5 btn-danger rounded-2xl text-lg"
                  >
                    <Square className="w-6 h-6" />
                    Stop & Save
                  </button>
                </>
              )}
            </div>

            <p className="text-purple-200/80 text-sm mt-8 font-medium">
              💡 You'll get a break notification every 25 minutes (Pomodoro technique)
            </p>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white text-shadow">Study Sessions</h2>
              <p className="text-purple-200 text-sm font-medium">Your recent study activity</p>
            </div>
            
            {sessions.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <p className="text-white/70 font-medium text-lg">No study sessions yet</p>
                <p className="text-white/50 text-sm mt-1">Start the timer to track your first session!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10 max-h-[500px] overflow-y-auto">
                {[...sessions].reverse().slice(0, 20).map(session => (
                  <div key={session.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-semibold text-white">{session.subject}</p>
                      <p className="text-sm text-purple-200">
                        {format(parseISO(session.date), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1.5 bg-indigo-500/30 text-indigo-200 rounded-lg font-bold text-sm">
                        {session.duration} min
                      </span>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white text-shadow">Study Goals</h2>
              <button
                onClick={() => setShowAddGoal(true)}
                className="flex items-center gap-2 px-5 py-3 btn-solid rounded-xl text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Goal
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <p className="text-white/70 font-medium text-lg">No goals set</p>
                <p className="text-white/50 text-sm mt-1">Add a goal to track your progress!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {goals.map(goal => {
                  const progress = Math.min((goal.currentHours / goal.targetHours) * 100, 100);
                  return (
                    <div key={goal.id} className="glass-card rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg">{goal.subject}</h3>
                          <p className="text-sm text-purple-200 font-medium">
                            Due: {format(parseISO(goal.deadline), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-purple-200 font-medium">{goal.currentHours}h / {goal.targetHours}h</span>
                          <span className="font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-indigo-400 to-purple-500 h-3 rounded-full transition-all shadow-lg"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {showAddGoal && (
              <AddGoalModal
                onClose={() => setShowAddGoal(false)}
                onAdd={(goal) => { addGoal(goal); setShowAddGoal(false); }}
                userId={user?.id || ''}
              />
            )}
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white text-shadow">Study Reminders</h2>
              <button
                onClick={() => setShowAddReminder(true)}
                className="flex items-center gap-2 px-5 py-3 btn-solid rounded-xl text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Reminder
              </button>
            </div>

            {notificationPermission !== 'granted' && (
              <div className="glass rounded-2xl p-4 border-l-4 border-amber-400">
                <p className="text-white font-medium">
                  ⚠️ Notifications are not enabled. Enable them to receive study reminders.
                </p>
              </div>
            )}

            {reminders.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <p className="text-white/70 font-medium text-lg">No reminders set</p>
                <p className="text-white/50 text-sm mt-1">Add a reminder to stay on track!</p>
              </div>
            ) : (
              <div className="glass-card rounded-3xl divide-y divide-white/10">
                {reminders.map(reminder => (
                  <div key={reminder.id} className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateReminder(reminder.id, { enabled: !reminder.enabled })}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative ${
                          reminder.enabled 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                            : 'bg-white/20'
                        }`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                          reminder.enabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                      <div>
                        <p className="font-semibold text-white">{reminder.title}</p>
                        <p className="text-sm text-purple-200 font-medium">
                          {reminder.time} • {reminder.days.map(d => d.slice(0, 3)).join(', ')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddReminder && (
              <AddReminderModal
                onClose={() => setShowAddReminder(false)}
                onAdd={(reminder) => { addReminder(reminder); setShowAddReminder(false); }}
                userId={user?.id || ''}
              />
            )}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-200">
                    {currentTip.category}
                  </span>
                  <h3 className="text-2xl font-bold mt-1 mb-3 text-white text-shadow">{currentTip.title}</h3>
                  <p className="text-purple-100 leading-relaxed text-lg">{currentTip.content}</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentTip(getRandomTip())}
                className="mt-6 flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white transition-colors"
              >
                Get another tip <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-white text-shadow">All Study Tips</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { category: 'focus', emoji: '🎯', color: 'from-blue-500/30 to-cyan-500/30' },
                { category: 'memory', emoji: '🧠', color: 'from-purple-500/30 to-pink-500/30' },
                { category: 'productivity', emoji: '⚡', color: 'from-amber-500/30 to-orange-500/30' },
                { category: 'wellbeing', emoji: '💚', color: 'from-green-500/30 to-emerald-500/30' },
              ].map(({ category, emoji, color }) => (
                <div key={category} className={`glass rounded-2xl p-5 bg-gradient-to-br ${color}`}>
                  <h4 className="font-bold text-white capitalize mb-3 flex items-center gap-2 text-lg">
                    {emoji} {category}
                  </h4>
                  <ul className="space-y-2">
                    {[...new Set(
                      [...Array(15)].map(() => {
                        const tip = getRandomTip();
                        return tip.category === category ? tip : null;
                      }).filter(Boolean)
                    )].slice(0, 3).map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-white/80 flex items-start gap-2 font-medium">
                        <span className="text-white/60 mt-0.5">•</span>
                        {(tip as StudyTip).title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Modal Components with Glass Theme
function AddGoalModal({ 
  onClose, 
  onAdd, 
  userId 
}: { 
  onClose: () => void; 
  onAdd: (goal: { id: string; userId: string; subject: string; targetHours: number; currentHours: number; deadline: string }) => void;
  userId: string;
}) {
  const [subject, setSubject] = useState('');
  const [targetHours, setTargetHours] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now().toString(),
      userId,
      subject,
      targetHours: parseInt(targetHours),
      currentHours: 0,
      deadline
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white text-shadow">Add Study Goal</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 input-glass rounded-xl"
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Target Hours</label>
            <input
              type="number"
              value={targetHours}
              onChange={(e) => setTargetHours(e.target.value)}
              className="w-full px-4 py-3 input-glass rounded-xl"
              placeholder="e.g., 20"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 input-glass rounded-xl"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 btn-solid rounded-xl text-lg"
          >
            Add Goal
          </button>
        </form>
      </div>
    </div>
  );
}

function AddReminderModal({ 
  onClose, 
  onAdd, 
  userId 
}: { 
  onClose: () => void; 
  onAdd: (reminder: { id: string; userId: string; title: string; time: string; days: string[]; enabled: boolean }) => void;
  userId: string;
}) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) return;
    onAdd({
      id: Date.now().toString(),
      userId,
      title,
      time,
      days: selectedDays,
      enabled: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white text-shadow">Add Reminder</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Reminder Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 input-glass rounded-xl"
              placeholder="e.g., Time to study!"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 input-glass rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-3">Days</label>
            <div className="flex flex-wrap gap-2">
              {days.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-sm capitalize font-semibold transition-all duration-300 ${
                    selectedDays.includes(day)
                      ? 'bg-white text-purple-900 shadow-lg'
                      : 'glass text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={selectedDays.length === 0}
            className="w-full py-4 btn-solid rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Reminder
          </button>
        </form>
      </div>
    </div>
  );
}
