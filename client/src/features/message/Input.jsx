import { useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';

import useSendAttachments from '@/hooks/useSendAttachments';
import useSendMessage from '@/hooks/useSendMessage';
import useTextAreaAutoResize from '@/hooks/useTextAreaAutoResize';

import useTypingHandler from '../../hooks/useTypingHandler';
import AttachmentMenu from '../attachments/AttachmentMenu';
import ImageUpload from '../attachments/ImageUpload';

const MESSAGE = {
  type: 'text',
  content: '',
  files: null, //FileList
};
export default function Input() {
  const [message, setMessage] = useState(MESSAGE);
  const inputRef = useRef(null);
  useTextAreaAutoResize(inputRef);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const sendMessage = useSendMessage();
  const sendAttachments = useSendAttachments();

  const typingHandler = useTypingHandler();
  function handleOnChange(e) {
    const { value } = e.target;
    typingHandler();

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
      setMessage(MESSAGE);
    }
  }

  function handleAttachmentSelect(type, files) {
    setShowAttachmentMenu(false);
    setMessage((prev) => ({ ...prev, type, files }));
  }

  async function handleSendAttachments(messages, type) {
    // reset the message state;
    setMessage(MESSAGE);
    sendAttachments(messages, type);
  }
  return (
    <section className='m-2 flex items-center rounded-4xl bg-white px-4 py-2 shadow-[0px_1px_6px_rgba(0,0,0,0.12)]'>
      <div className='relative self-end'>
        <button
          onClick={() => setShowAttachmentMenu((prev) => !prev)}
          className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-primary hover:text-white'
        >
          <FaPlus
            size={20}
            className={`transition-600 transition-all ${showAttachmentMenu ? 'rotate-135' : ''}`}
          />
        </button>

        {/**video and image */}
        {showAttachmentMenu && <AttachmentMenu onAttachmentSelect={handleAttachmentSelect} />}
      </div>

      {/**input box */}
      <form className='flex h-full w-full items-center gap-2' onSubmit={handleSendMessage}>
        <textarea
          type='text'
          placeholder='Type here message...'
          className='scrollbar max-h-32 grow-1 resize-none px-4 py-2 outline-none'
          rows='1'
          ref={inputRef}
          value={message.content}
          onChange={handleOnChange}
        />
        <button
          type='submit'
          className='flex h-11 w-11 cursor-pointer items-center justify-center self-end rounded-full bg-primary text-primary hover:bg-secondary'
        >
          <IoMdSend size={24} className='ml-1 text-white' />
        </button>
      </form>

      {message.type === 'image' && (
        <ImageUpload
          message={message}
          onClose={(content) => setMessage({ ...MESSAGE, content: content || '' })} // reset the message
          onSend={handleSendAttachments}
        />
      )}
    </section>
  );
}
