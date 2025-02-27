'use client';

import { useSocket } from '@/hooks/useSocket';
import { use, useEffect, useState } from 'react';

export default function Home() {
  const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (msg: string) => {
        setMessages((prev) => [...prev, msg]);
      };

      socket.on('chat message', handleMessage);

      return () => {
        socket.off('chat message', handleMessage);
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit('chat message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen p-6">
      <div className="flex flex-col h-full bg-gray-100 rounded-xl">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 flex justify-end`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg shadow bg-blue-500 text-white`}>
                {msg}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4 flex">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-1 border rounded-lg px-4 py-2 mr-2 focus:outline-none focus:border-blue-500 text-black"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={sendMessage}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
