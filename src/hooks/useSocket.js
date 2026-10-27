'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    let newSocket;
    try {
      newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      setSocket(newSocket);
    } catch (err) {
      console.warn('Socket connection error:', err);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return socket;
};

export default useSocket;
