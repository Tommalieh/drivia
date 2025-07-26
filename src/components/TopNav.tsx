import { useLocation, Link } from 'react-router-dom';
import { menuList } from '../navigation/menuConfig';

const TopNav: React.FC = () => {
  const location = useLocation();

  // Determine active main menu based on pathname
  const activeMainMenu =
    menuList.find((menu) => location.pathname === menu.path || location.pathname.startsWith(menu.path + '/')) ||
    menuList[0];

  const subMenus = activeMainMenu.subMenus ?? [];

  return (
    <nav className='flex gap-8 font-medium text-gray-600 z-10 items-center'>
      <h1 className='w-56 text-2xl font-bold italic'>drivia</h1>
      {subMenus.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            to={tab.path}
            key={tab.label}
            className={`pb-1 ${
              isActive ? 'text-tertiary border-b-2 border-tertiary' : 'hover:text-gray-800'
            } transition cursor-pointer`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default TopNav;
