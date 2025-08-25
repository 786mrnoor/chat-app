import { useState } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

import AddMemberModal from '@/components/AddMemberModal';
import GeneralProfileCard from '@/components/GeneralProfileCard';

import AddMemberButton from './AddMemberButton';
import GroupImage from './GroupImage';
import Header from './Header';
import useGroupCreater from './useGroupCreater';

export default function Index({ onClose, className }) {
  const [createGroup, loading] = useGroupCreater(onClose);
  const [data, setData] = useState({
    image: null,
    imageUrl: '',
    name: '',
    description: '',
    members: [],
  });
  const [openMemberModal, setOpenMemberModal] = useState(false);
  function handleAddImage(e) {
    let image = e.target.files[0];

    if (image?.type?.startsWith('image/')) {
      setData((prev) => ({ ...prev, image, imageUrl: URL.createObjectURL(image) }));
    }
  }
  function handleOnChange(e) {
    let { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  }
  function handleModalClose(users) {
    if (Array.isArray(users)) {
      setData((prev) => ({ ...prev, members: users }));
    }
    setOpenMemberModal(false);
  }

  return (
    <div className={`flex w-full flex-col bg-white ${className}`}>
      <Header onClose={onClose} />

      <main className='scrollbar flex flex-col items-center gap-3 overflow-auto p-3'>
        <GroupImage setImage={handleAddImage} imageUrl={data.imageUrl} />

        <input
          type='text'
          placeholder='Group name'
          className='w-full border-b-2 border-slate-300 p-2 outline-0 focus:border-primary'
          id='name'
          value={data.name}
          onChange={handleOnChange}
          autoComplete='off'
        />
        <input
          type='text'
          placeholder='Group description (optional)'
          className='w-full border-b-2 border-slate-300 p-2 outline-0 focus:border-primary'
          id='description'
          value={data.description}
          onChange={handleOnChange}
          autoComplete='off'
        />

        <h2 className='mt-4 w-full text-neutral-600'>{data.members.length} Members</h2>
        <div className='w-full'>
          <AddMemberButton onClick={() => setOpenMemberModal(true)} />
          {data.members.map((user) => (
            <GeneralProfileCard key={user._id} user={user} onClick={() => {}} />
          ))}
        </div>
        <button
          onClick={() => createGroup(data)}
          disabled={!data.name || loading}
          className='sticky bottom-0 mt-2 cursor-pointer rounded-full bg-primary p-1 text-white disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-slate-400'
        >
          <IoMdCheckmark size={40} />
        </button>
      </main>
      {openMemberModal && <AddMemberModal onClose={handleModalClose} members={data.members} />}
    </div>
  );
}
