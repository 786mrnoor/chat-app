import axios from 'axios';
import { useActionState } from 'react';
import toast from 'react-hot-toast';
import { PiUserCircle } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router';

import formDataToJson from '@/helpers/form-data-to-json';

export default function CheckEmailPage() {
  const [data, formAction, pending] = useActionState(handleSubmit, {
    email: '',
  });
  const navigate = useNavigate();

  async function handleSubmit(previousState, formData) {
    let data = formDataToJson(formData);
    if (pending) {
      return data;
    }
    try {
      const response = await axios.get(`/api/users/check-email?email=${data.email}`);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/password', {
          state: response?.data?.user,
        });
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
        <div className='mx-auto mb-2 w-fit'>
          <PiUserCircle className='fill-primary' size={80} />
        </div>

        <h3 className='text-center'>Welcome to Chat app!</h3>

        <form className='mt-3 grid gap-4' action={formAction} autoComplete='off'>
          <div>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='enter your email'
              className='form-control'
              defaultValue={data.email}
              required
            />
          </div>

          <button disabled={pending} type='submit' className='form-button'>
            Next
          </button>
        </form>

        <p className='my-3 text-center'>
          New User ?{' '}
          <Link to='/register' className='font-semibold hover:text-primary'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
