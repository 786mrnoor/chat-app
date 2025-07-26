import { useDispatch } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';
import { sendMessage as dispatchMessage } from '@/store/chat-slice';
import { updateLastMessage } from '@/store/chat-slice';

import useOptimisticMessageCreater from './useOptimisticMessageCreater';

export default function useSendMessage() {
  const createOptimisticMessage = useOptimisticMessageCreater();
  const socketConnection = useSocket();
  const dispatch = useDispatch();

  function sendMessage(message) {
    const newMessage = createOptimisticMessage('text', message?.content);
    if (!newMessage.content) {
      return false;
    }

    if (!socketConnection) return;

    // Dispatch the optimistic message to the store
    dispatch(dispatchMessage(newMessage));
    dispatch(updateLastMessage(newMessage));

    // Emit the message to the server
    socketConnection.emit('message:send', newMessage);

    return newMessage;
  }

  return sendMessage;
}
