import { useEffect, useState } from 'react';
import { Home, BookOpen, Video, MessageSquare, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getChapters } from '../api/theory';

interface Chapter {
  id: string;
  title: string;
  order: number;
}

const Sidebar = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await getChapters();
        const sorted = response.data.sort((a: Chapter, b: Chapter) => a.order - b.order);
        setChapters(sorted);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    };

    fetchChapters();
  }, []);

  const visibleChapters = chapters.slice(0, 6);
  const hasMore = chapters.length > 6;

  return (
    <aside className='w-64 bg-gray-100 text-black p-6 flex flex-col justify-between border-e'>
      <div>
        <div className='space-y-2'>
          <Link
            to='/home'
            className='flex items-center gap-3 w-full text-left bg-white/10 px-4 py-2 rounded-md hover:bg-primary/50 cursor-pointer'
          >
            <Home size={20} /> Home
          </Link>

          <div className='mt-6'>
            <h2 className='text-sm text-gray-400 uppercase mb-2'>Theory</h2>

            {visibleChapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => navigate(`/theory/${chapter.id}`)}
                className='flex items-center gap-3 w-full text-left px-4 py-1.5 text-sm hover:bg-primary/50 rounded-md cursor-pointer'
              >
                <BookOpen size={18} /> Chapter {chapter.order}
              </button>
            ))}

            {hasMore && (
              <Link
                to='/theory'
                className='px-4 py-1.5 text-sm text-gray-300 hover:underline cursor-pointer inline-block'
              >
                More…
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <button className='flex items-center gap-3 w-full text-left px-4 py-1.5 hover:bg-primary/50 rounded-md cursor-pointer'>
          <Video size={18} /> Video guide
        </button>
        <button className='flex items-center gap-3 w-full text-left px-4 py-1.5 hover:bg-primary/50 rounded-md cursor-pointer'>
          <MessageSquare size={18} /> Chat with AI
        </button>
        <button className='flex items-center gap-3 w-full text-left px-4 py-1.5 hover:bg-primary/50 rounded-md cursor-pointer'>
          <User size={18} /> Profile
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
