import axios from 'axios';
import { useActionState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

import formDataToJson from '@/helpers/form-data-to-json';

export default function ResetPassword() {
  const [data, formAction, pending] = useActionState(handleSubmit, {
    password: '',
  });
  const navigate = useNavigate();
  const { token } = useParams();

  async function handleSubmit(previousState, formData) {
    let data = formDataToJson(formData);
    if (pending) {
      return data;
    }
    try {
      const response = await axios.post(`/api/auth/reset-password/${token}`, {
        password: data.password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/email');
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
        <h2 className='text-center text-2xl'>Reset Password</h2>

        <form className='mt-3 grid gap-4' action={formAction} autoComplete='off'>
          <div>
            <label htmlFor='password'>Enter New Password :</label>
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
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
