import http from "./httpClient";

export const registerRequest = (payload) => http.post("/auth/register", payload).then((r) => r.data.data);
export const loginRequest = (payload) => http.post("/auth/login", payload).then((r) => r.data.data);
export const fetchMe = () => http.get("/auth/me").then((r) => r.data.data);
export const updateMeRequest = (payload) => http.put("/auth/me", payload).then((r) => r.data.data);
