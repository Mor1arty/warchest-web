// src/pages/Game.tsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../../hooks/useGame';
import GameBoard from './Board';
import PlayerInfo from './PlayerInfo';
import { GameWebSocket } from '../../services/websocket';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/auth';
import GameStatusBar from './GameStatusBar';

const Game: React.FC = () => {
  const { gameState, dispatch } = useGame();
  const navigate = useNavigate();

  // 初始化 WebSocket 连接
  useEffect(() => {
    const authService = AuthService.getInstance();
    const token = authService.getToken();

    if (!token) {
      navigate('/login');
      return;
    }

    const websocket = GameWebSocket.getInstance();
    websocket.initialize(dispatch, token);
  }, [dispatch, navigate]);

  return (
    <div className="game-container h-screen flex flex-col bg-gray-100">
      <GameStatusBar 
        currentTurn={gameState.currentTurn.toString()}
        score={{
          player1: gameState.players[0]?.supply?.length || 0,
          player2: gameState.players[1]?.supply?.length || 0
        }}
        maxScore={6}
        initiative={gameState.initiative}
      />
      
      <div className="player-area h-[20vh] p-4 flex justify-center items-center">
        <div className="w-auto">
          <PlayerInfo 
            player={gameState.players[1]}
            position="top"
            selectedUnit={null}
          />
        </div>
      </div>

      <div className="board-area flex-grow">
        <GameBoard 
          gameState={gameState}
          dispatch={dispatch}
        />
      </div>

      <div className="player-area h-[20vh] p-4 flex justify-center items-center">
        <div className="w-auto">
          <PlayerInfo 
            player={gameState.players[0]}
            position="bottom"
            selectedUnit={null}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Game);