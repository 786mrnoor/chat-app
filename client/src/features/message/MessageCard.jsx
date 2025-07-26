import moment from 'moment';
import { memo } from 'react';

import MessageStatusBadge from '@/components/MessageStatusBadge';

const MessageCard = memo(function MessageCard({ message, user }) {
  return (
    <div
      className={`w-fit max-w-75/100 rounded p-1 py-1 shadow-xs has-[img,video]:max-w-82 lg:max-w-60/100 ${user?._id === message?.senderId ? 'ml-auto bg-teal-100' : 'bg-white'}`}
    >
      <div className='relative bg-white'>
        {message?.type === 'image' && (
          <img
            src={message?.media?.url}
            className='gradient h-auto max-w-80 min-w-full'
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
        <span className='invisible text-[.8rem]'>{moment(message.createdAt).format('hh:mm')}</span>
      </p>
      <p className='ml-auto w-fit text-[.7rem]'>
        {moment(message.createdAt).format('hh:mm')}
        {message?.senderId === user?._id && <MessageStatusBadge message={message} size={13} />}
      </p>
    </div>
  );
});

export default MessageCard;
