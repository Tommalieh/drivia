import { useEffect, useState } from 'react';
import { getProgressSummary, ProgressSummary } from '../api/progress';
import { Flame, ArrowRight } from 'lucide-react';
import ChapterPerformance from '@/components/ChapterPerformance';
import ReadinessBar from '@/components/ReadinessBar';
import { Card, CardContent } from '@/components/ui/card';

// Helper for ring
function RingStat({ value, label, text }: { value: number; label: string; text: string }) {
  // value: 0-100
  return (
    <div className='flex flex-col items-center mx-3'>
      <svg width='80' height='80'>
        <circle cx='40' cy='40' r='34' stroke='#e5e7eb' strokeWidth='8' fill='none' />
        <circle
          cx='40'
          cy='40'
          r='34'
          stroke='#22c55e'
          strokeWidth='8'
          fill='none'
          strokeDasharray={2 * Math.PI * 34}
          strokeDashoffset={2 * Math.PI * 34 * (1 - value / 100)}
          strokeLinecap='round'
        />
        <text x='50%' y='50%' textAnchor='middle' dy='.3em' className='font-bold text-xl fill-green-600'>
          {text}
        </text>
      </svg>
      <span className='mt-2 text-gray-700 font-semibold'>{label}</span>
    </div>
  );
}

const Home = () => {
  const [summary, setSummary] = useState<null | ProgressSummary>(null);
  const [loading, setLoading] = useState(true);

  // Mock daily plan tasks (replace with backend data if you have)
  const dailyPlan = ['Complete 30% Theory Chapter 1', 'Review danger signs', 'Do 20 quizzes on danger signs'];

  // Fallback for quiz level and theory percent (mock, replace with your backend)
  const quizLevel = 5;
  const theoryPercent = summary ? Math.round(summary.readinessScore) : 90;
  const daysLeft = 20; // Replace with real value if you have a target date

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
    <main className='flex-1 px-4 md:px-10 pt-6 mx-auto'>
      {/* Top status + plan row */}
      <div className='grid md:grid-cols-2 gap-10'>
        {/* Daily plan */}
        <Card>
          <CardContent>
            <h2 className='text-xl text-start font-bold mb-8'>Daily Plan</h2>
            <ul className='space-y-3'>
              {dailyPlan.map((item, i) => (
                <li key={i} className='flex items-center gap-3'>
                  <span className='w-6 h-6 rounded-full border-2 border-green-300 flex items-center justify-center'>
                    <span className='block w-3 h-3 rounded-full bg-green-200'></span>
                  </span>
                  <span className='text-gray-700'>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* Status */}
        <Card>
          <CardContent>
            <h2 className='text-xl text-center font-bold mb-8'>Current Status</h2>
            <div className='flex gap-10 items-center justify-around'>
              {/* Theory ring */}
              <RingStat value={theoryPercent} label='Theory' text={theoryPercent + '%'} />
              {/* Quiz level ring */}
              <RingStat
                value={Math.min(quizLevel * 18, 100)} // e.g. Level 5 => 90%
                label='Quiz'
                text={'L. ' + quizLevel}
              />
              {/* Days left */}
              <div className='flex flex-col items-center mx-3'>
                <div className='flex items-center mb-1'>
                  <Flame className='text-orange-500' size={30} />
                  <span className='text-3xl font-bold ml-1'>{daysLeft}</span>
                </div>
                <span className='text-gray-700 font-semibold'>Days left</span>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* CTA row */}
      <div className='mt-10 grid grid-cols-1 md:grid-cols-3 gap-6'>
        <a
          href='/theory'
          className='flex items-center justify-between bg-white rounded-xl p-6 border hover:bg-gray-50 transition shadow group'
        >
          <span className='text-lg font-semibold'>Continue theory</span>
          <ArrowRight size={28} className='text-primary opacity-80 group-hover:translate-x-2 transition' />
        </a>
        <a
          href='/quiz-simulator'
          className='flex items-center justify-between bg-white rounded-xl p-6 border hover:bg-gray-50 transition shadow group'
        >
          <span className='text-lg font-semibold'>Go to quizzes</span>
          <ArrowRight size={28} className='text-primary opacity-80 group-hover:translate-x-2 transition' />
        </a>
        <a
          href='/chat-with-tutor'
          className='flex items-center justify-between bg-white rounded-xl p-6 border hover:bg-gray-50 transition shadow group'
        >
          <span className='text-lg font-semibold'>Ask a tutor</span>
          <ArrowRight size={28} className='text-primary opacity-80 group-hover:translate-x-2 transition' />
        </a>
      </div>
    </main>
  );
};

export default Home;
