import { GameAction, GameState, GameActionType } from '../types/game';
import { validateMove } from './rules/moveRules';
import { validateAttack } from './rules/attackRules';

export class ActionValidator {
  static validate(action: GameAction, gameState: GameState): boolean {
    // 通用验证（比如检查是否是玩家的回合）
    if (!this.validateGeneral(action, gameState)) {
      return false;
    }

    // 根据动作类型进行具体验证
    switch (action.type) {
      case GameActionType.Move:
        return validateMove(action, gameState);
      case GameActionType.Attack:
        return validateAttack(action, gameState);
      // ... 其他动作验证
      default:
        return false;
    }
  }

  private static validateGeneral(action: GameAction, gameState: GameState): boolean {
    // 实现通用验证逻辑
    return true;
  }
}