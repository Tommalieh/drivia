import React from 'react';

interface ChapterPerformanceProps {
  title: string;
  chapters: { chapterId: string; title: string; completionRate: number }[];
  color: 'primary' | 'secondary';
}

const ChapterPerformance: React.FC<ChapterPerformanceProps> = ({ title, chapters, color }) => {
  const colorClass = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  }[color];

  const bgClass = {
    primary: 'bg-primary-muted',
    secondary: 'bg-secondary-muted',
  }[color];

  return (
    <div className='bg-white p-6 rounded-xl shadow'>
      <h3 className='text-gray-700 font-semibold mb-4'>{title}</h3>
      <ul className='space-y-3'>
        {chapters.map(({ title, completionRate }) => (
          <li key={title}>
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>{title}</span>
            </div>
            <div className={`w-full h-3 ${bgClass} rounded-full overflow-hidden`}>
              <div className={`${colorClass} h-full`} style={{ width: `${completionRate}%` }}></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterPerformance;
