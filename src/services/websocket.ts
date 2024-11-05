import { GameAction, GameActionType, ServerActionType } from '../types/game';

export class GameWebSocket {
  private static instance: GameWebSocket;
  private ws: WebSocket | null = null;
  private dispatch: ((message: any) => void) | null = null;
  private token: string | null = null;
  private heartbeatInterval: number = 30000; // 30秒
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;

  private constructor() {}

  public static getInstance(): GameWebSocket {
    if (!GameWebSocket.instance) {
      GameWebSocket.instance = new GameWebSocket();
    }
    return GameWebSocket.instance;
  }

  public initialize(dispatch: (message: any) => void, token: string) {
    this.dispatch = dispatch;
    this.token = token;
    
    this.ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket 连接已建立，发送认证信息');
      this.sendMessage({ type: 'JOIN_GAME', payload: {} });
      this.startHeartbeat();
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
      this.attemptReconnect();
    };

    return () => {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    };
  }

  public sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket 未连接');
    }
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage({ type: 'PING' });
      }
    }, this.heartbeatInterval);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数');
      return;
    }

    setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.initialize(this.dispatch!, this.token!);
    }, this.reconnectDelay);
  }
}
