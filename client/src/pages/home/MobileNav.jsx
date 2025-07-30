import { FaUserPlus } from 'react-icons/fa';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';

import Avatar from '@/components/Avatar';

export default function MobileHeader({ onOpenSearchUser, className }) {
  const user = useSelector((state) => state.user);
  return (
    <header
      className={`fixed bottom-0 flex h-[4rem] w-full items-center justify-around gap-x-2 border-t border-neutral-300 bg-neutral-100 px-5 ${className}`}
    >
      <button className='active nav-link'>
        <IoChatbubbleEllipses size={20} />
      </button>

      <button onClick={() => onOpenSearchUser(true)} className='nav-link'>
        <FaUserPlus size={20} />
      </button>

      <NavLink to='/profile' className='nav-link' title={user?.name}>
        <Avatar size={40} user={user} />
      </NavLink>
    </header>
  );
}
