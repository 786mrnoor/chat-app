import { FaUserPlus } from 'react-icons/fa';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { NavLink } from 'react-router';

import Avatar from '@/components/Avatar';

export default function MobileHeader({ user, setOpenSearchUser, className }) {
  return (
    <header
      className={`fixed bottom-0 flex h-[4rem] w-full items-center justify-around gap-x-2 border-t border-neutral-300 bg-neutral-100 px-5 ${className}`}
    >
      <NavLink to='/' className='nav-link' title='chat'>
        <IoChatbubbleEllipses size={20} />
      </NavLink>

      <button title='add friend' onClick={() => setOpenSearchUser(true)} className='nav-link'>
        <FaUserPlus size={20} />
      </button>

      <NavLink to='/profile' className='nav-link' title={user?.name}>
        <Avatar size={40} user={user} />
      </NavLink>

      {/* {
        //search user
        openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)} />
      } */}
    </header>
  );
}
