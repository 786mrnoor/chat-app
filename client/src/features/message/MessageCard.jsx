import { memo } from 'react';

import MessageStatusBadge from '@/components/MessageStatusBadge';

import timeFormatter from '@/helpers/time-formatter';

const MessageCard = memo(function MessageCard({ message, user }) {
  return (
    <div
      className={`w-fit max-w-75/100 rounded p-1 py-1 shadow-xs has-[img,video]:max-w-[min(75%,20.5rem)] lg:max-w-60/100 ${user?._id === message?.senderId ? 'ml-auto bg-teal-100' : 'bg-white'}`}
    >
      <div className='relative bg-white'>
        {message?.type === 'image' && (
          <img
            src={message?.media?.url}
            className='gradient h-auto min-w-full'
            alt={message?.content}
            loading='lazy'
            height={message?.media?.height}
            width={message?.media?.width}
          />
        )}
        {message?.type === 'video' && (
          <video src={message.media?.url} className='h-full w-full object-scale-down' controls />
        )}
      </div>
      <p className='px-2 whitespace-pre-wrap'>
        {message.content}{' '}
        <span className='invisible text-[.8rem]'>
          {timeFormatter.format(new Date(message.createdAt))}
        </span>
      </p>
      <p className='ml-auto w-fit text-[.7rem]'>
        {timeFormatter.format(new Date(message.createdAt))}
        {message?.senderId === user?._id && <MessageStatusBadge message={message} size={13} />}
      </p>
    </div>
  );
});

export default MessageCard;
