import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export async function login(email, password) {
  const response = await api.post("/usuarios/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentUser() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}