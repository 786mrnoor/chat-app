import { useSelector } from 'react-redux';

import Header from './Header';
import Input from './Input';
import Messages from './Messages';

export default function Index() {
  const activeConversationId = useSelector((state) => state.activeConversationId);

  return (
    <main className='scrollbar relative grid h-full w-full grid-rows-[auto_1fr_auto] bg-neutral-100 max-sm:overflow-auto'>
      <Header />
      <Messages />
      <Input key={activeConversationId} />
    </main>
  );
}
