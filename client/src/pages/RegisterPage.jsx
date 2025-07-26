import axios from 'axios';
import { useActionState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import formDataToJson from '@/helpers/form-data-to-json';

export default function RegisterPage() {
  const [data, formAction, pending] = useActionState(handleSubmit, {
    name: '',
    email: '',
    password: '',
    profileUrl: '',
  });

  const navigate = useNavigate();
  async function handleSubmit(previousState, formData) {
    let data = formDataToJson(formData);
    if (pending) {
      return data;
    }
    try {
      const response = await axios.post('/api/auth/register', data);
      if (response.data?.success) {
        toast.success(response.data.message);
        navigate('/email');
      }
      return data;
    } catch (error) {
      console.error('error', error);
      toast.error(error?.response?.data?.message || error?.message);
      return data;
    }
  }

  return (
    <main className='mt-5'>
      <div className='mx-auto w-full max-w-md overflow-hidden rounded bg-white p-4'>
        <h3 className='text-center'>Welcome to Chat app!</h3>

        <form action={formAction} className='mt-5 grid gap-4' autoComplete='off'>
          <div>
            <label htmlFor='name' className='cursor-pointer'>
              Name :
            </label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='enter your name'
              className='form-control'
              defaultValue={data.name}
              required
            />
          </div>

          <div>
            <label htmlFor='email' className='cursor-pointer'>
              Email :
            </label>
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

          <button disabled={pending} type='submit' className='form-button'>
            Register
          </button>
        </form>

        <p className='my-3 text-center'>
          Already have account ?
          <Link to='/email' className='font-semibold hover:text-primary'>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
