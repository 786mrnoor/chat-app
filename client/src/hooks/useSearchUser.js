import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import authAxios from '@/lib/auth-axios';

export default function useSearchUser(search) {
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);

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

  return [searchUser, loading];
}
