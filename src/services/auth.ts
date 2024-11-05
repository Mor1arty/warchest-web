export class AuthService {
  private static instance: AuthService;
  private token: string = '';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(username: string, password: string): Promise<string> {
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('登录失败');
      }

      const data = await response.json();
      this.token = data.payload.token;
      localStorage.setItem('gameToken', this.token);
      return this.token;
    } catch (error) {
      console.error('登录错误:', error);
      throw error;
    }
  }

  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('gameToken') || '';
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    localStorage.removeItem('gameToken');
  }
} 