import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, XCircle, GraduationCap, Loader2 } from 'lucide-react';
import { startQuiz } from '@/api/quiz';

// Option card config
const QUIZ_OPTIONS = [
  {
    title: 'Self-tailored',
    description: 'Choose the chapters you would like to focus on and the desired difficulty level',
    icon: FileText,
    enabled: false,
  },
  {
    title: 'Mistake-driven',
    description: 'Quizzes are generated based on the chapters where you are weaker on',
    icon: XCircle,
    enabled: false,
  },
  {
    title: 'Exam day',
    description: 'Get a full test based on realistic test day conditions to test your readiness level',
    icon: GraduationCap,
    enabled: true,
  },
];

const QuizSimulatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (index: number) => {
    if (!QUIZ_OPTIONS[index].enabled || loading) return;

    setError(null);
    setLoading(true);
    try {
      // Adjust numberOfQuestions as needed
      const response = await startQuiz({
        type: 'random',
        chapterIds: [],
        numberOfQuestions: 30, // Change to your default/exam number
      });

      // Option 1: Pass sessionId in the route and questions in state
      navigate(`/quiz-simulator/${response.quizSessionId}`, {
        state: { questions: response.questions },
      });

      // Option 2 (if you want QuizPage to fetch questions itself):
      // navigate(`/quiz/${response.quizSessionId}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to start quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center w-full px-4 py-8'>
      {/* Cards Row */}
      <div className='flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center'>
        {QUIZ_OPTIONS.map((opt, idx) => (
          <Card
            key={opt.title}
            className={`flex-1 flex flex-col items-center p-8 rounded-2xl shadow-md 
              ${!opt.enabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl transition-shadow duration-150'}
            `}
          >
            <CardContent className='flex flex-col items-center gap-4'>
              <opt.icon size={38} className='mb-2 text-primary' />
              <div className='font-bold text-lg mb-1 text-center'>{opt.title}</div>
              <div className='mb-4 text-center text-muted-foreground'>{opt.description}</div>
              <Button
                disabled={!opt.enabled || loading}
                onClick={() => handleStart(idx)}
                variant='outline'
                className='mt-2 min-w-[150px] flex justify-center items-center'
              >
                {loading && opt.enabled ? <Loader2 className='animate-spin mr-2' size={20} /> : null}
                START SESSION
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error display */}
      {error && <div className='text-red-500 mt-4 font-medium'>{error}</div>}

      {/* Stats Card */}
      <div className='mt-10 w-full max-w-3xl'>
        <Card className='rounded-2xl'>
          <CardContent className='p-6'>
            <div className='font-medium mb-3'>Weekly exam practice stats</div>
            <div className='h-32 flex items-end'>
              {/* Placeholder for your stats chart */}
              <svg width='100%' height='100%' viewBox='0 0 320 80'>
                <polyline
                  fill='none'
                  stroke='#14b8a6'
                  strokeWidth='4'
                  points='0,70 40,60 80,40 120,50 160,30 200,55 240,45 280,65 320,60'
                />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizSimulatorPage;
