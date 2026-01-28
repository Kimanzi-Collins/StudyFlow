import type { StudyTip } from '../types';

export const studyTips: StudyTip[] = [
  {
    id: '1',
    title: 'The Pomodoro Technique',
    content: 'Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break. This helps maintain focus and prevents burnout.',
    category: 'productivity'
  },
  {
    id: '2',
    title: 'Active Recall',
    content: 'Instead of re-reading notes, test yourself on the material. Try to recall information from memory before checking your notes. This strengthens neural pathways.',
    category: 'memory'
  },
  {
    id: '3',
    title: 'Spaced Repetition',
    content: 'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks. This leverages how your brain naturally consolidates memories.',
    category: 'memory'
  },
  {
    id: '4',
    title: 'Eliminate Distractions',
    content: 'Put your phone in another room, use website blockers, and find a quiet study space. Even small distractions can reduce learning efficiency by up to 40%.',
    category: 'focus'
  },
  {
    id: '5',
    title: 'Teach What You Learn',
    content: 'Explaining concepts to others (or even a rubber duck) helps identify gaps in your understanding and reinforces your knowledge.',
    category: 'memory'
  },
  {
    id: '6',
    title: 'Get Enough Sleep',
    content: 'Sleep is crucial for memory consolidation. Aim for 7-9 hours per night, especially before exams. Pulling all-nighters is counterproductive.',
    category: 'wellbeing'
  },
  {
    id: '7',
    title: 'Stay Hydrated',
    content: 'Dehydration can impair cognitive function. Keep a water bottle at your study desk and drink regularly throughout your study session.',
    category: 'wellbeing'
  },
  {
    id: '8',
    title: 'Create a Study Schedule',
    content: 'Plan your study sessions in advance. Treat them like important appointments. Consistency builds habits and reduces procrastination.',
    category: 'productivity'
  },
  {
    id: '9',
    title: 'Use Visual Aids',
    content: 'Mind maps, diagrams, and color-coded notes can help you understand and remember complex information better than plain text.',
    category: 'memory'
  },
  {
    id: '10',
    title: 'Take Short Walks',
    content: 'A 10-15 minute walk between study sessions can boost creativity and help consolidate what you\'ve learned.',
    category: 'wellbeing'
  },
  {
    id: '11',
    title: 'Study in Chunks',
    content: 'Break large topics into smaller, manageable chunks. Master one chunk before moving to the next. This prevents overwhelm.',
    category: 'productivity'
  },
  {
    id: '12',
    title: 'Use Background Music Wisely',
    content: 'Instrumental music or ambient sounds can help some people focus. Avoid lyrics as they compete for your brain\'s language processing.',
    category: 'focus'
  },
  {
    id: '13',
    title: 'Practice Under Test Conditions',
    content: 'Simulate exam conditions during practice. Time yourself, work without notes, and create a quiet environment. This reduces test anxiety.',
    category: 'productivity'
  },
  {
    id: '14',
    title: 'Connect New to Old',
    content: 'Link new information to concepts you already know. Building on existing knowledge creates stronger, more accessible memories.',
    category: 'memory'
  },
  {
    id: '15',
    title: 'Start with the Hardest Task',
    content: 'Tackle difficult subjects when your mental energy is highest, usually in the morning. Save easier tasks for when you\'re tired.',
    category: 'focus'
  }
];

export function getRandomTip(): StudyTip {
  return studyTips[Math.floor(Math.random() * studyTips.length)];
}

export function getTipsByCategory(category: StudyTip['category']): StudyTip[] {
  return studyTips.filter(tip => tip.category === category);
}

export function getAIStudyRecommendation(
  totalHoursToday: number,
  currentStreak: number,
  subjects: string[]
): string {
  if (totalHoursToday === 0) {
    return "You haven't studied yet today. Start with a short 25-minute session to build momentum!";
  }
  
  if (totalHoursToday > 4) {
    return "You've been studying hard today! Consider taking a longer break to let your brain consolidate the information.";
  }
  
  if (currentStreak >= 7) {
    return `Amazing! You're on a ${currentStreak}-day streak! Keep the momentum going, but remember to schedule rest days.`;
  }
  
  if (subjects.length === 1) {
    return "Try mixing in a different subject to give your brain variety. Interleaving different topics can improve long-term retention.";
  }
  
  return "You're making great progress! Remember to take short breaks between study sessions for optimal learning.";
}
