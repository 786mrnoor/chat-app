import moment from 'moment';
import { memo } from 'react';
import { FaImage, FaVideo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import Avatar from '@/components/Avatar';
import MessageStatusBadge from '@/components/MessageStatusBadge';

import { setActiveConversation } from '@/store/chat-slice';

const ConversationCard = memo(function ConversationCard({ conversation, user, isActive }) {
  const dispatch = useDispatch();
  function onClick(conversationId) {
    dispatch(setActiveConversation(conversationId));
  }

  const lastMessage = conversation?.lastMessage;
  return (
    <>
      <button
        onClick={() => onClick(conversation._id)}
        className={`my-1 flex w-full cursor-pointer items-center gap-2 rounded-2xl border px-2 py-3 ${isActive ? 'border-neutral-200 bg-neutral-100' : 'border-transparent hover:border-neutral-200 hover:bg-neutral-50'}`}
      >
        <Avatar user={conversation?.otherUser} size={42} className='flex-shrink-0' />
        <div className='w-full'>
          <div className='flex items-center justify-between'>
            <h3 className='line-clamp-1 text-left text-base font-semibold text-ellipsis'>
              {conversation?.otherUser?.name}
            </h3>
            <span className='text-[0.7rem]'>
              {moment(lastMessage?.deliveredAt || conversation?.lastMessageTimestamp).format(
                'hh:mm'
              )}
            </span>
          </div>
          <div className='flex items-center gap-1 text-xs text-slate-500'>
            {lastMessage?.imageUrl && (
              <div className='flex items-center gap-1'>
                <span>
                  <FaImage />
                </span>
                {!lastMessage?.content && <span>Image</span>}
              </div>
            )}
            {lastMessage?.videoUrl && (
              <div className='flex items-center gap-1'>
                <span>
                  <FaVideo />
                </span>
                {!lastMessage?.content && <span>Video</span>}
              </div>
            )}
            <p className='line-clamp-1 text-left text-ellipsis'>
              {conversation?.lastMessageSender === user?._id && (
                <MessageStatusBadge message={conversation?.lastMessage} size={13} />
              )}
              {lastMessage?.content}
            </p>
          </div>
        </div>
        {conversation?.unseenCount > 0 && (
          <p className='ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary p-1 text-xs font-semibold text-white'>
            {conversation?.unseenCount}
          </p>
        )}
      </button>
      <hr className='border-neutral-200' />
    </>
  );
});

export default ConversationCard;
