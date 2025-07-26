import { Route, Routes } from 'react-router';

import AuthLayout from '@/components/AuthLayout';

import CheckEmailPage from './pages/CheckEmailPage';
import CheckPasswordPage from './pages/CheckPasswordPage';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import RegisterPage from './pages/RegisterPage';
import Index from './pages/home/Index';

const routes = (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/email' element={<CheckEmailPage />} />
      <Route path='/password' element={<CheckPasswordPage />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Route>

    <Route path='/' element={<Index />}>
      <Route path='/profile' element={<Profile />} />
    </Route>
  </Routes>
);
export default routes;
