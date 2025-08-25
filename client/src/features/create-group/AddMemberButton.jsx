import { FaUserPlus } from 'react-icons/fa';

export default function AddMemberButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-slate-600 hover:bg-neutral-100 focus:ring-2 focus:ring-primary focus:outline-none'
    >
      <div className='flex items-center justify-center rounded-full bg-primary p-3 text-white'>
        <FaUserPlus size={30} />
      </div>
      <span>Add/Edit Member</span>
    </button>
  );
}
