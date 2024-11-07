import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameRoom } from '../types/room';

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<GameRoom | null>(null);

  // 获取房间信息
  useEffect(() => {
    // TODO: 实现获取房间信息的逻辑
  }, [roomId]);

  // 离开房间
  const handleLeaveRoom = () => {
    // TODO: 实现离开房间的逻辑
    navigate('/');
  };

  // 开始游戏
  const handleStartGame = async () => {
    // TODO: 实现开始游戏的逻辑
    // const gameId = await startGame(roomId);
    // navigate(`/game/${gameId}`);
  };

  if (!room) {
    return <div>加载中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">房间: {room.name}</h1>
        <div className="space-x-4">
          <button 
            onClick={handleLeaveRoom}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            离开房间
          </button>
          {room.players.length === room.maxPlayers && (
            <button 
              onClick={handleStartGame}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              开始游戏
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        Test
      </div>
    </div>
  );
};

export default Room;
