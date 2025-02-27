import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(url, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return socket;
};
