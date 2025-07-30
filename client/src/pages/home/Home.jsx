import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import MessagePage from '@/features/message/Index';
import useActiveConversation from '@/hooks/useActiveConversation';
import useConversationEffect from '@/hooks/useConversationsEffect';
import useMessagesEffect from '@/hooks/useMessagesEffect';
import useUserEffect from '@/hooks/useUserEffect';
import { resetState } from '@/store/chat-slice';

import Banner from './Banner';
import Conversations from './Conversations';
import Header from './Header';

export default function Home() {
  const dispatch = useDispatch();
  useUserEffect();
  useConversationEffect();
  useMessagesEffect();

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const activeConversation = useActiveConversation();

  const location = useLocation();
  const basePath = location.pathname === '/';

  return (
    <main className='scrollbar grid h-dvh max-h-dvh grid-cols-[4rem_1fr] grid-rows-1 overflow-auto sm:grid-cols-[4rem_22rem_1fr] lg:grid-cols-[4rem_24rem_1fr]'>
      <Header />

      <section className={activeConversation ? 'hidden sm:block' : ''}>
        <Conversations />
      </section>

      <section>
        {activeConversation && <MessagePage />}

        {basePath && !activeConversation && <Banner />}
      </section>
    </main>
  );
}
