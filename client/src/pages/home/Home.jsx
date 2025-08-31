import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router';

import Conversations from '@/features/conversation/Conversations';
import CreateGroup from '@/features/create-group/Index';
import MessagePage from '@/features/message/Index';
import SearchUser from '@/features/search-user/Index';
import useActiveConversation from '@/hooks/useActiveConversation';
import useUserEffect from '@/hooks/useUserEffect';

import { resetState } from '@/store/chat-slice';

import Banner from './Banner';
import MobileNav from './MobileNav';
import Nav from './Nav';

export default function Home() {
  const dispatch = useDispatch();
  useUserEffect();

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const activeConversation = useActiveConversation();

  const location = useLocation();
  const basePath = location.pathname === '/';
  const [activeModal, setActiveModal] = useState('');
  return (
    <main
      className={`scrollbar grid h-[calc(100dvh-4rem)] grid-cols-1 grid-rows-1 overflow-auto md:h-dvh md:grid-cols-[auto_auto_1fr] ${activeConversation ? 'max-md:h-dvh' : ''}`}
    >
      <Nav
        className='w-[4rem] max-md:hidden'
        onOpenSearchUser={() => setActiveModal('search-user')}
        onOpenCreateGroup={() => setActiveModal('create-group')}
      />

      <section
        className={`w-full md:w-[20rem] lg:w-[24rem] ${activeConversation ? 'max-md:hidden' : ''}`}
      >
        <Conversations />
      </section>

      <section className={`${activeConversation ? '' : 'max-md:hidden'}`}>
        {activeConversation && <MessagePage />}

        {basePath && !activeConversation && <Banner />}
      </section>

      <MobileNav
        className={`md:hidden ${activeConversation ? 'hidden' : ''}`}
        onOpenSearchUser={() => setActiveModal('search-user')}
        onOpenCreateGroup={() => setActiveModal('create-group')}
      />
      <Outlet />

      {
        //search user
        activeModal === 'search-user' && (
          <SearchUser
            className='fixed top-0 bottom-0 left-0 z-2 border-r border-neutral-300 md:w-[24rem] lg:w-[28rem]'
            onClose={() => setActiveModal('')}
          />
        )
      }
      {
        //create group
        activeModal === 'create-group' && (
          <CreateGroup
            className='fixed top-0 bottom-0 left-0 z-2 border-r border-neutral-300 md:w-[24rem] lg:w-[28rem]'
            onClose={() => setActiveModal('')}
          />
        )
      }
    </main>
  );
}
