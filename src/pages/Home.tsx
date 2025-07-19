import StatCard from '../components/StatCard';
import ReadinessBar from '../components/ReadinessBar';
import ChapterPerformance from '../components/ChapterPerformance';
import ExamOptions from '../components/ExamOptions';
import { useEffect, useState } from 'react';
import { getProgressSummary, ProgressSummary } from '../api/progress';

const Home = () => {
  const [summary, setSummary] = useState<null | ProgressSummary>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgressSummary()
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch progress summary:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !summary) return <div className='p-6'>Loading dashboard...</div>;

  return (
    <main className='flex-1 p-6 overflow-y-auto'>
      {/* Stats row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
        <StatCard title='Days until the exam day' value={20} />
        <StatCard title='Quizzes done' value={76} />
        <StatCard title='Exams done' value={6} />
      </div>

      {/* Readiness score */}
      <div className='mt-6'>
        <ReadinessBar score={summary?.readinessScore || 0} />
      </div>

      {/* Performance breakdown */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <ChapterPerformance title='Chapters you rock' chapters={summary?.chaptersYouRock || []} color='primary' />
        <ChapterPerformance
          title='Chapters to improve on'
          chapters={summary?.chaptersToImprove || []}
          color='secondary'
        />
      </div>

      {/* Exam Options */}
      <div className='mt-8'>
        <ExamOptions />
      </div>
    </main>
  );
};

export default Home;
