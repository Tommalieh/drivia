import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50'>
      <div className='h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
    </div>
  );
};

export default Spinner;
