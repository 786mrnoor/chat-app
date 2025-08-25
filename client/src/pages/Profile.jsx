import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Avatar from '@/components/Avatar';
import Divider from '@/components/Divider';
import Loading from '@/components/Loading';

import { reduceChatAvatar } from '@/helpers/reduce-image';
import { updateUser } from '@/store/chat-slice';

import { useSocket } from '../contexts/SocketContext';
import { getSignatureWithFormData } from '../lib/cloudinary';

function Profile() {
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({
    name: user?.name || '',
  });
  const dispatch = useDispatch();

  // This useEffect is to set the name in the state
  useEffect(() => {
    setData((prev) => {
      return {
        ...prev,
        name: user?.name || '',
      };
    });
  }, [user?.name]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value.toUpperCase(),
      };
    });
  };
  // This function handles the photo upload
  async function handleUploadPhoto(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      setUploading(true);
      //reduce image
      const reducedImage = await reduceChatAvatar(URL.createObjectURL(file), file.type);
      URL.revokeObjectURL(file);

      // get signature
      const [formData, uploadUrl] = await getSignatureWithFormData('user-avatar', user._id);

      formData.append('file', reducedImage);
      //upload group photo
      const { data: uploadResponse } = await axios.post(uploadUrl, formData);

      const emitRes = await socket.timeout(10000).emitWithAck('user:update-details', {
        userId: user?._id,
        profileUrl: uploadResponse.secure_url,
      });

      if (emitRes.error) throw new Error(emitRes.message);
      dispatch(
        updateUser({
          userId: user?._id,
          profileUrl: uploadResponse.secure_url,
        })
      );
      toast.success('Profile picture updated successfully');
      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile picture');
      setUploading(false);
    }
  }
  // This function handles the other profile updates
  // such as name
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await socket.timeout(10000).emitWithAck('user:update-details', {
        userId: user._id,
        name: data.name,
      });

      if (res.error) {
        throw new Error(res.message);
      }

      toast.success('Name updated successfully');
      dispatch(
        updateUser({
          userId: user._id,
          name: res.name,
        })
      );
    } catch (error) {
      console.error(error);
      toast.error(error || error.message || 'Failed to update name');
    }
  };

  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center bg-black/50'>
      <div className='m-1 w-full max-w-sm rounded bg-white p-4 py-6'>
        <h2 className='font-semibold'>Profile Details</h2>
        <Divider />
        <form className='mt-3 grid gap-3' onSubmit={handleSubmit}>
          <div className='my-1 flex flex-col items-center'>
            <Avatar size={100} user={user} />
            <label
              htmlFor='profilePic'
              className='mt-1 cursor-pointer rounded px-4 text-sm text-primary outline outline-primary transition-all hover:bg-primary hover:text-white'
            >
              Edit
              <input
                type='file'
                id='profilePic'
                name='profilePic'
                className='hidden'
                accept='image/*'
                onChange={handleUploadPhoto}
              />
            </label>
          </div>

          <div>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.name}
              onChange={handleOnChange}
              className='mt-1 w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-primary'
            />
          </div>

          <Divider />
          <div className='ml-auto flex w-fit gap-2'>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='cursor-pointer rounded border border-primary px-4 py-1 text-primary hover:bg-primary hover:text-white'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='cursor-pointer rounded border border-primary bg-primary px-4 py-1 text-white hover:bg-secondary'
            >
              Save
            </button>
          </div>
        </form>
        {uploading && (
          <div className='fixed top-0 right-0 bottom-0 left-0 z-11 flex items-center justify-center bg-black/50'>
            <div className='m-1 rounded bg-white p-6'>
              <Loading />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
