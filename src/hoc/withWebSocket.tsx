import React from 'react';
import { useEnsureWebSocket } from '../hooks/useEnsureWebSocket';

export const withWebSocket = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithWebSocketComponent(props: P) {
    useEnsureWebSocket();
    return <WrappedComponent {...props} />;
  };
}; 