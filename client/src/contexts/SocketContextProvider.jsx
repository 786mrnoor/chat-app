import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import SocketContext from './SocketContext';

export default function SocketProvider({ children }) {
  const [socketConnection, setSocketConnection] = useState(null);
  const user = useSelector((state) => state.user);

  // connect socket when there is a userId
  useEffect(() => {
    if (!user?._id) return;

    let socket = io({
      auth: {
        token: user?.token,
      },
    });
    setSocketConnection(socket);

    return () => {
      socket.disconnect();
      setSocketConnection(null);
    };
  }, [user?._id, user?.token]);

  return <SocketContext value={socketConnection}>{children}</SocketContext>;
}
