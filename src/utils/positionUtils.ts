import { Position, BoardSize } from '../types/game';

export const positionToString = (pos: Position): string => {
  return `${pos.q},${pos.r},${pos.s}`;
};

export const stringToPosition = (str: string): Position => {
  const [q, r, s] = str.split(',').map(Number);
  return { q, r, s };
};

export const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.max(
    Math.abs(pos1.q - pos2.q),
    Math.abs(pos1.r - pos2.r),
    Math.abs(pos1.s - pos2.s)
  );
};

export const isPositionInBoard = (
  position: Position,
  boardSize: BoardSize
): boolean => {
  const { q, r, s } = position;
  return (
    Math.abs(q) <= boardSize.qSize &&
    Math.abs(r) <= boardSize.rSize &&
    Math.abs(s) <= boardSize.sSize
  );
};

export const validateCoordinateSum = (position: Position): boolean => {
  return position.q + position.r + position.s === 0;
};

export const getValidBoardPositions = (
    boardSize: BoardSize
): Position[] => {
    const positions: Position[] = [];
    for (let q = -boardSize.qSize; q <= boardSize.qSize; q++) {
        for (let r = -boardSize.rSize; r <= boardSize.rSize; r++) {
            for (let s = -boardSize.sSize; s <= boardSize.sSize; s++) {
                positions.push({ q, r, s });
            }
        }
    }
    return positions;
}

// 从棋盘的x,y坐标转换到立方坐标(q,r,s)
export function boardToAxial(x: number, y: number): Position {
  // 假设中心点(boardSize/2, boardSize/2)对应q=0,r=0
  const boardSize = 8;
  const centerX = Math.floor(boardSize / 2);
  const centerY = Math.floor(boardSize / 2);
  
  // 转换到以中心为原点的坐标
  const offsetX = x - centerX;
  const offsetY = y - centerY;
  
  // 转换到立方坐标
  const q = offsetX;
  const r = offsetY - Math.floor(offsetX / 2);
  const s = -q - r;  // 立方坐标满足 q + r + s = 0
  
  return { q, r, s };
}

// 从立方坐标(q,r,s)转换回棋盘的x,y坐标
export function axialToBoard(position: Position): { x: number, y: number } {
  const boardSize = 8;
  const centerX = Math.floor(boardSize / 2);
  const centerY = Math.floor(boardSize / 2);
  
  const x = position.q + centerX;
  const y = position.r + Math.floor(position.q / 2) + centerY;
  
  return { x, y };
}