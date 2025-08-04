import axios from 'axios';
import { BiLogOut } from 'react-icons/bi';
import { FaUserPlus } from 'react-icons/fa';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';

import Avatar from '@/components/Avatar';

export default function Header({ className, onOpenSearchUser }) {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await axios.post('/api/auth/logout');
      navigate('/email', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  return (
    <header
      className={`flex h-full flex-col items-center gap-y-2 border-r border-neutral-300 bg-neutral-100 py-5 ${className}`}
    >
      <button className='active nav-link'>
        <IoChatbubbleEllipses size={20} />
      </button>

      <button onClick={onOpenSearchUser} className='nav-link'>
        <FaUserPlus size={20} />
      </button>

      <NavLink to='/profile' className='mt-auto nav-link' title={user?.name}>
        <Avatar size={40} user={user} />
      </NavLink>

      <button title='logout' className='nav-link' onClick={handleLogout}>
        <span className='-ml-2'>
          <BiLogOut size={20} />
        </span>
      </button>
    </header>
  );
}
