import { GameState, Team } from "./game";

export enum RoomStatus {
  Waiting,
  BanPick,
  Playing,
  Finished,
}

export interface GameRoom {
  id: string;
  name: string;
  status: RoomStatus;
  gameState: GameState;
  players: {
    [playerId: string]: Team;
  };
  maxPlayers: number;
  createTime: number;
}
