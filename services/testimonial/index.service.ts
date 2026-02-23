import http from "../http/index.service";

export const TestimonialService = {
  listTestimonials: async () => {
    const response = await http.get("/admin/testimonials");
    return response.data;
  },
  createTestimonial: async (data: any) => {
    const response = await http.post("/admin/testimonials", data);
    return response.data;
  },
  updateTestimonial: async (id: string, data: any) => {
    const response = await http.patch(`/admin/testimonials/${id}`, data);
    return response.data;
  },
  deleteTestimonial: async (id: string) => {
    const response = await http.delete(`/admin/testimonials/${id}`);
    return response.data;
  },
};
