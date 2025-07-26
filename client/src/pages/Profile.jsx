import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Avatar from '@/components/Avatar';
import Divider from '@/components/Divider';
import Loading from '@/components/Loading';

import reduceImage from '@/helpers/reduce-image';
import authAxios from '@/lib/auth-axios';
import { updateUser } from '@/store/chat-slice';

function Profile() {
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
        [name]: value,
      };
    });
  };
  // This function handles the photo upload
  async function handleUploadPhoto(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      setUploading(true);
      const { file: reducedFile } = await reduceImage(URL.createObjectURL(file), file.type);
      const formData = new FormData();
      formData.append('profilePic', reducedFile);

      const { data } = await authAxios.post('/api/users/profilePic', formData);

      dispatch(
        updateUser({
          userId: user._id,
          profileUrl: data.profileUrl,
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }
  // This function handles the other profile updates
  // such as name
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.patch('/api/users', data);

      if (response.data?.success) {
        toast.success(response.data?.message);
        dispatch(
          updateUser({
            userId: user._id,
            name: response.data?.user?.name,
          })
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
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
