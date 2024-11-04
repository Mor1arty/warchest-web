import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const gameApi = {
  createGame: async () => {
    const response = await axios.post(`${API_BASE_URL}/api/games`);
    return response.data;
  },
  
  joinGame: async (gameId: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/games/${gameId}/join`);
    return response.data;
  },
  
  getGameState: async (gameId: string) => {
    const response = await axios.get(`${API_BASE_URL}/api/games/${gameId}`);
    return response.data;
  }
};
