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
    // 这里可以根据不同的单位类型返回不同的图标
    switch (type) {
      case UnitType.LightCavalry:
        return UNIT_DEFINITIONS[UnitType.LightCavalry].icon;
      case UnitType.Archer:
        return UNIT_DEFINITIONS[UnitType.Archer].icon;
      case UnitType.Swordsman:
        return UNIT_DEFINITIONS[UnitType.Swordsman].icon;
      case UnitType.Pikeman:
        return UNIT_DEFINITIONS[UnitType.Pikeman].icon;
      default:
        return '';
    }
};