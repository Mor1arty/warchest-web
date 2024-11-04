import { GameAction, GameActionType, ServerActionType } from '../types/game';

export class GameWebSocket {
  private static instance: GameWebSocket;
  private ws: WebSocket | null = null;
  private dispatch: ((message: any) => void) | null = null;

  private constructor() {}

  public static getInstance(): GameWebSocket {
    if (!GameWebSocket.instance) {
      GameWebSocket.instance = new GameWebSocket();
    }
    return GameWebSocket.instance;
  }

  public initialize(dispatch: (message: any) => void) {
    this.dispatch = dispatch;
    
    // 替换为你的 WebSocket 服务器地址
    this.ws = new WebSocket('ws://localhost:8080/ws');

    this.ws.onopen = () => {
      console.log('WebSocket 连接已建立, 更新游戏数据');
      const updateGameStateAction = {
        type: ServerActionType.UpdateGameState,
        payload: {}
      };
      this.sendMessage(updateGameStateAction);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (this.dispatch) {
          this.dispatch(message);
        }
      } catch (error) {
        console.error('WebSocket 消息解析错误:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket 连接已关闭');
      // 可以在这里添加重连逻辑
    };

    // 返回清理函数
    return () => {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    };
  }

  // 发送消息到服务器
  public sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket 未连接');
    }
  }
}
