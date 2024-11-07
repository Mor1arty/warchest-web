import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';
import { GameRoom } from '../types/room';

const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const navigate = useNavigate();

  // 使用 useWebSocket 订阅消息
  const sendMessage = useWebSocket((message) => {
    // 处理服务器返回的消息
    if (message.type === 'JOIN_ROOM') {
      // 触发之前存储的 resolve 函数
      if (createRoomPromiseResolve.current) {
        createRoomPromiseResolve.current(message.payload.roomId);
        createRoomPromiseResolve.current = null;
      }
    }
  });

  // 存储 Promise 的 resolve 函数
  const createRoomPromiseResolve = useRef<((roomId: string) => void) | null>(null);

  const createRoom = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 存储 resolve 函数，等待服务器响应时调用
      createRoomPromiseResolve.current = resolve;
      
      // 发送创建房间的消息
      sendMessage({
        type: 'CREATE_ROOM',
        payload: {}
      });

      // 设置超时处理
      setTimeout(() => {
        if (createRoomPromiseResolve.current) {
          createRoomPromiseResolve.current = null;
          reject(new Error('创建房间超时'));
        }
      }, 5000); // 5秒超时
    });
  };

  // 获取房间列表
  useEffect(() => {
    // TODO: 实现获取房间列表的逻辑
  }, []);

  // 创建房间
  const handleCreateRoom = async () => {
    try {
      const roomId = await createRoom();
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error('创建房间失败:', error);
      // 处理错误，比如显示错误提示
    }
  };

  // 加入房间
  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  // 快速匹配
  const handleQuickMatch = async () => {
    // TODO: 实现快速匹配的逻辑
    // const roomId = await quickMatch();
    // navigate(`/room/${roomId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">游戏大厅</h1>
        <div className="space-x-4">
          <button 
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            创建房间
          </button>
          <button 
            onClick={handleQuickMatch}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            快速匹配
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div 
            key={room.id} 
            className="border p-4 rounded shadow"
          >
            <h3 className="font-bold">{room.name}</h3>
            <p>玩家数量: {room.players.length}/{room.maxPlayers}</p>
            <button 
              onClick={() => handleJoinRoom(room.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              disabled={room.players.length >= room.maxPlayers}
            >
              加入房间
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lobby;
