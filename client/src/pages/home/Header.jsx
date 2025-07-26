import axios from 'axios';
import { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { FaUserPlus } from 'react-icons/fa';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { NavLink, Outlet, useNavigate } from 'react-router';

import Avatar from '@/components/Avatar';

import SearchUser from '@/features/search-user/Index';

export default function Header() {
  const user = useSelector((state) => state.user);
  const [openSearchUser, setOpenSearchUser] = useState(false);
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
    <header className='relative flex h-full flex-col items-center gap-y-2 border-r border-neutral-300 bg-neutral-100 py-5'>
      <NavLink to='/' className='nav-link' title='chat'>
        <IoChatbubbleEllipses size={20} />
      </NavLink>

      <button title='add friend' onClick={() => setOpenSearchUser(true)} className='nav-link'>
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

      <Outlet />

      {
        //search user
        openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)} />
      }
    </header>
  );
}
