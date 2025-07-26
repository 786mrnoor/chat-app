import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import authAxios from '@/lib/auth-axios';
import { setUser } from '@/store/chat-slice';

export default function useUserEffect() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use a ref to store the interceptor ID so we can eject it later
  const interceptorId = useRef(null);

  // 1. Add the response interceptor when the component mounts
  // This will handle 401/403 redirects globally
  useEffect(() => {
    interceptorId.current = authAxios.interceptors.response.use(
      (response) => response, // Just pass successful responses
      (error) => {
        // Check if the error is due to authentication
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn('Authentication error:', error.response.data.message);
          // Clear authentication state
          dispatch(setUser(null));
          // Redirect to login page, but only if not already on it
          if (window.location.pathname !== '/email') {
            // alert('Your session has expired or is invalid. Please log in again.');
            navigate('/email');
          }
        }
        return Promise.reject(error); // Re-throw the error so downstream .catch() blocks still work
      }
    );

    // Eject the interceptor when the component unmounts to prevent memory leaks
    return () => {
      authAxios.interceptors.response.eject(interceptorId.current);
    };
  }, [navigate, dispatch]);

  // 2. get the current user details when the component mounts
  // This will also trigger the interceptor if the user is not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to access a protected route to verify current token status
        // This call will also be handled by the interceptor if it fails with 401/403
        const { data } = await authAxios.get('/api/auth/me');
        dispatch(setUser(data));
      } catch (error) {
        // No need to explicitly redirect here, the interceptor will handle it
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, [dispatch]);
}
