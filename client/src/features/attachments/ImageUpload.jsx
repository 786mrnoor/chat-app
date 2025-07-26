import { useEffect, useRef, useState } from 'react';
import { FaPlus, FaXmark } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';

import uniqueId from '@/helpers/unique-id';
import useTextAreaAutoResize from '@/hooks/useTextAreaAutoResize';

function createMessages(files, content = '') {
  let newMessages = Array.from(files).map((file, index) => ({
    clientId: uniqueId(),
    type: 'image',
    media: {
      url: URL.createObjectURL(file),
      type: file.type,
    },
    content: index === 0 ? content : '',
    file,
  }));

  return newMessages;
}
export default function ImageUpload({ message, onClose, onSend }) {
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(0);
  const activeMessage = messages[index];

  const inputRef = useRef(null);
  useTextAreaAutoResize(inputRef);

  useEffect(() => {
    let newMessages = createMessages(message.files, message.content);
    setMessages(newMessages);
    return () => {
      setMessages([]);
    };
  }, [message.files, message.content]);

  function handleOnChangeCaption(e) {
    const { value } = e.target;
    setMessages((prev) => {
      return prev.map((message, i) => {
        if (index === i) {
          return {
            ...message,
            content: value,
          };
        }
        return message;
      });
    });
  }
  function removeMessage(message) {
    const newMessages = messages.filter((m) => {
      if (m?.clientId === message?.clientId) {
        URL.revokeObjectURL(m.mediaUrl);
        return false;
      }
      return true;
    });

    // close the modal and reset the message if no messages left
    if (newMessages.length === 0) {
      onClose('');
      return;
    } else if (index >= newMessages.length) {
      setIndex(newMessages.length - 1);
    }
    return setMessages(newMessages);
  }
  function handleOnClose() {
    // first filter out the element which has some content
    // then join the content with new line
    let content = messages
      .map((message) => {
        URL.revokeObjectURL(message.mediaUrl);
        return message.content;
      })
      .filter((content) => content)
      .join('\n\n');

    onClose(content);
  }
  async function handleAddImage(e) {
    const files = e.target.files;
    if (files.length <= 0) return;

    let newMessages = createMessages(files);
    setMessages((prev) => [...prev, ...newMessages]);
    e.target.value = '';
  }

  return (
    <div className='absolute top-[var(--top-header-height)] bottom-0 left-0 flex w-full flex-col items-center bg-white p-3'>
      <button
        onClick={handleOnClose}
        className='transition-rotate mb-auto flex h-11 w-11 cursor-pointer items-center justify-center self-start rounded-full focus-within:outline-2 focus-within:outline-primary hover:bg-slate-200'
      >
        <FaXmark size={20} className='text-black/80' />
      </button>
      {activeMessage && (
        <img
          src={activeMessage?.media?.url}
          className='max-h-[300px] max-w-[min(100%,350px)] min-w-20 rounded border border-slate-200 object-contain shadow-[0_0_4px_rgba(0,0,0,0.2)]'
          alt=''
        />
      )}

      <textarea
        placeholder='Add a caption'
        className='scrollbar mt-3 mb-2 max-h-32 min-h-8 w-full resize-none rounded-md bg-slate-200 px-4 py-1 outline-none lg:min-h-10 lg:w-8/10 lg:py-2'
        ref={inputRef}
        rows='1'
        value={activeMessage?.content}
        onChange={handleOnChangeCaption}
      ></textarea>

      <div className='mt-auto flex h-20 w-full items-start gap-3 border-t border-slate-200 p-2 pb-0 lg:h-24'>
        <div className='scrollbar ml-auto flex gap-3 overflow-auto p-2 whitespace-pre'>
          {messages.map((message, i) => (
            <div key={message?.clientId} className='group relative shrink-0'>
              <button onClick={() => setIndex(i)}>
                <img
                  className={`h-12 w-12 cursor-pointer rounded border border-slate-200 object-cover hover:inset-shadow-[0_0_4px_rgba(0,0,0,0.2)] lg:h-16 lg:w-16 ${i === index ? 'ring-2 ring-primary' : 'ring-1 ring-slate-200'}`}
                  src={message?.media?.url}
                  alt=''
                />
              </button>

              <button
                onClick={() => removeMessage(message)}
                className='absolute top-0 right-0 cursor-pointer rounded bg-black/70 p-1 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100'
              >
                <FaXmark size={18} className='pointer-events-none text-white' />
              </button>
            </div>
          ))}
        </div>
        <label
          htmlFor='upload'
          tabIndex='0'
          className='mt-2 mr-auto flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded border border-slate-400 lg:h-16 lg:w-16'
        >
          <FaPlus size={24} className='text-slate-600' />
          <input
            type='file'
            id='upload'
            accept='image/*'
            multiple
            onChange={handleAddImage}
            className='hidden'
          />
        </label>
        <button
          onClick={() => onSend(messages, 'image')}
          className='mt-2 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary hover:bg-secondary lg:h-16 lg:w-16'
        >
          <IoMdSend size={24} className='ml-1 text-white' />
        </button>
      </div>
    </div>
  );
}
