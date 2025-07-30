import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import MessagePage from '@/features/message/Index';
import SearchUser from '@/features/search-user/Index';
import useActiveConversation from '@/hooks/useActiveConversation';
import useConversationEffect from '@/hooks/useConversationsEffect';
import useMessagesEffect from '@/hooks/useMessagesEffect';
import useUserEffect from '@/hooks/useUserEffect';
import { resetState } from '@/store/chat-slice';

import Banner from './Banner';
import Conversations from './Conversations';
import Header from './Header';
import MobileHeader from './MobileHeader';

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
  const [openSearchUser, setOpenSearchUser] = useState(false);
  return (
    <main
      className={`scrollbar grid h-[calc(100dvh-4rem)] grid-cols-1 grid-rows-1 overflow-auto md:h-dvh md:grid-cols-[auto_auto_1fr] ${activeConversation ? 'max-md:h-dvh' : ''}`}
    >
      <Header className='w-[4rem] max-md:hidden' onOpenSearchUser={() => setOpenSearchUser(true)} />

      <section
        className={`w-full md:w-[20rem] lg:w-[24rem] ${activeConversation ? 'max-md:hidden' : ''}`}
      >
        <Conversations />
      </section>

      <section className={`${activeConversation ? '' : 'max-md:hidden'}`}>
        {activeConversation && <MessagePage />}

        {basePath && !activeConversation && <Banner />}
      </section>

      <MobileHeader className={`md:hidden ${activeConversation ? 'hidden' : ''}`} />

      {
        //search user
        openSearchUser && <SearchUser onClose={() => setOpenSearchUser(false)} />
      }
    </main>
  );
}
