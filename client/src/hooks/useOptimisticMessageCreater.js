import { useSelector } from 'react-redux';

import useActiveConversation from '@/hooks/useActiveConversation';

import uniqueId from '@/helpers/unique-id';

export default function useOptimisticMessageCreater() {
  const user = useSelector((state) => state.user);
  const activeConversation = useActiveConversation();

  function create(type = 'text', content, media) {
    const recipientId =
      activeConversation?.type === 'individual' ? activeConversation?.otherUser?._id : null;

    return {
      type,
      clientId: uniqueId(),
      content: content?.trim() || '',
      media,
      senderId: user?._id,
      recipientId, // Only send if it's a new 1-on-1
      conversationId: activeConversation?._id, // If optimistic conversation, this will be the null and only recipient id will be sent
      conversationClientId: activeConversation?.clientId,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
  }

  return create;
}
