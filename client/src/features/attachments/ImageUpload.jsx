import { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

import AutoResizableTextArea from '@/components/AutoResizableTextArea';

import uniqueId from '@/helpers/unique-id';

import Footer from './Footer';
import useSendAttachments from './useSendAttachments';

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
export default function ImageUpload({ message, onClose }) {
  const [messages, setMessages] = useState([]);
  const [index, setIndex] = useState(0);
  const activeMessage = messages[index];
  const sendAttachments = useSendAttachments();

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

  async function handleSendAttachments() {
    sendAttachments(messages, 'image');
    // reset the message state;
    onClose('');
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

      <AutoResizableTextArea
        placeholder='Add a caption'
        className='scrollbar mt-3 mb-2 max-h-32 min-h-8 w-full resize-none rounded-md bg-slate-200 px-4 py-1 outline-none lg:min-h-10 lg:w-8/10 lg:py-2'
        rows='1'
        value={activeMessage?.content}
        onChange={handleOnChangeCaption}
      />

      <Footer
        messages={messages}
        index={index}
        setIndex={setIndex}
        removeMessage={removeMessage}
        handleAddImage={handleAddImage}
        handleSendAttachments={handleSendAttachments}
      />
    </div>
  );
}
