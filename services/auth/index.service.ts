import http from "../http/index.service";

export const AuthService = {
  login: async (credentials: Record<string, string>) => {
    const response = await http.post("/auth/login", credentials);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  },
  logout: () => {
    localStorage.clear();
  },
};
