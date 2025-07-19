import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, ChevronLeft, ChevronRight, SkipForward, Loader2, AlertCircle } from 'lucide-react';
import { submitQuiz, QuizQuestion } from '@/api/quiz';
import QuizProgressBar from '@/components/QuizProgressBar';
import QuizTimer from '@/components/QuizTimer';

function useLocationState<T>() {
  const location = useLocation();
  return (location.state as T) || null;
}

type QuestionWithLocal = QuizQuestion & {
  flagged?: boolean;
  skipped?: boolean;
};

// const QUIZ_LENGTH = 40;
const QUIZ_TIME_SEC = 60 * 30;

const QuizPage: React.FC = () => {
  const { quizSessionId } = useParams<{ quizSessionId: string }>();
  const locationState = useLocationState<{ questions: QuizQuestion[] }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuestionWithLocal[]>([]);
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(QUIZ_TIME_SEC);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUnansweredMsg, setShowUnansweredMsg] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // On mount: load questions from location state
  useEffect(() => {
    if (locationState?.questions && locationState.questions.length > 0) {
      setQuestions(locationState.questions.map((q) => ({ ...q })));
    } else {
      setError('Quiz data missing. Please start the quiz from the simulator.');
    }
  }, [locationState]);

  // Timer effect
  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleFinish(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line
  }, [submitted]);

  // Core handlers
  const handleAnswer = (val: boolean) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[current].userAnswer = val;
      updated[current].skipped = false;
      return updated;
    });
  };

  const handleFlag = () => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[current].flagged = !updated[current].flagged;
      return updated;
    });
  };

  const handleSkip = () => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[current].skipped = true;
      updated[current].userAnswer = null;
      return updated;
    });
    handleNext();
  };

  const handlePrev = () => setCurrent((i) => Math.max(i - 1, 0));
  const handleNext = () => setCurrent((i) => Math.min(i + 1, questions.length - 1));

  // Enhanced: Don't finish unless all questions are answered
  const unansweredIndices = questions
    .map((q, idx) => (typeof q.userAnswer !== 'boolean' ? idx : null))
    .filter((idx) => idx !== null) as number[];
  const numUnanswered = unansweredIndices.length;

  const handleFinish = async (force = false) => {
    if (submitting || submitted || !quizSessionId) return;
    if (numUnanswered > 0 && !force) {
      setShowUnansweredMsg(true);
      setTimeout(() => setShowUnansweredMsg(false), 2500);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const answers = questions
        .filter((q) => typeof q.userAnswer === 'boolean')
        .map((q) => ({
          questionId: q.questionId,
          userAnswer: q.userAnswer as boolean,
        }));

      const response = await submitQuiz({
        quizSessionId,
        answers,
      });

      setResult(response.data);
      setSubmitted(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  // If quiz is finished, show summary
  if (submitted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-muted py-10'>
        <Card className='w-full max-w-4xl p-8 flex flex-col gap-4 items-center'>
          <div className='text-2xl font-bold mb-4'>Quiz Complete!</div>
          <div className='mb-2'>
            <span className='font-medium'>
              You answered {result?.correctAnswers ?? '--'} out of {questions.length} questions correctly.
            </span>
          </div>
          <Button onClick={() => navigate('/results')}>View Results</Button>
          <Button variant='outline' className='mt-2' onClick={() => navigate('/quiz-simulator')}>
            Back to Quiz Simulator
          </Button>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-muted py-10'>
        <Card className='w-full max-w-4xl p-8 flex flex-col gap-4 items-center'>
          <div className='text-lg font-semibold text-red-500'>{error}</div>
          <Button onClick={() => navigate('/quiz-simulator')}>Back to Quiz Simulator</Button>
        </Card>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-muted py-10'>
        <Loader2 className='animate-spin' size={48} />
      </div>
    );
  }

  const q = questions[current];
  const answeredCount = questions.filter((q) => typeof q.userAnswer === 'boolean').length;

  // --- NEW: Sidebar for questions navigation ---
  const QuestionNav = (
    <div className='flex flex-col items-center w-16 md:w-20 max-h-[600px] overflow-y-auto border-l bg-background py-4 px-1 gap-2 rounded-r-xl shadow'>
      {questions.map((question, idx) => {
        let bg = 'bg-muted';
        let border = '';
        let tooltip = '';
        if (typeof question.userAnswer === 'boolean') {
          bg = 'bg-blue-100';
          border = 'border-blue-500';
          tooltip = 'Answered';
        } else if (question.flagged) {
          bg = 'bg-yellow-100';
          border = 'border-yellow-500';
          tooltip = 'Flagged';
        } else if (question.skipped) {
          bg = 'bg-orange-100';
          border = 'border-orange-500';
          tooltip = 'Skipped';
        } else {
          bg = 'bg-gray-200';
          border = 'border-gray-400';
          tooltip = 'Unanswered';
        }
        if (idx === current) border = 'border-1 border-primary';
        return (
          <button
            key={idx}
            className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm mb-1 transition 
              ${bg} ${border} 
              hover:bg-primary hover:text-white
              ${idx === current ? 'ring ring-primary' : ''}
            `}
            title={tooltip}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className='flex flex-row items-start justify-center min-h-screen bg-muted py-10'>
      {/* Main Content */}
      <div className='flex flex-col items-center flex-1'>
        <div className='w-full max-w-4xl flex justify-between items-center mb-6'>
          <QuizProgressBar current={current + 1} total={questions.length} />
          <QuizTimer seconds={timer} />
        </div>
        <Card className='w-full max-w-4xl p-6 flex flex-col gap-4'>
          <div className='flex justify-between items-center mb-2'>
            <span className='font-semibold'>
              Q{current + 1} <span className='text-xs font-normal text-gray-500 ml-1'>{q.groupTitle}</span>
            </span>
            <button
              onClick={handleFlag}
              className={`ml-2 p-2 rounded hover:bg-accent transition-colors ${
                q.flagged ? 'text-yellow-500' : 'text-muted-foreground'
              }`}
              aria-label='Flag for review'
            >
              <Flag size={20} fill={q.flagged ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div>
            <div className='text-lg font-medium mb-2'>{q.text}</div>
            {q.imageUrl && (
              <img
                src={q.imageUrl}
                alt='question visual'
                className='w-full max-h-56 object-contain rounded-xl border mb-2'
              />
            )}
          </div>
          <div className='flex gap-4 mb-2'>
            <Button
              size='lg'
              variant={q.userAnswer === true ? 'default' : 'outline'}
              className='flex-1 text-xl py-6'
              onClick={() => handleAnswer(true)}
            >
              True
            </Button>
            <Button
              size='lg'
              variant={q.userAnswer === false ? 'default' : 'outline'}
              className='flex-1 text-xl py-6'
              onClick={() => handleAnswer(false)}
            >
              False
            </Button>
          </div>
          <Button variant='outline' className='w-full' onClick={handleSkip} type='button'>
            <SkipForward size={16} className='mr-2' />
            Skip
          </Button>
          <div className='flex justify-between items-center mt-4'>
            <Button variant='secondary' onClick={handlePrev} disabled={current === 0} type='button'>
              <ChevronLeft size={18} className='mr-2' />
              Previous
            </Button>
            {/* Finish button logic: disabled if unanswered */}
            <div className='relative'>
              <Button
                onClick={() => {
                  if (numUnanswered > 0) {
                    setShowUnansweredMsg(true);
                    setTimeout(() => setShowUnansweredMsg(false), 2500);
                  } else {
                    handleFinish();
                  }
                }}
                disabled={submitting}
                type='button'
                // 👇 Use "default" for green, "outline" for gray, based on numUnanswered
                variant={numUnanswered > 0 ? 'outline' : 'default'}
                className={numUnanswered === 0 ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              >
                {submitting ? <Loader2 className='animate-spin mr-2' size={18} /> : null}
                Finish
              </Button>
              {showUnansweredMsg && (
                <div className='absolute right-0 mt-2 w-max bg-yellow-100 border border-yellow-400 text-yellow-800 rounded px-3 py-2 text-sm flex items-center shadow z-50'>
                  <AlertCircle size={18} className='mr-1' />
                  You have <b className='mx-1'>{numUnanswered}</b> unanswered question{numUnanswered > 1 ? 's' : ''}.
                </div>
              )}
            </div>
            <Button onClick={handleNext} type='button' disabled={current === questions.length - 1}>
              Next
              <ChevronRight size={18} className='ml-2' />
            </Button>
          </div>
        </Card>
        <div className='text-gray-500 text-sm mt-2'>
          Answered {answeredCount} / {questions.length}
          {' | '}
          Flagged: {questions.filter((q) => q.flagged).length}
          {' | '}
          Skipped: {questions.filter((q) => q.skipped).length}
        </div>
      </div>
      {/* --- Sidebar --- */}
      <div className='ml-4 hidden md:block'>{QuestionNav}</div>
    </div>
  );
};

export default QuizPage;
