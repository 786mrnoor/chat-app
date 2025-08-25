import { useEffect, useRef, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { IoMdCheckmark } from 'react-icons/io';

import useSearchUser from '@/hooks/useSearchUser';

import GeneralProfileCard from './GeneralProfileCard';
import Loading from './Loading';
import SearchInput from './SearchInput';

function AddMemberModal({ onClose, members = [] }) {
  const dialogRef = useRef(null);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(members); //[{users}]
  const [users, loading] = useSearchUser(search);

  function handleSelectUser(userId) {
    const user = users.find((user) => user._id === userId);
    if (user) {
      setSelectedUsers((prev) => {
        if (prev.find((u) => u?._id === user?._id)) {
          return prev.filter((u) => u?._id !== user?._id);
        } else {
          return [...prev, user];
        }
      });
    }
  }

  function handleCloseModal() {
    onClose(selectedUsers);
  }
  // Effect to open the dialog when the component mounts.
  useEffect(() => {
    let dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
  }, []);

  return (
    <dialog
      onClose={onClose}
      closedby='any'
      ref={dialogRef}
      className={`m-auto flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-white p-4 text-black shadow-lg backdrop:bg-black/50`}
    >
      <header className='flex w-full items-center gap-2'>
        <button
          onClick={handleCloseModal}
          className='transition-rotate mb-auto flex h-11 w-11 cursor-pointer items-center justify-center self-start rounded-full focus-within:outline-2 focus-within:outline-primary hover:bg-slate-200'
        >
          <FaXmark size={20} className='text-black/80' />
        </button>
        <h2>Add Member</h2>
      </header>
      <SearchInput search={search} setSearch={setSearch} />
      <main className='scrollbar flex w-full flex-col overflow-y-auto px-1'>
        {
          //loading spinner
          loading && <Loading className='mt-2' />
        }

        {users.length > 0 ? (
          users.map((user) => (
            <GeneralProfileCard
              key={user._id}
              user={user}
              className={selectedUsers.find((u) => u?._id === user?._id) ? 'selected' : ''}
              onClick={() => handleSelectUser(user?._id)}
            />
          ))
        ) : (
          <p className='text-center text-slate-500'>No users found</p>
        )}
      </main>
      <footer className='flex w-full justify-center'>
        <button
          onClick={handleCloseModal}
          // disabled={}
          className='mt-2 cursor-pointer rounded-full bg-primary p-1 text-white disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-slate-400'
        >
          <IoMdCheckmark size={40} />
        </button>
      </footer>
    </dialog>
  );
}

export default AddMemberModal;
