import axios from "axios";
import API_URL from "../config/api.js";
import { clearToken, getToken } from "../utils/auth.js";

const API_BASE_URL = API_URL.replace(/\/$/, "");

async function request(config, isProductRequest = false) {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const responseData = error.response?.data;
    const payload = responseData && typeof responseData === "object"
      ? { ...responseData, status: error.response.status }
      : { error: responseData || error.message, status: error.response?.status };

    const isInvalidToken = isProductRequest
      && payload.status === 401
      && (payload.error === "Unauthorized: No token provided"
        || payload.error === "Unauthorized: Invalid token");

    if (isInvalidToken) {
      clearToken();
      window.location.assign("/login");
      throw { ...payload, authExpired: true };
    }

    throw payload;
  }
}

export function loginUser(username, password) {
  return request({
    method: "post",
    url: `${API_BASE_URL}/user/login`,
    data: { username, password },
  });
}

export function signupUser(username, password) {
  return request({
    method: "post",
    url: `${API_BASE_URL}/user/createuser`,
    data: { username, password },
  });
}

export function getProducts() {
  return request({
    method: "get",
    url: `${API_BASE_URL}/products`,
    params: { token: getToken() },
  }, true);
}

export function createProduct(productData) {
  return request({
    method: "post",
    url: `${API_BASE_URL}/products`,
    data: { ...productData, token: getToken() },
  }, true);
}

export function updateProduct(id, productData) {
  return request({
    method: "put",
    url: `${API_BASE_URL}/products/${encodeURIComponent(id)}`,
    data: { ...productData, token: getToken() },
  }, true);
}

export function deleteProduct(id) {
  return request({
    method: "delete",
    url: `${API_BASE_URL}/products/${encodeURIComponent(id)}`,
    params: { token: getToken() },
  }, true);
}
