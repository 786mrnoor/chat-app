import { IoSearchOutline } from 'react-icons/io5';

import debounce from '@/helpers/debounce';

export default function Input({ search, setSearch }) {
  return (
    <div className='relative p-2'>
      <input
        type='text'
        placeholder='Search user by name or email'
        className='w-full rounded-full border-2 border-transparent bg-slate-100 px-4 py-2 pr-8 outline-none hover:border-slate-200 focus:border-primary'
        onChange={debounce((e) => setSearch(e.target.value), 400)}
        defaultValue={search}
      />
      <div className='pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center'>
        <IoSearchOutline size={25} className='text-slate-500' />
      </div>
    </div>
  );
}
