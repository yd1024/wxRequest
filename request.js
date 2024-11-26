import { BASE_URL } from "@/common/config";
import { getToken, clearAll } from "@/utils/auth";

const apiHost = BASE_URL;

// 请求拦截器
function requestInterceptor(config) {
  // 可以在这里添加通用的请求头，比如认证信息
  config.header = {
    ...config.header,
    Authorization: `${getToken()}`,
  };
  return config;
}

// 响应拦截器
function responseInterceptor(response) {
  if (response.statusCode === 200) {
    const { code, data } = response.data;
    if (code === 200) {
      return Promise.resolve(data);
    } else if (code === 401 || code === 403) {
      // 处理 token 过期
      clearAll();
      wx.showToast({
        title: "登录已过期，请重新登录",
        icon: "none",
        duration: 3000,
      });
      // 跳转到登录页面
      wx.redirectTo({
        url: "/pages/login/login",
      });
      return Promise.reject("登录已过期，请重新登录");
    } else {
      return Promise.reject(data);
    }
  } else {
    if (response.statusCode === 404) {
      return Promise.reject("接口不存在");
    } else if (response.statusCode === 500) {
      return Promise.reject("服务器错误");
    } else if (response.statusCode === 401 || response.statusCode === 403) {
      clearAll();
      wx.showToast({
        title: "登录已过期，请重新登录",
        icon: "none",
        duration: 3000,
      });
      // 跳转到登录页面
      wx.redirectTo({
        url: "/pages/login/login",
      });
      return Promise.reject("登录已过期，请重新登录");
    } else {
      const { data } = response;
      wx.showToast({
        title:
          data.message ||
          data.msg ||
          data.error ||
          response.message ||
          response.error ||
          "未知错误",
        icon: "none",
        duration: 3000,
      });
      return Promise.reject(data || response);
    }
  }
}

// 统一调用接口
function request({ url, data = {}, method = "GET" }) {
  return new Promise((resolve, reject) => {
    // 应用请求拦截器
    const config = requestInterceptor({
      url: apiHost + url,
      data: data,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: method,
      dataType: "json",
      responseType: "text",
    });

    wx.request({
      ...config,
      success: (res) => {
        // 应用响应拦截器
        responseInterceptor(res)
          .then((data) => resolve(data))
          .catch((err) => {
            reject(err);
          });
      },
      fail: (res) => {
        wx.showToast({
          title: "网络异常，请检查网络状态",
          icon: "none",
          duration: 3000,
        });
        reject(res);
      },
    });
  });
}

export default request;
