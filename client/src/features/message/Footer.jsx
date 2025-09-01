import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import AttchmentUpload from '../attachments/Index';

import AttachmentMenu from './AttachmentMenu';
import Input from './Input';

const MESSAGE = {
  type: 'text',
  content: '',
  files: null, //FileList
};
export default function Footer() {
  const [message, setMessage] = useState(MESSAGE);

  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  function handleAttachmentSelect(type, files) {
    setShowAttachmentMenu(false);
    if (files.length === 0) return;
    setMessage((prev) => ({ ...prev, type, files }));
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

      <Input message={message} setMessage={setMessage} onReset={() => setMessage(MESSAGE)} />

      {message.type !== 'text' && (
        <AttchmentUpload
          message={message}
          onClose={(content) => setMessage({ ...MESSAGE, content: content || '' })} // reset the message
        />
      )}
    </section>
  );
}
