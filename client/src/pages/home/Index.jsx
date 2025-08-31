import { Provider } from 'react-redux';

import SocketProvider from '@/features/socket/SocketContextProvider.jsx';

import { store } from '@/store/store';

import Home from './Home.jsx';

export default function Index() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <Home />
      </SocketProvider>
    </Provider>
  );
}
