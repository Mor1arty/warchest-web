import React, { useState, useEffect, useRef, Dispatch } from 'react';
import { Position, GameState, ServerActionType, GameActionType, GameAction, MovePayload } from '../../types/game';
import { boardToAxial } from '../../utils/positionUtils';
import { GameWebSocket } from '../../services/websocket';

interface HexProps {
  position: Position;
  onClick: () => void;
  radius: number;
}

const Hexagon: React.FC<HexProps> = ({ position, onClick, radius }) => {
  const width = radius * 2;
  const height = radius * 2 * Math.sqrt(3) / 2;
  return (
    <div className="hex-container">
      <div 
        className="hexagon"
        onClick={onClick}
        style={{
          width: `${width}rem`,
          height: `${height}rem`,
        }}
      >
        <div className="hex-content">
          {`${position.q},${position.r},${position.s}`}
        </div>
      </div>
    </div>
  );
};

interface GameBoardProps {
  gameState: GameState;
  dispatch: (action: GameAction) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, dispatch }) => {
  let { qSize, rSize, sSize } = gameState.board.size;
  const [radius, setRadius] = useState(2.8);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateRadius = () => {
      if (boardRef.current) {
        const height = boardRef.current.clientHeight;
        const hexHeight = height / 14 / 16;
        const newRadius = hexHeight / Math.sqrt(3) * 2;
        setRadius(newRadius);
      }
    }

    updateRadius();
    const resizeObserver = new ResizeObserver(updateRadius);
    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleHexClick = (position: Position) => {
    console.log('点击位置:', position);
    const ws = GameWebSocket.getInstance();
    const action = {
      type: ServerActionType.UpdateGameState,
      payload: {}
    };
    ws.sendMessage(action);
  };

  // 生成六边形网格的坐标
  const generateHexPositions = (): Position[] => {
    const positions: Position[] = [];
    
    for (let q = -qSize; q <= qSize; q++) {
      for (let r = -rSize; r <= rSize; r++) {
        const s = -q - r;
        if (Math.abs(s) <= sSize) {
          positions.push({ q, r, s });
        }
      }
    }
    
    return positions;
  };

  // 计算六边形的偏移位置 (flat-topped)
  const getHexPosition = (pos: Position, radius: number) => {
    const offset = -radius;  // 偏移量，保持六边形中心在网格中心
    const x = (-1.5 * radius * pos.r - 1.5 * radius * pos.s) + offset;
    const y = (radius * pos.r - radius * pos.s) * Math.sqrt(3) / 2 + offset + 0.4; 
    return { x, y };
  };

  const positions = generateHexPositions();

  return (
    <div ref={boardRef} className="flex flex-col items-center justify-center h-full">
      <div className="hex-grid relative">
        {positions.map((pos) => {
          const { x, y } = getHexPosition(pos, radius);
          return (
            <div
              key={`${pos.q},${pos.r},${pos.s}`}
              className="absolute"
              style={{
                transform: `translate(${x}rem, ${y}rem)`
              }}
            >
              <Hexagon
                position={pos}
                onClick={() => handleHexClick(pos)}
                radius={radius}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;
