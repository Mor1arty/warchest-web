import { GameAction, GameState } from '../../types/game';
import { calculateDistance, isPositionInBoard } from '../../utils/positionUtils';
import { getUnitMoveRange } from '../../utils/unitUtils';

export function validateMove(action: GameAction, gameState: GameState): boolean {
  if (!isPositionInBoard(action.payload.to, gameState.board.size)) return false;
  
  const unit = gameState.units[action.payload.unitId];
  if (!unit) return false;

  if (unit.owner !== gameState.currentPlayer) return false;

  const distance = calculateDistance(action.payload.from, action.payload.to);
  const maxMoveRange = getUnitMoveRange(unit.type);
  if (distance > maxMoveRange) return false;

  return true;
}