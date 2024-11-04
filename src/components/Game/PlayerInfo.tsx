// src/components/PlayerInfo.tsx
import React from 'react';
import { useGame } from '../../hooks/useGame';
import UnitCard from './UnitCard';
import { Player, Unit, UNIT_DEFINITIONS } from '../../types/game';
import { getUnitIcon } from '../../utils/unitUtils';

interface PlayerInfoProps {
  player: Player;
  position: 'top' | 'bottom';
  showHand: boolean;
  selectedUnit: Unit | null;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, position, showHand, selectedUnit }) => {
  const { gameState } = useGame();

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

  return (
    <div className="player-info-container h-full bg-blue-50 rounded-lg p-2">
      <div className="flex justify-between items-center h-full">
        {/* 补给区 */}
        <div className="flex-1 h-full flex flex-col items-center border-r border-gray-200">
          <div className="text-xs text-gray-500">Supply</div>
          <div className="flex gap-1">
            {player.supply?.map(unit => (
              <div key={unit.id} className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={getUnitIcon(unit.type)} alt={UNIT_DEFINITIONS[unit.type].name} className="unit-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 手牌区 */}
        <div className="flex-1 h-full flex flex-col items-center border-r border-gray-200">
          <div className="text-xs text-gray-500">Hand</div>
          <div className="flex gap-1">
            {/* 这里放淘汰的单位图标 */}
          </div>
        </div>

        {/* 口袋区 */}
        <div className="flex-1 h-full flex flex-col items-center border-r border-gray-200">
          <div className="text-xs text-gray-500">Bag</div>
          <div className="flex gap-1">
            {showHand && player.hand?.map(unit => (
              <UnitCard key={unit.id} unit={unit} isSelected={selectedUnit?.id === unit.id} onSelect={() => {}} />
            ))}
          </div>
        </div>

        {/* 弃牌堆 */}
        <div className="flex-1 h-full flex flex-col items-center border-r border-gray-200">
          <div className="text-xs text-gray-500">Discardpile</div>
          <div className="flex gap-1">
            {/* 这里放弃牌堆的单位图标 */}
          </div>
        </div>

        {/* 弃牌堆 */}
        <div className="flex-1 h-full flex flex-col items-center">
          <div className="text-xs text-gray-500">Eliminated</div>
          <div className="flex gap-1">
            {/* 这里放弃牌堆的单位图标 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;