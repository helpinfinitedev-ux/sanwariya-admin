import http from "../http/index.service";

export const UserService = {
  listUsers: async () => {
    const response = await http.get("/admin/users");
    return response.data;
  },
};
