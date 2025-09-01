import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import GeneralProfileCard from '@/components/GeneralProfileCard';
import Loading from '@/components/Loading';
import SearchInput from '@/components/SearchInput';
import useSearchUser from '@/hooks/useSearchUser';

import uniqueId from '@/helpers/unique-id';
import { addConversation, setActiveConversation } from '@/store/chat-slice';

const SearchUser = ({ onClose, className }) => {
  const [search, setSearch] = useState('');
  const conversations = useSelector((state) => state.conversations);
  const dispatch = useDispatch();
  const [searchUser, loading] = useSearchUser(search);

  function handleClick(user) {
    // find if the conversation already exists
    const conversation = conversations.find((con) => con?.otherUser?._id === user._id);
    if (conversation) {
      dispatch(setActiveConversation(conversation._id || conversation?.clientId));
    }
    // if the conversation is not exists make a temporary conversation with temporary ID
    else {
      const newConversation = {
        clientId: uniqueId(), // Temporary ID
        type: 'individual',
        otherUser: user,
        // status: 'optimistic-creating',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: null,
        lastMessageSender: null,
        lastMessageTimestamp: new Date().toISOString(),
      };
      dispatch(addConversation(newConversation));
      dispatch(setActiveConversation(newConversation.clientId));
    }
    //close the search modal
    onClose();
  }
  return (
    <div className={`flex w-full flex-col bg-white ${className}`}>
      {/**back button */}
      <header className='flex items-center gap-3 p-2 pb-0'>
        <button onClick={onClose} className='w-max cursor-pointer rounded p-2 hover:bg-slate-200'>
          <IoArrowBack size={24} />
        </button>

        <h2>New chat</h2>
      </header>

      <SearchInput search={search} setSearch={setSearch} />

      {
        //loading spinner
        loading && <Loading className='mt-2' />
      }

      {/**display users */}
      <div className='scrollbar mt-2 w-full overflow-auto bg-white p-2'>
        {/**no user found */}
        {searchUser.length === 0 && !loading && (
          <p className='text-center text-slate-500'>No user found!</p>
        )}

        {searchUser.length > 0 &&
          searchUser.map((user) => {
            return (
              <GeneralProfileCard key={user._id} user={user} onClick={() => handleClick(user)} />
            );
          })}
      </div>
    </div>
  );
};

export default SearchUser;
