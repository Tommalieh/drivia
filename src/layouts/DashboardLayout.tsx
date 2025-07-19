import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';

function DashboardLayout() {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100 text-gray-800'>
      <header className='bg-white shadow-sm px-6 py-4'>
        <TopNav />
      </header>
      <main className='flex-1 flex'>
        <Sidebar />
        <section className='flex-1 overflow-y-auto'>
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
