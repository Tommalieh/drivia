import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

// Mock data for demonstration
const resultsData = {
  weekly: [
    { week: 'Week 1', correctPercentage: 82 },
    { week: 'Week 2', correctPercentage: 85 },
    { week: 'Week 3', correctPercentage: 89 },
    { week: 'Week 4', correctPercentage: 88 },
    { week: 'Week 5', correctPercentage: 87 },
    { week: 'Week 6', correctPercentage: 90 },
    { week: 'Week 7', correctPercentage: 85 },
    { week: 'Week 8', correctPercentage: 92 },
    { week: 'Week 9', correctPercentage: 89 },
    { week: 'Week 10', correctPercentage: 91 },
  ],
  strengths: [
    { chapter: 'Chapter 2', rate: 1.0 },
    { chapter: 'Chapter 5', rate: 0.95 },
    { chapter: 'Chapter 22', rate: 0.92 },
    { chapter: 'Chapter 16', rate: 0.89 },
  ],
  weaknesses: [
    { chapter: 'Chapter 13', rate: 0.35 },
    { chapter: 'Chapter 17', rate: 0.45 },
    { chapter: 'Chapter 21', rate: 0.38 },
    { chapter: 'Chapter 25', rate: 0.41 },
  ],
};

const QuizResults: React.FC = () => {
  return (
    <div className='w-full flex flex-col items-center p-8'>
      {/* Weekly correct % bar chart */}
      <Card className='w-full mb-8 p-6'>
        <CardContent>
          <h2 className='font-bold text-xl mb-8'>% Correct Answers in Quizzes</h2>
          <div className='flex gap-3 items-end h-40'>
            {resultsData.weekly.map((w, idx) => (
              <div key={w.week + idx} className='flex flex-col items-center'>
                <div className='relative flex flex-col-reverse h-32 w-6'>
                  <div
                    className='rounded-t-md bg-primary'
                    style={{
                      height: `${w.correctPercentage * 0.95}%`,
                      transition: 'height 0.4s',
                    }}
                  />
                  <div
                    className='w-full bg-primary/10 rounded-t-md'
                    style={{ height: `${100 - w.correctPercentage * 0.95}%` }}
                  />
                  <span className='absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-gray-700 font-semibold'>
                    {w.correctPercentage}%
                  </span>
                </div>
                <div className='mt-2 text-xs text-gray-500'>{w.week}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-8'>
        {/* Strengths */}
        <Card>
          <CardContent>
            <h3 className='font-bold text-lg mb-4'>Where You're Strong</h3>
            {resultsData.strengths.map((item) => (
              <div key={item.chapter} className='flex items-center gap-3 mb-3'>
                <span className='w-36 font-medium'>{item.chapter}</span>
                <div className='flex-1 h-4 bg-primary/10 rounded-full overflow-hidden'>
                  <div
                    className='h-4 bg-primary transition-all duration-300'
                    style={{ width: `${item.rate * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Weaknesses */}
        <Card>
          <CardContent>
            <h3 className='font-bold text-lg mb-4'>Where You Need to Improve</h3>
            {resultsData.weaknesses.map((item) => (
              <div key={item.chapter} className='flex items-center gap-3 mb-3'>
                <span className='w-36 font-medium'>{item.chapter}</span>
                <div className='flex-1 h-4 bg-secondary/10 rounded-full overflow-hidden'>
                  <div
                    className='h-4 bg-secondary transition-all duration-300'
                    style={{ width: `${item.rate * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* CTA for targeted practice */}
      <div className='flex flex-col md:flex-row items-center w-full bg-white rounded-2xl p-6 mt-4 shadow'>
        <div className='flex-1'>
          <div className='font-bold text-lg mb-1'>Practice on Weak Areas</div>
          <div className='text-gray-500'>Focus your practice on areas you need to improve</div>
        </div>
        <a
          href='/quiz-simulator'
          className='flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full mt-4 md:mt-0 font-semibold shadow hover:bg-primary/80 transition'
        >
          Go to Targeted Quizzes
          <ArrowRight size={22} />
        </a>
      </div>
    </div>
  );
};

export default QuizResults;
