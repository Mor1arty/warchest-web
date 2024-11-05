import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GameWebSocket } from '../../services/websocket';

interface GameStatusBarProps {
  currentTurn: string;
  score: { player1: number, player2: number };
  maxScore: number;
  initiative: string;
}

const GameStatusBar: React.FC<GameStatusBarProps> = ({ currentTurn, score, maxScore, initiative }) => {
  return (
    <div className="w-full px-4 py-2 flex justify-between items-center bg-white shadow-sm">
      <button 
        onClick={() => {
            const ws = GameWebSocket.getInstance();
            ws.sendMessage({ type: 'LEAVE_ROOM', payload: {} });
        }}
        className="flex items-center text-gray-600 hover:text-gray-800"
      >
        <span className="material-icons mr-1">arrow_back</span>
        Back
      </button>

      <div className="flex items-center space-x-4">
        <span>{score.player1} / {maxScore}</span>
        <span className="text-gray-500">{currentTurn}'s turn</span>
        <span>{score.player2} / {maxScore}</span>
      </div>

      <div className="flex items-center">
        <span className="mr-2">Initiative</span>
        <div className={`w-6 h-6 rounded-full ${initiative ? 'bg-yellow-400' : 'bg-gray-300'}`} />
      </div>
    </div>
  );
};

export default GameStatusBar; 