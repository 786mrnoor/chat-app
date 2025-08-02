import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';

import SocketContext from './SocketContext';

export default function SocketProvider({ children }) {
  const [socketConnection, setSocketConnection] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // connect socket when there is a userId
  useEffect(() => {
    if (!user?._id) return;

    let socket = io();

    function onError(err) {
      console.error(err.message);
      if (err.data?.status === 401) {
        navigate('/email');
      }
    }
    socket.on('connect_error', onError);

    setSocketConnection(socket);

    return () => {
      socket.off('connect_error', onError);
      socket.disconnect();
      setSocketConnection(null);
    };
  }, [user?._id, navigate]);

  return <SocketContext value={socketConnection}>{children}</SocketContext>;
}
