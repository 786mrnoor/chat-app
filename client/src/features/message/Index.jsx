import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';
import { setMessages } from '@/store/chat-slice';

import Footer from './Footer';
import Header from './Header';
import Messages from './Messages';

export default function Index() {
  const activeConversationId = useSelector((state) => state.activeConversationId);
  const socket = useSocket();
  const dispatch = useDispatch();

  // fetch initial messages whenever activeConversationId changes
  useEffect(() => {
    if (!socket || !activeConversationId) return;

    socket.emit('message:initial-messages', activeConversationId, (res) => {
      if (res.success) {
        dispatch(setMessages(res.data));
      } else {
        console.error(res.message);
      }
    });
  }, [socket, dispatch, activeConversationId]);

  return (
    <main className='scrollbar relative grid h-full w-full grid-rows-[auto_1fr_auto] bg-neutral-100 max-sm:overflow-auto'>
      <Header />
      <Messages />
      <Footer key={activeConversationId} />
    </main>
  );
}
