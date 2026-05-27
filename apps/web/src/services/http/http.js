/**
 * @file HTTP 客户端封装 —— 基于 Axios 的统一请求服务
 *
 * 关键依赖：
 *   Axios (MIT) —— HTTP 客户端，提供请求/响应拦截器
 */
import axios from "axios";
import Message from "@/components/common/message.js";

/**
 * 创建 HTTP 客户端实例
 * @param {string} baseURL - API 基础 URL
 * @returns {{get, post, put, delete}} 封装了 GET/POST/PUT/DELETE 方法的客户端对象
 */
const createHttpClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (req) => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    },
    (err) => Promise.reject(err),
  );

  instance.interceptors.response.use(
    (res) => {
      const data = res.data;

      if (data.code !== "00000" && data.code !== 1) {
        Message.error(data.message || data.msg || "请求失败", 3000);
      }

      return data;
    },
    (err) => {
      const data = err.response?.data;

      if (err.response?.status === 401) {
        Message.error(data?.message || data?.msg || '未登录，请先登录', 3000);
      } else {
        Message.error(data?.message || data?.msg || err.message || '请求失败', 3000);
      }

      return Promise.reject(data || err);
    },
  );

  return {
    get(url, params = {}, success, fail, options = {}) {
      instance
        .get(url, { params, ...options })
        .then((res) => {
          if ((res.code === "00000" || res.code === 1) && success) success(res);
          else if (fail) fail(res);
        })
        .catch((error) => {
          if (fail) fail(error);
        });
    },

    post(url, data = {}, success, fail, options = {}) {
      instance
        .post(url, data, { ...options })
        .then((res) => {
          if ((res.code === "00000" || res.code === 1) && success) success(res);
          else if (fail) fail(res);
        })
        .catch((error) => {
          if (fail) fail(error);
        });
    },

    put(url, data = {}, success, fail, options = {}) {
      instance
        .put(url, data, { ...options })
        .then((res) => {
          if ((res.code === "00000" || res.code === 1) && success) success(res);
          else if (fail) fail(res);
        })
        .catch((error) => {
          if (fail) fail(error);
        });
    },

    delete(url, params = {}, success, fail, options = {}) {
      instance
        .delete(url, { params, ...options })
        .then((res) => {
          if ((res.code === "00000" || res.code === 1) && success) success(res);
          else if (fail) fail(res);
        })
        .catch((error) => {
          if (fail) fail(error);
        });
    },
  };
};

export const nodeHttp = createHttpClient(import.meta.env.VITE_NODE_API_BASE_URL);
