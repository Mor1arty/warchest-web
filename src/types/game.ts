export enum GameStage {
  Waiting,
  BanPick,
  Playing,
  Finished,
}

export enum CellType {
  Blocked = "Blocked",
  Normal = "Normal",
  ControlPoint = "ControlPoint",
  Castle = "Castle",
}

export enum UnitStatus {
  InSupply,
  InHand,
  InBag,
  Discarded,
  OnBoard,
  Dead,
}

export enum Team {
  White,
  Black,
}

export interface Player {
    id: string;
    name: string;
    team: Team;  // 玩家队伍
    supply: Unit[];           // 招募区
    hand: Unit[];            // 手牌
    bag: Unit[];             // 袋中的单位
    discardPile: Unit[];     // 弃牌堆
    eliminated: Unit[];      // 死亡区
  }

export interface BoardSize {
    qSize: number;
    rSize: number;
    sSize: number;
}

export interface Position {
  q: number;
  r: number;
  s: number;
}

export interface Unit {
    id: string;
    type: UnitType;         // 单位类型（如：骑士、弓箭手等）
    owner: string;          // 所属玩家ID
    position?: Position;    // 在棋盘上的位置
    status: UnitStatus;  // 单位当前状态
  }

export interface UnitDefinition {
  type: UnitType;
  name: string;
  description: string;
  icon: string;
  moveRange: number;
  movementType: MovementDirectionType;
  attackRange: number;
  attackType: AttackDirectionType;
  abilities: string[];
}

export enum UnitType {
  LightCavalry,
  Archer,
  Swordsman,
  Pikeman,
  Crossbowman,
  Marshal,

  // 特殊单位
  CoinBack
}
export enum MovementDirectionType {
  Straight,
  Flexible,
}
export enum AttackDirectionType {
  Straight,
  Flexible,
}

// 单位定义数据
export const UNIT_DEFINITIONS: Record<UnitType, UnitDefinition> = {
  [UnitType.LightCavalry]: {
    type: UnitType.LightCavalry,
    name: '轻骑兵',
    description: '可以移动两格',
    icon: '/images/wc_unit_coins/light_cavalry.png',
    moveRange: 2,
    movementType: MovementDirectionType.Flexible,
    attackRange: 1,
    attackType: AttackDirectionType.Straight,
    abilities: ['charge']
  },
  [UnitType.Archer]: {
    type: UnitType.Archer,
    name: '弓箭手',
    description: '可以远程攻击',
    icon: '/images/wc_unit_coins/archer.png',
    moveRange: 1,
    movementType: MovementDirectionType.Straight,
    attackRange: 2,
    attackType: AttackDirectionType.Flexible,
    abilities: ['ranged']
  },
  [UnitType.Swordsman]: {
    type: UnitType.Swordsman,
    name: '剑士',
    description: '近战单位',
    icon: '/images/wc_unit_coins/swordsman.png',
    moveRange: 1,
    movementType: MovementDirectionType.Straight,
    attackRange: 1,
    attackType: AttackDirectionType.Straight,
    abilities: ['melee']
  },
  [UnitType.Pikeman]: {
    type: UnitType.Pikeman,
    name: '枪兵',
    description: '长矛兵种',
    icon: '/images/wc_unit_coins/pikeman.png',
    moveRange: 1,
    movementType: MovementDirectionType.Straight,
    attackRange: 1,
    attackType: AttackDirectionType.Straight,
    abilities: ['brace']
  },
  [UnitType.Crossbowman]: {
    type: UnitType.Crossbowman,
    name: '弩手',
    description: '强力远程单位',
    icon: '/images/wc_unit_coins/crossbowman.png',
    moveRange: 1,
    movementType: MovementDirectionType.Straight,
    attackRange: 2,
    attackType: AttackDirectionType.Straight,
    abilities: ['pierce']
  },
  [UnitType.Marshal]: {
    type: UnitType.Marshal,
    name: '元帅',
    description: '指挥官单位',
    icon: '/images/wc_unit_coins/marshal.png',
    moveRange: 1,
    movementType: MovementDirectionType.Straight,
    attackRange: 1,
    attackType: AttackDirectionType.Straight,
    abilities: ['command']
  },
  [UnitType.CoinBack]: {
    type: UnitType.CoinBack,
    name: '不可见',
    description: '不可见单位',
    icon: '/images/wc_unit_coins/coin_back.png',
    moveRange: 0,
    movementType: MovementDirectionType.Straight,
    attackRange: 0,
    attackType: AttackDirectionType.Straight,
    abilities: []
  }
};

// 基础动作类型
export enum GameActionType {
  Move,        // 移动
  Attack,      // 攻击
  Deploy,      // 部署
  Bolster,     // 强化
  ClaimInitiative,  // 抢先手
  Recruit,     // 招募
  Pass,        // 过
  Control,    // 占点
}

export enum ServerActionType {
  UpdateGameState = 'UPDATE_GAME_STATE',  // 更新游戏状态
  ClearGame = 'CLEAR_GAME',         // 清空游戏
}

// Payload 接口
export interface MovePayload {
  unitId: string;
  to: Position;
}

export interface AttackPayload {
  attackerId: string;
  attackerPosition: Position;
  targetId: string;
  targetPosition: Position;
}

export interface DeployPayload {
  unitId: string;
  position: Position;
}

export interface BolsterPayload {
  unitId: string;
}

export interface ClaimInitiativePayload {
  unitId: string;
}

export interface RecruitPayload {
  unitId: string;
}

export interface PassPayload {
  unitId: string;
}

export interface ControlPayload {
  unitId: string;
  position: Position;
}

// 统一的游戏动作类型
export type GameAction = {
  type: GameActionType | ServerActionType;
  payload: {
    [key: string]: any;  // 或者更具体的类型
  };
};


export interface GameState {
  // 游戏基础信息
  gameId: string;
  stage: GameStage;
  
  // 回合信息
  currentTurn: number;
  currentPlayer: string;  // playerId
  initiative: string;     // 持有先手权的玩家id
  
  // 玩家信息
  players: {
    [playerId: string]: Player;
  };
  
  // 单位信息
  units: {
    [unitId: string]: Unit;
  };
  
  // 棋盘信息
  board: {
    size: BoardSize;  // 棋盘大小
    // 使用 Map 存储每个位置的信息，key 为位置的字符串表示 (例如: "q,r,s")
    cells: {
      [position: string]: {
        unitId?: string;
        controlledBy?: string;  // playerId
        cellType: CellType;
      };
    };
  };
  
  // 行动点数/资源
  actionPoints: {
    [playerId: string]: number;
  };
  
  // 游戏历史记录
  history: {
    actions: GameAction[];
    timestamp: number;
  }[];
}

