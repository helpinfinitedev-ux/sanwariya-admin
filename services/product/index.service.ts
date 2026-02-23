import http from "../http/index.service";

export const ProductService = {
  listProducts: async () => {
    const response = await http.get("/admin/products");
    return response.data;
  },
  createProduct: async (data: any) => {
    const response = await http.post("/product", data);
    return response.data;
  },
  updateProduct: async (productId: string, data: any) => {
    const response = await http.patch(`/product/${productId}`, data);
    return response.data;
  },
  deleteProduct: async (productId: string) => {
    const response = await http.delete(`/product/${productId}`);
    return response.data;
  },
};
