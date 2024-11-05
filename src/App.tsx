import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Game from './components/Game/Game';
import { AuthService } from './services/auth';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const authService = AuthService.getInstance();
  const token = authService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/game" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
