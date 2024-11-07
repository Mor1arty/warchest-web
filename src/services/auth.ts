export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    // 从 localStorage 恢复 token
    this.token = localStorage.getItem('token');
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // 验证 token 的有效性
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:8080/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.payload.valid;
    } catch (error) {
      console.error('Token 验证失败:', error);
      return false;
    }
  }

  async login(username: string, password: string): Promise<string | null> {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('登录失败');
      }

      const data = await response.json();
      this.token = data.payload.token;
      if (this.token) {
        localStorage.setItem('token', this.token);
      }
      return this.token;
    } catch (error) {
      throw new Error('登录失败');
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return this.token;
  }
} 