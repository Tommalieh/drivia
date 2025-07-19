import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChapterById } from '../api/theory';
import Pagination from '../components/Pagination';
import { postSectionProgress } from '../api/progress';

interface Section {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  order: number;
}

interface ChapterDetail {
  id: string;
  title: string;
  content: string;
  summary: string;
  notes: string;
  sections: Section[];
}

const ChapterPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sections = useMemo(() => (chapter && chapter.sections.sort((a, b) => a.order - b.order)) || [], [chapter]);

  useEffect(() => {
    if (!chapterId) {
      navigate('/theory');
      return;
    }

    getChapterById(chapterId)
      .then((response) => {
        setChapter(response.data);
      })
      .catch((err) => {
        console.error('Failed to fetch chapter:', err);
        navigate('/theory');
      });
  }, [chapterId, navigate]);

  useEffect(() => {
    console.log('chapter', chapter);

    if (chapter && chapter.id && sections[currentIndex]) {
      postSectionProgress({
        sectionId: sections[currentIndex].id,
        isCompleted: false,
      }).catch(console.error);
    }
  }, [currentIndex, chapter, sections]);

  if (!chapter) {
    return <div className='p-6'>Loading…</div>;
  }

  const handleNext = (pageNumber: number) => {
    postSectionProgress({
      sectionId: sections[currentIndex].id,
      isCompleted: true,
    }).catch(console.error);

    setCurrentIndex(pageNumber - 1);
  };

  const handleFinish = () => {
    postSectionProgress({
      sectionId: sections[currentIndex].id,
      isCompleted: true,
    }).catch(console.error);

    navigate('/theory');
  };

  const { title, text, imageUrl } = sections[currentIndex];

  return (
    <div className='p-6 max-w-screen-xl mx-auto'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4 cursor-pointer'
      >
        ← Back
      </button>

      <header className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>{chapter.title}</h2>
        <p className='text-gray-500'>{chapter.summary}</p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-[2fr_4fr] gap-6 mb-6'>
        {/* Image block */}
        <div className='w-full rounded-lg overflow-hidden shadow'>
          <img src={imageUrl} alt={`Section ${currentIndex + 1}`} className='w-full h-full object-cover rounded-lg' />
        </div>

        {/* Text block */}
        <div className='bg-white p-4 rounded-lg shadow h-96 overflow-y-auto'>
          <h3 className='text-xl font-semibold mb-2'>{title}</h3>
          <p className='text-gray-700 whitespace-pre-line'>{text}</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <Pagination
        total={sections.length}
        current={currentIndex + 1}
        onChange={(page) => handleNext(page)}
        onFinish={handleFinish}
      />

      {/* Chat block */}
      <div className='bg-white p-6 rounded-lg shadow-lg mt-6'>
        <h4 className='text-lg font-semibold mb-2'>Ask AI for Help</h4>
        <p className='text-sm text-gray-600 mb-2'>Coming soon: interact with AI about this topic…</p>
        <input
          disabled
          placeholder='Ask something about this section…'
          className='w-full border border-gray-300 p-3 rounded-md bg-gray-100 text-gray-500'
        />
      </div>
    </div>
  );
};

export default ChapterPage;
