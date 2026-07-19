import { api } from "./client";
import { unwrap } from "./http";

export type FeedbackApiArgs = {
  type: string;
  message: string;
  email?: string;
  username?: string;
};

export async function sendFeedback({
  type,
  message,
}: FeedbackApiArgs): Promise<{ message?: string; error?: string }> {
  const res = await api.feedback.$post({
    json: {
      type: type as "issue" | "feature" | "message",
      message,
    },
  });

  try {
    await unwrap(res);
    return { message: "ok" };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to send feedback",
    };
  }
}
