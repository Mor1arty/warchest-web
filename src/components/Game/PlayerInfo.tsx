// src/components/PlayerInfo.tsx
import React from 'react';
import { Player, Unit, UNIT_DEFINITIONS, UnitType } from '../../types/game';
import { getUnitIcon } from '../../utils/unitUtils';

interface PlayerInfoProps {
  player: Player;
  position: 'top' | 'bottom';
  selectedUnit: Unit | null;
}

// 添加一个新的组件来处理堆叠效果
interface StackedUnitIconProps {
  unit: Unit;
  count: number;
}

const StackedUnitIcon: React.FC<StackedUnitIconProps> = ({ unit, count }) => {
  const unitImage = getUnitIcon(unit.type);
  
  return (
    <div className="relative inline-block w-12">
      {/* 生成堆叠的背景图片层 */}
      {Array.from({ length: Math.min(count - 1, 2) }).map((_, index) => (
        <div
          key={`stack-${index}`}
          className="absolute w-12 h-12 rounded-full overflow-hidden border border-gray-300"
          style={{
            top: `${index * 2}px`,
            left: `${index * 2}px`,
            zIndex: index
          }}
        >
          <img 
            src={unitImage}
            alt={UNIT_DEFINITIONS[unit.type].name}
            className="w-full h-full object-cover opacity-70" // 添加一些透明度区分层次
          />
        </div>
      ))}
      {/* 最上层的实际单位图标 */}
      <div 
        className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300"
        style={{
          top: `${Math.min(count - 1, 2) * 2}px`,
          left: `${Math.min(count - 1, 2) * 2}px`,
          zIndex: count
        }}
      >
        <img 
          src={unitImage}
          alt={UNIT_DEFINITIONS[unit.type].name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* 显示数量 */}
      {count > 1 && (
        <div 
          className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          style={{ zIndex: count + 1 }}
        >
          {count}
        </div>
      )}
    </div>
  );
};

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, position, selectedUnit }) => {
  if (!player) {
    return (
      <div className={`
        player-area 
        flex 
        items-center 
        justify-between 
        p-4
        ${position === 'top' ? 'bg-gray-100' : 'bg-gray-200'}
      `}>
        加载中...
      </div>
    );
  }

  // 计算每种单位的数量
  const getUnitCounts = (units: Unit[]) => {
    return units?.reduce((acc, unit) => {
      acc[unit.type] = (acc[unit.type] || 0) + 1;
      return acc;
    }, {} as Record<UnitType, number>) || {};
  };

  const supplyUnitCounts = getUnitCounts(player.supply);
  const discardPileUnitCounts = getUnitCounts(player.discardPile);
  const eliminatedUnitCounts = getUnitCounts(player.eliminated);

  return (
    <div className="player-info-container h-full bg-blue-50 rounded-lg p-2 inline-block">
      <div className="flex h-full">
        {/* 补给区 */}
        <div className="flex-0 h-full flex flex-col justify-between border-r border-gray-200 px-4 min-w-[120px]">
          <div className="text-xs text-gray-500 text-center mb-2">募集堆</div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {Object.entries(supplyUnitCounts).map(([unitType, count]) => {
              const unit = player.supply.find(u => u.type === Number(unitType));
              if (!unit) return null;
              return (
                <StackedUnitIcon 
                  key={`${unitType}-stack`} 
                  unit={unit} 
                  count={count}
                />
              );
            })}
          </div>
        </div>

        {/* 手牌区 */}
        <div className="flex-0 h-full flex flex-col justify-between border-r border-gray-200 px-4 min-w-[120px]">
          <div className="text-xs text-gray-500 text-center mb-2">手牌堆</div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {player.hand.map(unit => (
              <div 
                key={unit.id}
                className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300"
              >
                <img 
                  src={getUnitIcon(unit.type)}
                  alt={UNIT_DEFINITIONS[unit.type].name}
                  className="w-full h-full object-cover"
              />
              </div>
            ))}
          </div>
        </div>

        {/* 口袋区 */}
        <div className="flex-0 h-full flex flex-col justify-between border-r border-gray-200 px-4 min-w-[120px]">
          <div className="text-xs text-gray-500 text-center mb-2">口袋堆</div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            <div className="relative w-12 h-12 rounded-full">
              <img 
                src={'/images/bag.png'}
                alt={'口袋'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 弃牌堆 */}
        <div className="flex-0 h-full flex flex-col justify-between border-r border-gray-200 px-4 min-w-[120px]">
          <div className="text-xs text-gray-500 text-center mb-2">弃牌堆</div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {Object.entries(discardPileUnitCounts).map(([unitType, count]) => {
              const unit = player.discardPile.find(u => u.type === Number(unitType));
              if (!unit) return null;
              return (
                <StackedUnitIcon key={`${unitType}-stack`} unit={unit} count={count} />
              );
            })}
          </div>
        </div>

        {/* 阵亡堆 */}
        <div className="flex-0 h-full flex flex-col justify-between px-4 min-w-[120px]">
          <div className="text-xs text-gray-500 text-center mb-2">阵亡堆</div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {Object.entries(eliminatedUnitCounts).map(([unitType, count]) => {
              const unit = player.eliminated.find(u => u.type === Number(unitType));
              if (!unit) return null;
              return (
                <StackedUnitIcon key={`${unitType}-stack`} unit={unit} count={count} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;