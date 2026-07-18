import { HTTPException } from "hono/http-exception";

import { sendEmail } from "../common/utils/email.js";
import { env } from "../env.js";

export async function submitFeedback(input: {
  name: string;
  email: string;
  type: "issue" | "feature" | "message";
  message: string;
}): Promise<void> {
  if (!env.COURIER_AUTH_TOKEN || !env.DEVELOPER_EMAIL) {
    throw new HTTPException(503, {
      message: "Feedback delivery is not configured",
    });
  }

  const messageId = await sendEmail("feedback", {
    to: env.DEVELOPER_EMAIL,
    data: {
      name: input.name,
      email: input.email,
      type: input.type,
      message: input.message,
    },
  });

  if (!messageId) {
    throw new HTTPException(503, {
      message: "Failed to send feedback",
    });
  }
}
