import { ClipboardList, XCircle, Bot } from 'lucide-react';

const options = [
  { label: 'Self-tailored exam', icon: <ClipboardList size={20} /> },
  { label: 'Mistake-driven exam', icon: <XCircle size={20} /> },
  { label: 'Exam day exam', icon: <Bot size={20} /> },
];

const ExamOptions = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {options.map((opt) => (
        <button
          key={opt.label}
          className='flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-xl shadow hover:bg-gray-100 transition'
        >
          {opt.icon}
          <span className='font-medium'>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ExamOptions;
