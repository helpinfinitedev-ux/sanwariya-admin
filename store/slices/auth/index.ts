import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "@/services/auth/index.service";
import http from "@/services/http/index.service";
import { User } from "@/utils/types";

export const loginUser = createAsyncThunk("auth/login", async (credentials: Record<string, string>, { rejectWithValue }) => {
  try {
    const response = await AuthService.login(credentials);
    const { token, user } = response.result;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    http.setJWT();

    return user;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message = err.response?.data?.message || "Login failed";
    return rejectWithValue(message);
  }
});

const getInitialUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: getInitialUser(),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.clear();
      window.location.assign("/login");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;
export default authReducer;
