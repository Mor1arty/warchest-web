// src/pages/Game.tsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../../hooks/useGame';
import GameBoard from './Board';
import PlayerInfo from './PlayerInfo';
import { GameWebSocket } from '../../services/websocket';

const Game: React.FC = () => {
  const { gameState, dispatch } = useGame();

  // 初始化 WebSocket 连接
  useEffect(() => {
    const websocket = GameWebSocket.getInstance();
    websocket.initialize(dispatch);
  }, [dispatch]);

  return (
    <div className="game-container h-screen flex flex-col bg-gray-100">
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