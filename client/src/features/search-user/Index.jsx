import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';
import { IoSearchOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '@/components/Loading';

import debounce from '@/helpers/debounce';
import authAxios from '@/lib/auth-axios';
import { setActiveConversation, startNewIndividualChat } from '@/store/chat-slice';

import UserSearchCard from './UserSearchCard';

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const conversations = useSelector((state) => state.conversations);
  const dispatch = useDispatch();

  useEffect(() => {
    let ignore = false;
    const handleSearchUser = async () => {
      try {
        setLoading(true);
        const response = await authAxios.get(`/api/users/search/?name=${search.trim()}`);
        if (!ignore) {
          setSearchUser(response.data.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    handleSearchUser();

    return () => {
      ignore = true; // cleanup function to prevent state update on unmounted component
    };
  }, [search]);

  function handleClick(user) {
    // find if the conversation already exists
    const conversation = conversations.find((con) => con?.otherUser?._id === user._id);
    if (conversation) {
      dispatch(setActiveConversation(conversation._id));
    }
    // if the conversation is not exists make a temporary conversation with temporary ID
    else {
      dispatch(startNewIndividualChat(user));
    }
    //close the search modal
    onClose();
  }
  return (
    <div className='absolute top-0 bottom-0 left-full z-2 flex w-[calc(100vw-100%)] flex-col bg-white sm:w-[22rem] lg:w-[24rem]'>
      {/**back button */}
      <button
        onClick={onClose}
        className='m-2 mb-0 w-max cursor-pointer rounded p-2 hover:bg-slate-200'
      >
        <IoArrowBack size={24} />
      </button>

      {/**input*/}
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

      {
        //loading spinner
        loading && <Loading className='mt-2' />
      }

      {/**display users */}
      <div className='scrollbar mt-2 w-full overflow-auto bg-white p-2'>
        {/**no user found */}
        {searchUser.length === 0 && !loading && (
          <p className='text-center text-slate-500'>no user found!</p>
        )}

        {searchUser.length > 0 &&
          searchUser.map((user) => {
            return <UserSearchCard key={user._id} user={user} onClick={() => handleClick(user)} />;
          })}
      </div>
    </div>
  );
};

export default SearchUser;
