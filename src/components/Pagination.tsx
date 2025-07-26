import React, { useEffect } from 'react';

interface PaginationProps {
  total: number;
  current: number; // 1-based index
  onChange: (page: number) => void;
  finishTitle?: string;
  finishColor?: string;
  onFinish: () => void;
}

const generatePagination = (total: number, current: number): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (total <= 10) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (current > 4) pages.push('...');

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 3);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) pages.push('...');
  pages.push(total);

  return pages;
};

const Pagination: React.FC<PaginationProps> = ({
  total,
  current,
  onChange,
  finishColor = 'green',
  finishTitle = 'Finish',
  onFinish,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && current < total) {
        onChange(current + 1);
      } else if (e.key === 'ArrowLeft' && current > 1) {
        onChange(current - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, total, onChange]);

  const pages = generatePagination(total, current);

  return (
    <div className='flex justify-between items-center gap-2 mt-6 flex-wrap'>
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className={`px-3 py-1 rounded-md transition ${
          current === 1
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-secondary/75 text-white hover:bg-secondary cursor-pointer'
        }`}
      >
        Back
      </button>

      <div className='flex items-center justify-center gap-x-2'>
        {pages.map((page, i) =>
          typeof page === 'number' ? (
            <button
              key={i}
              onClick={() => onChange(page)}
              className={`px-3 py-1 rounded-md cursor-pointer transition ${
                current === page
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={i} className='px-2 text-gray-400 select-none'>
              ...
            </span>
          )
        )}
      </div>
      {current < total ? (
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === total}
          className={`px-3 py-1 rounded-md transition ${
            current === total
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-primary/90 text-white hover:bg-primary cursor-pointer'
          }`}
        >
          Next
        </button>
      ) : (
        <button
          onClick={onFinish}
          className={`px-3 py-1 rounded-md bg-${finishColor}-600 text-white hover:bg-${finishColor}-700 cursor-pointer transition`}
        >
          {finishTitle}
        </button>
      )}
    </div>
  );
};

export default Pagination;
