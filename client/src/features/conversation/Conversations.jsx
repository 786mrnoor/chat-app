import { useCallback } from 'react';
import { FiArrowUpLeft } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { setActiveConversation } from '@/store/chat-slice';

import ConversationCard from './ConversationCard';

export default function Conversations() {
  const user = useSelector((state) => state.user);
  const activeConversationId = useSelector((state) => state.activeConversationId);
  const conversations = useSelector((state) => state.conversations);
  const sortedConversations = conversations.toSorted(
    (a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
  );

  const dispatch = useDispatch();

  const handleClick = useCallback(
    (conversationId) => {
      dispatch(setActiveConversation(conversationId));
    },
    [dispatch]
  );

  return (
    <div className='grid h-full w-full content-start overflow-auto border-r border-neutral-300 bg-white'>
      <header className='flex h-[var(--top-header-height)] items-center border-b border-neutral-300'>
        <h2 className='p-4 text-xl font-bold text-slate-800'>Message</h2>
      </header>

      <main className='scrollbar overflow-x-hidden overflow-y-auto px-2 pt-4'>
        {
          // if there is no conversation
          sortedConversations?.length === 0 && (
            <div className='mt-12'>
              <div className='my-4 flex items-center justify-center text-slate-500'>
                <FiArrowUpLeft size={50} />
              </div>
              <p className='text-center text-lg text-slate-400'>
                Explore users to start a conversation with.
              </p>
            </div>
          )
        }

        {sortedConversations?.map((conversation) => {
          return (
            <ConversationCard
              key={conversation?._id || conversation?.clientId}
              conversation={conversation}
              userId={user?._id}
              onClick={handleClick}
              isActive={
                conversation?._id === activeConversationId ||
                conversation?.clientId === activeConversationId
              }
            />
          );
        })}
      </main>
    </div>
  );
}
