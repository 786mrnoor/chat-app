import { FaPlus, FaXmark } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';

export default function Footer({
  messages,
  index,
  setIndex,
  removeMessage,
  handleAddImage,
  handleSendAttachments,
}) {
  return (
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
        onClick={handleSendAttachments}
        className='mt-2 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary hover:bg-secondary lg:h-16 lg:w-16'
      >
        <IoMdSend size={24} className='ml-1 text-white' />
      </button>
    </div>
  );
}
