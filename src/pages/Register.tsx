import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await register(data);
      toast.success('Registration successful!');
      localStorage.setItem('token', res.data.token); // Optional: only if your API returns a token
      navigate('/login');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200'>
      {loading && <Spinner />}
      <AuthForm onSubmit={handleRegister} buttonText='Register' disabled={loading} />
    </div>
  );
};

export default Register;
