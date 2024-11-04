// src/components/PlayerInfo.tsx
import React from 'react';
import { useGame } from '../../hooks/useGame';
import UnitCard from './UnitCard';
import { Player, UNIT_DEFINITIONS } from '../../types/game';
import { getUnitIcon } from '../../utils/unitUtils';

const PlayerInfo: React.FC<{ player: Player, position: 'top' | 'bottom', showHand: boolean, selectedUnit: string | null }> = ({ player, position, showHand, selectedUnit }) => {
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
    <div className={`
      player-area 
      flex 
      items-center 
      justify-between 
      p-4
      ${position === 'top' ? 'bg-gray-100' : 'bg-gray-200'}
    `}>
      {/* 左侧：招募区 */}
      <div className="flex items-center gap-2">
        <div className="supply-area flex gap-1">
          {player.supply?.map(unit => (
            <div key={unit.id} className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={getUnitIcon(unit.type)} alt={UNIT_DEFINITIONS[unit.type].name} className="unit-icon" />
              </div>
            </div>
          ))}
        </div>
        <div className="player-stats ml-4">
          <div className="player-name font-bold">{player.name}</div>
          <div className="action-points">AP: {gameState.actionPoints?.[player.id] ?? 0}</div>
        </div>
      </div>
    
      {/* 中间：手牌区 */}
      <div className="flex-grow flex justify-center gap-2">
        {showHand && player.hand?.map(unit => (
          <UnitCard key={unit.id} unit={unit} isSelected={selectedUnit === unit.id} onSelect={() => {}} />
        ))}
      </div>
    
      {/* 右侧：牌堆和弃牌堆 */}
      <div className="flex gap-4">
        <div className="bag-pile relative">
          <div className="w-12 h-16 bg-green-700 rounded"></div>
          <span className="absolute -bottom-2 text-sm">{player.bag?.length ?? 0}</span>
        </div>
        <div className="discard-pile relative">
          <div className="w-12 h-16 bg-red-700 rounded"></div>
          <span className="absolute -bottom-2 text-sm">{player.discardPile?.length ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;