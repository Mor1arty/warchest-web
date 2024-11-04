// src/pages/Game.tsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../../hooks/useGame';
import GameBoard from './Board';
import PlayerInfo from './PlayerInfo';
import { GameWebSocket } from '../../services/websocket';
import { ServerActionType } from '../../types/game';

const Game: React.FC = () => {
  const { gameState, dispatch } = useGame();
  const [key, forceUpdate] = useState(0);

  // 初始化 WebSocket 连接
  useEffect(() => {
    const websocket = GameWebSocket.getInstance();
    const cleanup = websocket.initialize((message) => {
      // 根据服务器消息类型更新游戏状态
      console.log('WebSocket收到消息:', { ...message.payload });
      if (message.type === ServerActionType.UpdateGameState) {
        console.log('dispatch:', { ...message.payload });
        dispatch({
          type: ServerActionType.UpdateGameState,
          payload: { ...message.payload }
        });
      }
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [dispatch]);

  // // 监听状态变化并强制更新
  // useEffect(() => {
  //   console.log('Game component received new state:', gameState);
  //   forceUpdate(prev => prev + 1);
  // }, [gameState]);

  return (
    <div key={key} className="game-container h-screen flex flex-col bg-gray-100">
      <div className="player-area p-4">
        <PlayerInfo 
          key={`player1-${key}`}
          player={gameState.players[1]}
          position="top"
          showHand={false}
          selectedUnit={null}
        />
      </div>

      <div className="board-area flex-grow">
        <GameBoard 
          key={`board-${key}`}
          gameState={gameState}
          dispatch={dispatch}
        />
      </div>

      <div className="player-area p-4">
        <PlayerInfo 
          key={`player0-${key}`}
          player={gameState.players[0]}
          position="bottom"
          showHand={true}
          selectedUnit={null}
        />
      </div>
    </div>
  );
};

export default React.memo(Game);