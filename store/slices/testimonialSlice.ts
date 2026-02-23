import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TestimonialService } from "@/services/testimonial/index.service";

interface TestimonialState {
  testimonials: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  loading: false,
  error: null,
};

export const fetchTestimonials = createAsyncThunk("testimonials/fetchTestimonials", async () => {
  const response = await TestimonialService.listTestimonials();
  return response.data;
});

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch testimonials";
      });
  },
});

export default testimonialSlice.reducer;
