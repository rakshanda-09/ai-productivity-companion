import { askCoach } from "../api/coachApi";

export async function sendMessage(message) {
  try {
    const reply = await askCoach(message);
    return { reply, error: null };
  } catch (err) {
    return { reply: null, error: err.message };
  }
}
