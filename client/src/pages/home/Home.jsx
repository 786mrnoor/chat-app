import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import logo from '@/assets/logo.png';
import MessagePage from '@/features/message/Index';
import useActiveConversation from '@/hooks/useActiveConversation';
import useConversationEffect from '@/hooks/useConversationsEffect';
import useMessagesEffect from '@/hooks/useMessagesEffect';
import useUserEffect from '@/hooks/useUserEffect';
import { resetState } from '@/store/chat-slice';

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
    <div className='grid h-dvh max-h-dvh grid-cols-[4rem_1fr] grid-rows-1 justify-start'>
      <Header />
      <div className='scrollbar grid grid-cols-[1fr] grid-rows-1 overflow-auto sm:grid-cols-[22rem_1fr] lg:grid-cols-[24rem_1fr]'>
        <Conversations />
        {activeConversation && <MessagePage />}

        {basePath && !activeConversation && (
          <div
            className={
              'hidden min-w-20 bg-neutral-100 sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-2'
            }
          >
            <img src={logo} width={250} alt='logo' />
            <p className='mt-3 text-lg text-slate-500'>Select user to send message</p>
          </div>
        )}
      </div>
    </div>
  );
}
