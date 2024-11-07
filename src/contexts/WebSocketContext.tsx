import React, { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { AuthService } from '../services/auth';

interface WebSocketContextType {
  sendMessage: (message: any) => void;
  subscribe: (handler: (message: any) => void) => () => void;
  isConnected: () => boolean;
  connect: (token: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ws = useRef<WebSocket | null>(null);
  const messageHandlers = useRef(new Set<(message: any) => void>());
  const reconnectAttempts = useRef(0);
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;
  const HEARTBEAT_INTERVAL = 30000;

  // 心跳检测
  const startHeartbeat = useCallback(() => {
    heartbeatTimer.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'PING' }));
      }
    }, HEARTBEAT_INTERVAL);
  }, []);

  // 停止心跳
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
    }
  }, []);

  // 重连逻辑
  const attemptReconnect = useCallback((token: string) => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error('达到最大重连次数');
      return;
    }

    setTimeout(() => {
      reconnectAttempts.current++;
      console.log(`尝试重连 (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`);
      initializeWebSocket(token);
    }, RECONNECT_DELAY);
  }, []);

  // 初始化 WebSocket
  const initializeWebSocket = useCallback((token: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.close();
    }

    ws.current = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

    ws.current.onopen = () => {
      console.log('WebSocket 连接已建立');
      reconnectAttempts.current = 0;
      startHeartbeat();
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        messageHandlers.current.forEach(handler => handler(message));
      } catch (error) {
        console.error('WebSocket 消息解析错误:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket 连接已关闭');
      stopHeartbeat();
      attemptReconnect(token);
    };
  }, [startHeartbeat, stopHeartbeat, attemptReconnect]);

  // 发送消息
  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket 未连接');
    }
  }, []);

  // 订阅消息
  const subscribe = useCallback((handler: (message: any) => void) => {
    messageHandlers.current.add(handler);
    return () => {
      messageHandlers.current.delete(handler);
    };
  }, []);

  // 检查连接状态
  const isConnected = useCallback(() => {
    return ws.current?.readyState === WebSocket.OPEN;
  }, []);

  // 暴露连接方法
  const connect = useCallback((token: string) => {
    initializeWebSocket(token);
  }, [initializeWebSocket]);

  // 初始化连接（可选，用于恢复已存在的会话）
  useEffect(() => {
    const token = AuthService.getInstance().getToken();
    if (token) {
      initializeWebSocket(token);
    }

    return () => {
      stopHeartbeat();
      ws.current?.close();
    };
  }, [initializeWebSocket, stopHeartbeat]);

  const contextValue = {
    sendMessage,
    subscribe,
    isConnected,
    connect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// 导出 Context Hook
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};