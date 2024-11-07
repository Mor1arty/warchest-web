import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/auth';

interface WithAuthOptions {
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const {
    redirectTo = '/login',
    loadingComponent = <div>加载中...</div>
  } = options;

  function WithAuthComponent(props: P) {
    const navigate = useNavigate();
    const location = useLocation();
    const authService = AuthService.getInstance();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = authService.getToken();
          
          if (!token) {
            // 没有 token，重定向到登录页
            navigate(redirectTo, {
              state: { from: location.pathname },
              replace: true
            });
            return;
          }

          // 这里可以添加验证 token 有效性的逻辑
          const isValid = await authService.validateToken(token);
          if (!isValid) {
            authService.logout();
            navigate(redirectTo);
            return;
          }
        } catch (error) {
          console.error('认证检查失败:', error);
          navigate(redirectTo, { replace: true });
        } finally {
          setIsChecking(false);
        }
      };

      checkAuth();
    }, [navigate, location]);

    // 处理加载状态
    if (isChecking) {
      return <>{loadingComponent}</>;
    }

    // 如果没有 token，返回 null（实际上会被重定向）
    if (!authService.getToken()) {
      return null;
    }

    // 注入额外的 props（如果需要）
    const injectedProps = {
      // 可以在这里注入一些与认证相关的 props
      // authService,
      // logout: () => authService.logout(),
      // username: authService.getUsername(),
    };

    return <WrappedComponent {...(props as P)} {...injectedProps} />;
  }

  const displayName = 
    WrappedComponent.displayName || 
    WrappedComponent.name || 
    'Auth Wrapped Component';

  WithAuthComponent.displayName = `withAuth(${displayName})`;
  return WithAuthComponent;
}; 