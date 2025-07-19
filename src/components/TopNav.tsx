// src/components/TopNav.tsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const tabs = [
  { label: 'Home', path: '/home' },
  { label: 'Theory', path: '/theory' },
  { label: 'Planner', path: '/planner' },
  { label: 'Quiz simulator', path: '/quiz-simulator' },
  { label: 'Results', path: '/results' },
];

const TopNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className='flex gap-8 font-medium text-gray-600 z-10'>
      <h1 className='text-2xl font-bold italic'>drivia</h1>

      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <Link
            to={tab.path}
            key={tab.label}
            className={`pb-1 ${
              isActive ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-gray-800'
            } transition cursor-pointer`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default TopNav;
