// src/components/UnitCard.tsx
import React from 'react';
import { Unit } from '../../types/game';
import UnitIcon from './UnitIcon';
import { positionToString } from '../../utils/positionUtils';

interface UnitCardProps {
  unit: Unit;
  isSelected: boolean;
  onSelect: () => void;
  stackIndex?: number;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, isSelected, onSelect, stackIndex = 0 }) => {
  return (
    <div 
      className={`unit-card absolute ${isSelected ? 'selected' : ''}`}
      style={{
        transform: `translate(${stackIndex * -4}px, ${stackIndex * -4}px)`,
        zIndex: stackIndex,
      }}
      onClick={onSelect}
    >
      <UnitIcon unit={unit} size="md" />
    </div>
  );
};

// 修改UnitCardList组件来处理堆叠效果
export const UnitCardList: React.FC<{
  units: Unit[];
  onUnitSelect?: (unit: Unit) => void;
}> = ({ units, onUnitSelect }) => {
  // 按类型分组并计算堆叠索引
  const groupedUnits = units.reduce((acc, unit) => {
    const key = `${unit.type}-${unit.position ? positionToString(unit.position) : 'noPosition'}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(unit);
    return acc;
  }, {} as Record<string, Unit[]>);

  return (
    <div className="unit-card-list grid grid-cols-3 gap-2">
      {Object.values(groupedUnits).map(unitGroup => (
        <div key={`${unitGroup[0].type}-${unitGroup[0].position || 'noPosition'}`} className="relative">
          {unitGroup.map((unit, index) => (
            <UnitCard 
              key={unit.id} 
              unit={unit}
              isSelected={false}
              onSelect={() => onUnitSelect?.(unit)}
              stackIndex={index}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default UnitCard;