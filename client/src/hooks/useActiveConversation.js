import { useSelector } from 'react-redux';

import { getConversation } from '@/store/helpers';

export default function useActiveConversation() {
  const conversations = useSelector((state) => state.conversations);
  const activeConversationId = useSelector((state) => state.activeConversationId);

  return getConversation(conversations, activeConversationId);
}
