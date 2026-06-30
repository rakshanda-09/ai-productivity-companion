import http from "./httpClient";

export const scanForRisk = () => http.get("/rescue").then((r) => r.data.data.atRisk);

export const fetchRescuePlan = (taskId) => http.get(`/rescue/${taskId}`).then((r) => r.data.data);
