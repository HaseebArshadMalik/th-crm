import axios from "axios";
import { toast } from "react-toastify";

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.REACT_APP_CRM_API_URL,
});

axiosInterceptorInstance.interceptors.request.use(
  (config: any) => {
    if (config.url && config.url.indexOf("/account") === -1 && config.headers) {
      if (localStorage.getItem("user")) {
        var user = JSON.parse(localStorage.getItem("user") || "");
        config.headers.Authorization = `Bearer ${user.Token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    if (response.data && response.data.statusCode !== 200) {
      toast.dismiss();
      try {
        var body = JSON.parse(response.data.body);
        toast.error(body.Error);
      } catch (error) {
        toast.error(response.data.body);
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.message && error.message !== "canceled") {
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInterceptorInstance;
