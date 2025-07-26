import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await login(data);
      toast.success('Login successful!');
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      navigate('/home');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200'>
      {loading && <Spinner />}
      <AuthForm onSubmit={handleLogin} buttonText='Login' />
    </div>
  );
};

export default Login;
