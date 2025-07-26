import { FiArrowUpLeft } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import ConversationCard from './ConversationCard';

export default function Conversations() {
  const user = useSelector((state) => state.user);
  const activeConversationId = useSelector((state) => state.activeConversationId);
  const conversations = useSelector((state) => state.conversations);
  const sortedConversations = conversations.toSorted(
    (a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
  );

  return (
    <section className='bg-white border-r border-neutral-300 grid content-start overflow-auto'>
      <header className='h-[var(--top-header-height)] flex items-center border-b border-neutral-300'>
        <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
      </header>

      <main className='overflow-x-hidden overflow-y-auto scrollbar pt-4 px-2'>
        {
          // if there is no conversation
          sortedConversations?.length === 0 && (
            <div className='mt-12'>
              <div className='flex justify-center items-center my-4 text-slate-500'>
                <FiArrowUpLeft size={50} />
              </div>
              <p className='text-lg text-center text-slate-400'>
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
              user={user}
              isActive={
                conversation?._id === activeConversationId ||
                conversation?.clientId === activeConversationId
              }
            />
          );
        })}
      </main>
    </section>
  );
}
