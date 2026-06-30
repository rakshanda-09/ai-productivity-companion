import { loginRequest, registerRequest, updateMeRequest } from "../api/authApi";

const TOKEN_KEY = "lmls_token";

function persistSession({ user, token }) {
  localStorage.setItem(TOKEN_KEY, token);
  return user;
}

export async function login(email, password) {
  const data = await loginRequest({ email, password });
  return persistSession(data);
}

export async function register(name, email, password) {
  const data = await registerRequest({ name, email, password });
  return persistSession(data);
}

export async function updateProfile(payload) {
  const { user } = await updateMeRequest(payload);
  return user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
