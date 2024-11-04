import { BoardSize, CellType, GameState, Position, Unit } from '../types/game';
import { positionToString } from './positionUtils';

// 位置控制相关函数
export const getPositionController = (
  gameState: GameState,
  position: Position
): string | undefined => {
  const posKey = positionToString(position);
  return gameState.board.cells[posKey]?.controlledBy;
};

export const isPositionControlledBy = (
  gameState: GameState,
  position: Position,
  playerId: string
): boolean => {
  const controller = getPositionController(gameState, position);
  return controller === playerId;
};

export const updatePositionControl = (
  gameState: GameState,
  position: Position,
  controllingPlayerId: string | undefined
): void => {
  const posKey = positionToString(position);
  const posInfo = gameState.board.cells[posKey] || {};
  gameState.board.cells[posKey] = {
    ...posInfo,
    controlledBy: controllingPlayerId,
    cellType: CellType.ControlPoint
  }
};

// 单位位置相关函数
export const getUnitAtPosition = (
  gameState: GameState,
  position: Position
): Unit | undefined => {
  const posKey = positionToString(position);
  const unitId = gameState.board.cells[posKey]?.unitId;
  return unitId ? gameState.units[unitId] : undefined;
};

export const isPositionOccupied = (
  gameState: GameState,
  position: Position
): boolean => {
  return getUnitAtPosition(gameState, position) !== undefined;
};

export const createBoardSize = (
    qSize: number,
    rSize: number,
    sSize: number
): BoardSize => {
    return { qSize, rSize, sSize };
}