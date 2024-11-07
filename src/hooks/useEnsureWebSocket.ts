import { useEffect } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';
import { AuthService } from '../services/auth';

export const useEnsureWebSocket = () => {
  const { connect, isConnected } = useWebSocketContext();

  useEffect(() => {
    const ensureConnection = async () => {
      // 如果已经连接，就不需要重复连接
      if (isConnected()) {
        return;
      }

      // 获取 token
      const token = AuthService.getInstance().getToken();

      if (token) {
        // 建立连接
        connect(token);
        
        // 等待连接建立
        let retries = 0;
        const maxRetries = 5;
        
        while (!isConnected() && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries++;
        }

        if (!isConnected()) {
          console.error('WebSocket 连接失败');
          // 可以在这里添加重试逻辑或错误处理
        }
      }
    };

    ensureConnection();
  }, [connect, isConnected]);
}; 