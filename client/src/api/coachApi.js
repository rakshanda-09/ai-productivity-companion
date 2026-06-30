import http from "./httpClient";

export const askCoach = (message) => http.post("/coach", { message }).then((r) => r.data.data.reply);
