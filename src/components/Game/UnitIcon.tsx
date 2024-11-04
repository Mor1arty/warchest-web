import React from 'react';
import { Unit, UNIT_DEFINITIONS } from '../../types/game';
import { getUnitIcon } from '../../utils/unitUtils';

interface UnitIconProps {
  unit: Unit;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UnitIcon: React.FC<UnitIconProps> = ({ unit, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div 
      className={`rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      <img 
        src={getUnitIcon(unit.type)} 
        alt={UNIT_DEFINITIONS[unit.type].name}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default UnitIcon; 