import { memo } from 'react';

import ProfileCard from '@/components/ProfileCard';

import timeFormatter from '@/helpers/time-formatter';

import LastMessageContent from './LastMessageContent';

const ConversationCard = memo(function ConversationCard({
  conversation,
  userId,
  onClick,
  isActive,
}) {
  const lastMessage = conversation?.lastMessage;
  return (
    <ProfileCard
      user={conversation?.otherUser}
      onClick={() => onClick(conversation._id)}
      className={isActive ? 'active' : ''}
      imageUrl={conversation?.type === 'group' ? conversation?.iconUrl : ''}
    >
      <div className='w-full'>
        <div className='flex items-center justify-between'>
          <h3 className='line-clamp-1 text-left text-base font-semibold text-ellipsis'>
            {conversation?.type === 'group' ? conversation?.name : conversation?.otherUser?.name}
          </h3>
          <span className='text-[0.7rem]'>
            {(lastMessage?.deliveredAt || conversation?.lastMessageTimestamp) &&
              timeFormatter.format(
                new Date(lastMessage?.deliveredAt || conversation?.lastMessageTimestamp)
              )}
          </span>
        </div>
        <div className='flex items-center gap-1 text-xs text-slate-500'>
          <LastMessageContent message={lastMessage} conversation={conversation} userId={userId} />
        </div>
      </div>
      {conversation?.unseenCount > 0 && (
        <p className='ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary p-1 text-xs font-semibold text-white'>
          {conversation?.unseenCount}
        </p>
      )}
    </ProfileCard>
  );
});

export default ConversationCard;
