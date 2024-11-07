import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { withAuth } from './hoc/withAuth';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Room from './pages/Room';
import Game from './pages/Game';

// 使用 HOC 保护路由
const ProtectedLobby = withAuth(Lobby);
const ProtectedRoom = withAuth(Room);
const ProtectedGame = withAuth(Game);

const App: React.FC = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />

          {/* 受保护的路由 */}
          <Route path="/" element={<ProtectedLobby />} />
          <Route path="/room/:roomId" element={<ProtectedRoom />} />
          <Route path="/game/:gameId" element={<ProtectedGame />} />

          {/* 默认重定向到大厅 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
