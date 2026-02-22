import axios from "axios";
import { logger } from "@/utils/logger";
import { toast } from "sonner";
import { config } from "@/config";
import { AuthService } from "../auth/index.service";

const { CancelToken } = axios;

let source = CancelToken.source();

axios.defaults.baseURL = config.API_URL;
axios.defaults.data = {
  toast: false,
};

axios.interceptors.request.use(
  (config) => {
    const { url, data, method } = config;

    logger.info(`http ${method} request`, url, "\n", data);

    return { ...config, cancelToken: source.token };
  },
  (error) => Promise.reject(error)
);
axios.interceptors.response.use(
  (res) => {
    const { config } = res;
    const { url, method } = config;
    const { data } = res.data;

    logger.info(`http ${method} response`, url, "\n", data);

    return res;
  },
  (err) => {
    const { config, message: msg, response } = err;
    const message = response?.data?.message;
    const { url, method } = config;

    logger.error(`http ${method} error`, url, message || msg);

    if (!response) throw err;

    const code = response.data.statusCode;
    const status = response.status;
    const error = response.data.error;
    const unauthorizedMessages = ["Unauthorized Access", "Password has been changed, Login again", "Login session has been expired, Login again", "Session has expired"];

    toast.error(message);

    if (unauthorizedMessages.includes(message) || status === 401 || code === 401 || error === "Unauthorized") {
      AuthService.logout();

      source.cancel(message);

      setTimeout(() => {
        source = CancelToken.source();

        if (window.location.pathname !== "/login") window.location.assign("/login");
      }, 300);
    }

    throw err;
  }
);
const http = {
  get: axios.get,
  put: axios.put,
  post: axios.post,
  patch: axios.patch,
  delete: axios.delete,
  getUserBaseUrl: () => config.API_URL,
  setJWT: () => {
    axios.defaults.headers.common.authorization = localStorage.getItem("token") || "";
  },
  setMultiPart: () => ({ headers: { "Content-Type": "multipart/form-data" } }),
  setBaseUrl: (url: string) => {
    axios.defaults.baseURL = url;
  },
};

export default http;
