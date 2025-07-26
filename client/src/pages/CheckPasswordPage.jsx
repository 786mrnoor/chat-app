import axios from 'axios';
import { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router';

import Avatar from '@/components/Avatar';

import formDataToJson from '@/helpers/form-data-to-json';

export default function CheckPasswordPage() {
  const [data, formAction, pending] = useActionState(handleSubmit, {
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    }
  }, [location?.state?.name, navigate]);

  async function handleSubmit(previousState, formData) {
    let data = formDataToJson(formData);
    if (pending) {
      return data;
    }
    try {
      const response = await axios.post('/api/auth/login', {
        email: location?.state?.email,
        password: data.password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/', { replace: true });
      }
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return data;
    }
  }

  return (
    <div className='mt-5'>
      <div className='mx-auto w-full max-w-md overflow-hidden rounded bg-white p-4'>
        <div className='mx-auto mb-2 flex w-fit flex-col items-center justify-center'>
          <Avatar size={70} name={location?.state?.name} imageUrl={location?.state?.profile_pic} />
          <h2 className='mt-1 text-lg font-semibold'>{location?.state?.name}</h2>
        </div>

        <form className='mt-3 grid gap-4' action={formAction}>
          <div>
            <label htmlFor='password' className='cursor-pointer'>
              Password :
            </label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='enter your password'
              className='form-control'
              defaultValue={data.password}
              required
            />
          </div>

          <button type='submit' disabled={pending} className='form-button'>
            Login
          </button>
        </form>

        <p className='my-3 text-center'>
          <Link to='/forgot-password' className='font-semibold hover:text-primary'>
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
}
