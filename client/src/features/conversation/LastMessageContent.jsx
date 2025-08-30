import { FaImage, FaVideo } from 'react-icons/fa';

import MessageStatusBadge from '@/components/MessageStatusBadge';

import { generateSystemMessage } from '@/helpers/generate-system-message';

export default function LastMessageContent({ message, conversation, userId }) {
  if (message?.type === 'system') {
    return (
      <p className='line-clamp-1 text-left text-ellipsis'>
        {generateSystemMessage(message?.meta, userId, conversation?.members)}
      </p>
    );
  }
  return (
    <>
      {conversation?.lastMessageSender === userId && (
        <MessageStatusBadge message={message} size={13} className='shrink-0' />
      )}
      {message?.media && (
        <>
          {message?.type === 'image' ? (
            <FaImage className='shrink-0' />
          ) : (
            <FaVideo className='shrink-0' />
          )}
          {!message?.content && <span className='shrink-0'>Image</span>}
        </>
      )}
      <p className='line-clamp-1 text-left text-ellipsis'>{message?.content}</p>
    </>
  );
}
