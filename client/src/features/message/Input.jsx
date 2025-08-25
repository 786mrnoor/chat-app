import { IoMdSend } from 'react-icons/io';

import AutoResizableTextArea from '@/components/AutoResizableTextArea';

import useSendMessage from './useSendMessage';
import useTypingEventEmitter from './useTypingEventEmitter';

export default function Input({ message, setMessage, onReset }) {
  const sendMessage = useSendMessage();

  const typingEventEmitter = useTypingEventEmitter();

  function handleOnChange(e) {
    const { value } = e.target;
    typingEventEmitter();

    setMessage((prev) => {
      return {
        ...prev,
        content: value,
      };
    });
  }

  function handleSendMessage(e) {
    e.preventDefault();
    const status = sendMessage(message);

    // reset the message state if the status is true
    // this means the message was sent successfully
    if (status) {
      onReset();
    }
  }

  return (
    <form className='flex h-full w-full items-center gap-2' onSubmit={handleSendMessage}>
      <AutoResizableTextArea
        placeholder='Type here message...'
        className='scrollbar max-h-32 grow-1 resize-none px-4 py-2 outline-none'
        rows='1'
        value={message?.content}
        onChange={handleOnChange}
      />
      <button
        type='submit'
        className='flex h-11 w-11 cursor-pointer items-center justify-center self-end rounded-full bg-primary text-primary hover:bg-secondary'
      >
        <IoMdSend size={24} className='ml-1 text-white' />
      </button>
    </form>
  );
}
