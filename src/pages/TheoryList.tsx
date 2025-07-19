import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChapters } from '../api/theory';

interface ChapterSummary {
  id: string;
  title: string;
  summary: string;
  order: number;
}

const TheoryList: React.FC = () => {
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);

  useEffect(() => {
    getChapters()
      .then((response) => {
        setChapters(response.data);
      })
      .catch((err) => {
        console.error('Failed to fetch chapters:', err);
      });
  }, []);

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-6 text-gray-700'>Theory Chapters</h2>
      <ul className='space-y-3'>
        {chapters.map((chap) => (
          <li key={chap.id}>
            <Link
              to={`/theory/${chap.id}`}
              className='flex items-center gap-3 bg-white hover:bg-gray-100 transition px-4 py-3 rounded-lg shadow-sm'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-gray-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 2l9 4.5v13L12 22l-9-2.5v-13L12 2z'
                />
              </svg>
              <div>
                <p className='text-gray-700 font-medium'>{chap.title}</p>
                <p className='text-sm text-gray-500'>{chap.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TheoryList;
