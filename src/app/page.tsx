'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket'; // Certifique-se de que este hook está implementado

export default function Home() {
  const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<{ senderId: string; text: string }[]>([]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (message: { senderId: string; text: string }) => {
        setMessages((prev) => [...prev, message]);
      };

      socket.on('chat message', handleMessage);

      return () => {
        socket.off('chat message', handleMessage);
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      socket.emit('chat message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen p-6">
      <div className="flex flex-col h-full bg-gray-100 rounded-xl">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.senderId === socket?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                  msg.senderId === socket?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                {msg.text}
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
