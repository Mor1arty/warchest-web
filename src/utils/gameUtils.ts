import { GameState, MovePayload, AttackPayload, DeployPayload, Team, GameStage, CellType, UnitStatus } from "../types/game";
import { positionToString } from "./positionUtils";


// 处理移动
export function handleUnitMove(draft: GameState, payload: MovePayload) {
  // 直接修改单位位置
  const unit = draft.units[payload.unitId];
  if (!unit.position) {
    throw new Error('Unit position is undefined');
  }
  if (unit.status !== UnitStatus.OnBoard) {
    throw new Error('Unit is not on board');
  }
  const cellType = draft.board.cells[positionToString(unit.position)]?.cellType;
  if (!cellType) {
    throw new Error('Cell type is undefined');
  }
  delete draft.board.cells[positionToString(unit.position)];

  unit.position = payload.to;
  draft.board.cells[positionToString(payload.to)] = {
    unitId: payload.unitId,
    cellType,
  };
  
  // 更新行动点
  draft.actionPoints[unit.owner]--;
}

// 处理攻击
export function handleUnitAttack(draft: GameState, payload: AttackPayload) {
}

// 处理部署
export function handleUnitDeploy(draft: GameState, payload: DeployPayload) {
}