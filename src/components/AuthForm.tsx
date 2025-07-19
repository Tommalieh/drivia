import { useState } from 'react';

interface Props {
  onSubmit: (data: { email: string; password: string }) => void;
  buttonText: string;
  disabled?: boolean;
}

const AuthForm: React.FC<Props> = ({ onSubmit, buttonText, disabled }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ email, password });
      }}
      className='max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4'
    >
      <h2 className='text-2xl font-bold text-center'>{buttonText}</h2>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full border border-gray-300 rounded-lg p-2'
        required
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full border border-gray-300 rounded-lg p-2'
        required
      />
      <button
        type='submit'
        className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
        disabled={disabled}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default AuthForm;
