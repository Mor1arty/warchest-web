import produce from 'immer';
import { GameState, GameAction, MovePayload, AttackPayload, DeployPayload, GameActionType, ServerActionType } from '../types/game';
import { handleUnitMove, handleUnitAttack, handleUnitDeploy } from '../utils/gameUtils';

export function gameReducer(state: GameState, action: GameAction): GameState {    
  return produce(state, draft => {
    switch (action.type) {
      case ServerActionType.UpdateGameState:
        if (action.payload.gameState) {
          return action.payload.gameState;
        }
        return draft;

      case GameActionType.Move:
      case GameActionType.Attack:
      case GameActionType.Deploy:
        switch (action.type) {
          case GameActionType.Move:
            handleUnitMove(draft, action.payload as MovePayload);
            break;
          case GameActionType.Attack:
            handleUnitAttack(draft, action.payload as AttackPayload);
            break;
          case GameActionType.Deploy:
            handleUnitDeploy(draft, action.payload as DeployPayload);
            break;
        }
        break;
    }
  });
}
