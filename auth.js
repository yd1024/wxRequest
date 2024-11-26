const TOKEN_KEY = "user_token";
const USER_INFO_KEY = "user_info";

// 保存 token
function saveToken(token) {
  try {
    wx.setStorageSync(TOKEN_KEY, token);
  } catch (e) {
    console.error("Failed to save token:", e);
  }
}

// 获取 token
function getToken() {
  try {
    return wx.getStorageSync(TOKEN_KEY) || null;
  } catch (e) {
    console.error("Failed to get token:", e);
    return null;
  }
}

// 清空 token
function clearToken() {
  try {
    wx.removeStorageSync(TOKEN_KEY);
  } catch (e) {
    console.error("Failed to clear token:", e);
  }
}

// 保存用户信息
function saveUserInfo(userInfo) {
  try {
    wx.setStorageSync(USER_INFO_KEY, userInfo);
  } catch (e) {
    console.error("Failed to save user info:", e);
  }
}

// 获取用户信息
function getUserInfo() {
  try {
    return wx.getStorageSync(USER_INFO_KEY) || null;
  } catch (e) {
    console.error("Failed to get user info:", e);
    return null;
  }
}

// 清空用户信息
function clearUserInfo() {
  try {
    wx.removeStorageSync(USER_INFO_KEY);
  } catch (e) {
    console.error("Failed to clear user info:", e);
  }
}

// 清空所有
function clearAll() {
  clearToken();
  clearUserInfo();
}

export {
  saveToken,
  getToken,
  clearToken,
  saveUserInfo,
  getUserInfo,
  clearUserInfo,
  clearAll,
};
