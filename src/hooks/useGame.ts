import { useReducer, useCallback } from 'react';
import { GameWebSocket } from '../services/websocket';
import { GameStage, ServerActionType, Team } from '../types/game';
import { gameReducer } from '../reducers/gameReducer';

// 创建初始游戏状态
const initialState = {    
  gameId: '',
  stage: GameStage.Waiting,
  currentTurn: 1,
  currentPlayer: 'player1',
  initiative: 'player1',
  players: {
    ['player1']: {
      id: 'player1',
      name: '玩家1',
      team: Team.White,
      supply: [],
      hand: [],
      bag: [],
      discardPile: [],
      eliminated: [],
    },
    ['player2']: {
      id: 'player2',
      name: '玩家2',
      team: Team.Black,
      supply: [],
      hand: [],
      bag: [],
      discardPile: [],
      eliminated: [],
    }
  },
  units: {},
  board: {
    size: { qSize: 3, rSize: 3, sSize: 3 },
    cells: {}
  },
  actionPoints: {
    player1: 1,
    player2: 1
  },
  history: []
};

export const useGame = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  return { gameState, dispatch };
};
