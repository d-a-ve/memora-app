import { CourierClient } from "@trycourier/courier";

import { env } from "../../env.js";

const emailTemplates: Record<EmailKind, string> = {
  "birthday-reminder": "8f9a8013-0b99-4f81-b68d-5eeadec1b37b",
  welcome: "1498dda4-38e3-4a5f-a111-aeda50e41a5e",
  feedback: "7093608f-b2c2-49ed-818d-086f569315b8",
  "reset-email": "nt_01kxv9q4anenavctbs72me4txz",
} as const;

type EmailDataByKind = {
  "birthday-reminder": {
    birthdayNames: string;
    recipientName: string;
  };
  welcome: {
    name: string;
  };
  feedback: {
    name: string;
    email: string;
    type: string;
    message: string;
  };
  "reset-email": {
    name: string;
    resetUrl: string;
  };
};

export type EmailKind = keyof EmailDataByKind;

function client() {
  return new CourierClient({ authorizationToken: env.COURIER_AUTH_TOKEN });
}

function isConfigured(templateId: string): boolean {
  return Boolean(env.COURIER_AUTH_TOKEN && templateId);
}

export async function sendEmail<K extends EmailKind>(
  kind: K,
  options: { to: string; data: EmailDataByKind[K] }
): Promise<string | undefined> {
  const template = emailTemplates[kind];

  if (!isConfigured(template) || !options.to) {
    if (kind === "reset-email") {
      console.warn(
        "Courier password reset not configured; logging URL",
        (options.data as EmailDataByKind["reset-email"]).resetUrl
      );
    } else {
      console.warn(`Courier ${kind} not configured; skipping send`);
    }
    return undefined;
  }

  const res = await client().send({
    message: {
      to: { email: options.to },
      template,
      data: options.data,
    },
  });

  return res.requestId;
}
