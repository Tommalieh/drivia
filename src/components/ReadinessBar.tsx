import React from 'react';

interface ReadinessBarProps {
  score: number; // from 0 to 1
}

const ReadinessBar: React.FC<ReadinessBarProps> = ({ score }) => {
  return (
    <div className='bg-white p-6 rounded-xl shadow'>
      <p className='text-gray-700 font-semibold mb-1'>Your readiness score</p>
      <p className='text-sm text-gray-400 mb-3'>This score reflects your performance across topics</p>
      <div className='w-full bg-primary-muted h-4 rounded-full overflow-hidden'>
        <div className='h-full bg-primary' style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
};

export default ReadinessBar;
