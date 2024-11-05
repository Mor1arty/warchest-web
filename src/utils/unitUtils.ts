import { Unit, UNIT_DEFINITIONS, UnitStatus } from "../types/game";

import { UnitType } from "../types/game";

// 对每个Unit生成唯一ID
export const generateUnitId = (): string => {
    return `unit_${Math.random().toString(36).slice(2, 9)}`;
  };

// 创建新单位的工厂函数
export const createUnit = (type: UnitType, owner: string): Unit => {
    return {
        id: generateUnitId(),
        type,
        owner,
        status: UnitStatus.InBag,
    };
};

export const getUnitMoveRange = (type: UnitType): number => {
    return UNIT_DEFINITIONS[type].moveRange;
}

export const getUnitAttackRange = (type: UnitType): number => {
    return UNIT_DEFINITIONS[type].attackRange;
}

// 获取单位图标
export const getUnitIcon = (type: UnitType) => {
    return UNIT_DEFINITIONS[type].icon;
};
