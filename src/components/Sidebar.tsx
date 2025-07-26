import { useLocation, Link } from 'react-router-dom';
import { menuList } from '../navigation/menuConfig';
import { Video, User } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  // Find which main menu is active
  const isMenuActive = (menu: (typeof menuList)[0]) =>
    location.pathname === menu.path || location.pathname.startsWith(menu.path + '/');

  return (
    <aside className='w-64 bg-gray-100 text-black p-6 flex flex-col justify-between border-e'>
      <div>
        <div className='space-y-2'>
          {menuList.map((menuItem) => (
            <Link
              to={menuItem.path}
              key={menuItem.label}
              className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-primary/50 cursor-pointer ${
                isMenuActive(menuItem) ? 'bg-primary/70 text-gray-800 font-semibold' : ''
              }`}
            >
              {menuItem.icon}
              <span>{menuItem.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className='space-y-3'>
        <button className='flex items-center gap-3 w-full text-left px-4 py-1.5 hover:bg-primary/50 rounded-md cursor-pointer'>
          <Video size={18} /> Video guide
        </button>
        <button className='flex items-center gap-3 w-full text-left px-4 py-1.5 hover:bg-primary/50 rounded-md cursor-pointer'>
          <User size={18} /> Profile
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
