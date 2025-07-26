import { useRef, useState, useEffect } from 'react';
import { SendHorizonal, Sparkles, Book, Brain, ListChecks, Wand2 } from 'lucide-react';

const starterPrompts = [
  { icon: <Book size={16} className='text-blue-500' />, text: 'Summarize Chapter 1 in simple words' },
  { icon: <ListChecks size={16} className='text-green-500' />, text: 'Give me top 3 tips for the road signs quiz' },
  { icon: <Wand2 size={16} className='text-orange-500' />, text: 'Generate a mind map for intersections' },
  { icon: <Brain size={16} className='text-purple-500' />, text: 'How should I plan my study for the next 10 days?' },
  { icon: <Sparkles size={16} className='text-yellow-500' />, text: 'Tricks to remember traffic priorities' },
];

type ChatMessage = {
  sender: 'user' | 'ai';
  text: string;
  rich?: React.ReactNode;
};

const MOCK_AI_RESPONSES = [
  "Sure! Here's a simple summary of Chapter 1: The road is a space for the movement of people, animals, and vehicles. It can be divided into lanes for vehicles, sidewalks for pedestrians, and bike lanes for cyclists.",
  "Tip #1: Watch for keywords like 'always' and 'never'. Tip #2: Prioritize pedestrian safety in doubt. Tip #3: Road signs shape can hint their meaning—triangles warn, circles order.",
  "Here's a mind map for intersections:\n\n- Intersections\n  - Right of way\n  - Traffic lights\n  - Stop/Yield signs\n  - Pedestrian crossings\n  - Roundabouts",
  'You should plan to review one chapter each day and take a mini-quiz. Use weekends for mock exams. Remember to revisit your weak areas!',
  "Mnemonic for traffic priorities: 'Right, Signs, Traffic Light, Then Go.' If in doubt, yield to the right unless signs or signals say otherwise.",
];

export default function TutorPage() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [aiThinking, setAIThinking] = useState(false);
  const [typingAI, setTypingAI] = useState(''); // What’s currently being revealed
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Handle AI typing out the message (typewriter effect)
  function typeAIMessage(message: string, done: () => void) {
    setTypingAI('');
    let i = 0;
    const step = () => {
      setTypingAI(message.slice(0, i));
      i++;
      if (i <= message.length) {
        setTimeout(step, message[i - 1] === '\n' ? 60 : 18); // Pause longer on newline
      } else {
        done();
      }
    };
    step();
  }

  function sendUserMessage(msg: string) {
    if (!msg.trim()) return;
    setChat((prev) => [...prev, { sender: 'user', text: msg }]);
    setInput('');
    setAIThinking(true);

    // Simulate AI "thinking"
    setTimeout(() => {
      const aiReply = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
      // Animate AI message typing out
      typeAIMessage(aiReply, () => {
        setChat((prev) => [...prev, { sender: 'ai', text: aiReply }]);
        setTypingAI('');
        setAIThinking(false);
      });
    }, 900 + Math.random() * 600);
  }

  // Scroll to bottom on new message or typing
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, aiThinking, typingAI]);

  function handleSend() {
    if (!aiThinking && !typingAI) sendUserMessage(input);
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Block input while thinking or typing out the message
  const inputDisabled = aiThinking || !!typingAI;

  return (
    <main className='mx-auto p-4 pt-12 pb-10 flex flex-col min-h-[80vh]'>
      <h1 className='text-2xl md:text-3xl font-semibold text-center mb-5'>How can I help you?</h1>

      {/* Starter prompts */}
      <div className='flex flex-wrap gap-3 justify-center mb-6'>
        {starterPrompts.map((sp, i) => (
          <button
            key={i}
            className='flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-primary/20 text-gray-700 text-sm border transition'
            onClick={() => sendUserMessage(sp.text)}
            disabled={inputDisabled}
            aria-label={`Prompt: ${sp.text}`}
          >
            {sp.icon} {sp.text}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className='flex-1 rounded-2xl border border-gray-200 bg-white p-4 overflow-y-auto mb-5 max-h-[50vh] shadow'>
        {chat.length === 0 && !aiThinking && !typingAI && (
          <div className='text-gray-400 text-center italic'>Start the conversation or use a prompt above!</div>
        )}

        {chat.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            <div
              className={`rounded-lg px-4 py-3 max-w-[80%] whitespace-pre-line ${
                msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.rich || msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>
        ))}

        {/* Animate the AI message if typing */}
        {!!typingAI && (
          <div className='flex justify-start mb-3'>
            <div className='rounded-lg px-4 py-3 max-w-[80%] bg-gray-100 text-gray-900 flex items-center whitespace-pre-line typing-ai'>
              <Sparkles className='animate-bounce text-primary mr-2' size={18} />
              <span>
                {typingAI}
                <span className='ml-0.5 animate-pulse'>|</span>
              </span>
            </div>
          </div>
        )}

        {aiThinking && !typingAI && (
          <div className='flex justify-start mb-3'>
            <div className='rounded-lg px-4 py-3 max-w-[80%] bg-gray-100 text-gray-900 flex items-center gap-2'>
              <Sparkles className='animate-bounce text-primary' size={18} />
              <span>Thinking…</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <form
        className='flex items-center gap-2 border rounded-xl px-3 py-2 bg-white shadow'
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className='flex-1 border-0 outline-none bg-transparent text-gray-800 text-lg'
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Ask anything about theory, quizzes, study tips…'
          disabled={inputDisabled}
        />
        <button
          type='submit'
          disabled={inputDisabled || !input.trim()}
          className='p-2 rounded-full text-primary hover:bg-primary/10 transition'
          aria-label='Send message'
        >
          <SendHorizonal size={28} />
        </button>
      </form>
    </main>
  );
}
