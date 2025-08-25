import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import useActiveConversation from '../../hooks/useActiveConversation';

import MessageCard from './MessageCard';
import SystemMessageCard from './SystemMessageCard';

const MessagePage = () => {
  const user = useSelector((state) => state.user);
  const messages = useSelector((state) => state.messages);
  const sortedMessages = messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const activeConversation = useActiveConversation();
  const messageContainer = useRef(null);

  // scroll to bottom when user open message page
  useEffect(() => {
    if (!messageContainer.current) return;

    requestAnimationFrame(() => {
      messageContainer.current.scrollTo({
        top: messageContainer.current.scrollHeight,
        behavior: 'instant',
      });
    });
  }, [messages.length]);

  return (
    <section
      className='scrollbar flex flex-col gap-2 overflow-x-hidden overflow-y-auto p-2'
      ref={messageContainer}
    >
      {sortedMessages.map((message) => {
        return message?.type === 'system' ? (
          <SystemMessageCard
            key={message?._id || message?.clientId}
            message={message}
            userId={user?._id}
            members={activeConversation?.members}
          />
        ) : (
          <MessageCard key={message?._id || message?.clientId} message={message} user={user} />
        );
      })}
    </section>
  );
};

export default MessagePage;
