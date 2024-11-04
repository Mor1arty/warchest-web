
import { GameAction, GameState } from '../../types/game';
import { isPositionInBoard, calculateDistance } from '../../utils/positionUtils';
import { getUnitAttackRange } from '../../utils/unitUtils';

export function validateAttack(action: GameAction, gameState: GameState): boolean {
    if (!isPositionInBoard(action.payload.attackerPosition, gameState.board.size)) return false;
    if (!isPositionInBoard(action.payload.targetPosition, gameState.board.size)) return false;

    const attackerUnit = gameState.units[action.payload.attackerId];
    if (!attackerUnit) return false;

    const targetUnit = gameState.units[action.payload.targetId];
    if (!targetUnit) return false;
  
    if (attackerUnit.owner !== gameState.currentPlayer) return false;
  
    const distance = calculateDistance(action.payload.attackerPosition, action.payload.targetPosition);
    const maxAttackRange = getUnitAttackRange(attackerUnit.type);
    if (distance > maxAttackRange) return false;

    return true;
}