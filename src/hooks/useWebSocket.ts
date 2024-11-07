import { useContext, useEffect } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

export const useWebSocket = (onMessage: (message: any) => void) => {
  const context = useWebSocketContext();
  
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  useEffect(() => {
    return context.subscribe(onMessage);
  }, [context, onMessage]);

  return context.sendMessage;
};