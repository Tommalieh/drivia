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
      .then((response) => setChapter(response.data))
      .catch((err) => {
        console.error('Failed to fetch chapter:', err);
        navigate('/theory');
      });
  }, [chapterId, navigate]);

  useEffect(() => {
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
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-sm font-medium text-secondary/70 hover:text-secondary transition mb-4 cursor-pointer'
      >
        ← Back
      </button>

      {/* Header */}
      <header className='mb-6'>
        <h2 className='text-2xl font-bold text-tertiary mb-1'>{chapter.title}</h2>
        <p className='text-gray-500'>{chapter.summary}</p>
      </header>

      {/* Content Grid */}
      <div className='grid grid-cols-1 md:grid-cols-[2fr_4fr] gap-6 mb-6'>
        {/* Image block */}
        <div className='h-96 w-full rounded-lg overflow-hidden shadow-lg border-2 border-tertiary/50 bg-tertiary/5 flex items-center justify-center'>
          {imageUrl ? (
            <img src={imageUrl} alt={`Section ${currentIndex + 1}`} className='w-full h-full object-cover rounded-lg' />
          ) : (
            <div className='text-gray-400'>No image</div>
          )}
        </div>

        {/* Text block */}
        <div className='bg-white p-6 rounded-lg shadow-lg h-96 overflow-y-auto border-l-4 border-tertiary/60'>
          <h3 className='text-xl font-semibold mb-2 text-tertiary'>{title}</h3>
          <p className='text-gray-700 whitespace-pre-line'>{text}</p>
        </div>
      </div>

      {/* Pagination (Buttons use green/pink/blue) */}
      <div className='mb-8'>
        <Pagination total={sections.length} current={currentIndex + 1} onChange={handleNext} onFinish={handleFinish} />
      </div>

      {/* Ask AI Block */}
      <div className='bg-white p-6 rounded-lg shadow-lg mt-6 border-l-4 border-tertiary/60'>
        <h4 className='text-lg font-semibold mb-2 text-tertiary'>Ask AI for Help</h4>
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
