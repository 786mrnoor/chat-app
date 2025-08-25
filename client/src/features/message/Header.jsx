import { HiDotsVertical } from 'react-icons/hi';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

import Avatar from '@/components/Avatar';

import useActiveConversation from '@/hooks/useActiveConversation';
import { setActiveConversation } from '@/store/chat-slice';

export default function Header() {
  const activeConversation = useActiveConversation();
  const user = activeConversation?.otherUser;
  const dispatch = useDispatch();

  return (
    <header className='sticky top-0 flex h-[var(--top-header-height)] items-center justify-between gap-4 border-b border-neutral-300 bg-white'>
      {/* back button */}
      <button
        className='ml-2 cursor-pointer rounded p-2 hover:bg-neutral-200 md:hidden'
        onClick={() => dispatch(setActiveConversation(null))}
      >
        <IoArrowBack size={24} />
      </button>

      <Avatar
        imageUrl={activeConversation?.type === 'group' ? activeConversation?.iconUrl : ''}
        className='sm:ml-2'
        size={50}
        user={user}
      />

      <div>
        <h3 className='my-0 line-clamp-1 text-lg font-semibold text-ellipsis'>
          {activeConversation?.type === 'group' ? activeConversation?.name : user?.name}
        </h3>
        {activeConversation?.type === 'individual' && (
          <p className='-mt-2 text-sm'>
            {user?.isTyping ? (
              <span className='text-primary'>typing...</span>
            ) : user?.isOnline ? (
              <span className='text-primary'>online</span>
            ) : (
              <span className='text-slate-400'>offline</span>
            )}
          </p>
        )}
      </div>

      <div className='ml-auto'>
        <button className='mr-2 cursor-pointer rounded-full p-3 focus-within:outline-2 focus-within:outline-primary hover:bg-slate-200'>
          <HiDotsVertical />
        </button>
      </div>
    </header>
  );
}
