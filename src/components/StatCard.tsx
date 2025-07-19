import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className='bg-white p-6 rounded-xl shadow text-center'>
      <div className='text-3xl font-bold text-tertiary'>{value}</div>
      <p className='text-gray-600 mt-1'>{title}</p>
    </div>
  );
};

export default StatCard;
