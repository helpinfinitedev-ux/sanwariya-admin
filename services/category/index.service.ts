import http from "../http/index.service";

export const CategoryService = {
  listCategories: async () => {
    const response = await http.get("/category");
    return response.data;
  },
};
