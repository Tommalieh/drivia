// src/navigation/menuConfig.ts
import { Home, BookOpen, Waypoints, BookOpenCheck, Bot } from 'lucide-react';

export interface SubMenuItem {
  label: string;
  path: string;
}

export interface MainMenuItem {
  label: string;
  path: string; // Main route (for active check)
  icon: React.ReactNode;
  subMenus?: SubMenuItem[];
}

export const menuList: MainMenuItem[] = [
  {
    label: 'Home',
    path: '/home',
    icon: <Home size={20} />,
    subMenus: [{ label: 'Dashboard', path: '/home' }],
  },
  {
    label: 'Theory',
    path: '/theory',
    icon: <BookOpen size={20} />,
    subMenus: [{ label: 'All Chapters', path: '/theory' }],
  },
  {
    label: 'Planner',
    path: '/planner',
    icon: <Waypoints size={20} />,
    subMenus: [
      { label: 'My Plan', path: '/planner' },
      { label: 'Progress', path: '/planner/progress' },
    ],
  },
  {
    label: 'Quiz Simulator',
    path: '/quiz-simulator',
    icon: <BookOpenCheck size={20} />,
    subMenus: [
      { label: 'Simulator', path: '/quiz-simulator' },
      { label: 'Results', path: '/quiz-simulator/quiz-results' },
    ],
  },
  {
    label: 'My Tutor',
    path: '/my-tutor',
    icon: <Bot size={20} />,
  },
];
