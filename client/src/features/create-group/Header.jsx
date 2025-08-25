import { IoArrowBack } from 'react-icons/io5';

export default function Header({ onClose }) {
  return (
    <header className='flex items-center gap-3 p-2 pb-0'>
      <button onClick={onClose} className='w-max cursor-pointer rounded p-2 hover:bg-slate-200'>
        <IoArrowBack size={24} />
      </button>

      <h2>New Group</h2>
    </header>
  );
}
