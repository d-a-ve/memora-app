import { CourierClient } from "@trycourier/courier";

import { env } from "../../env.js";
import { logger } from "./logger.js";

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

export async function sendEmail<K extends EmailKind>(
	kind: K,
	options: { to: string; data: EmailDataByKind[K] }
): Promise<string | undefined> {
	const template = emailTemplates[kind];
	const configured = Boolean(env.COURIER_AUTH_TOKEN && template);

	if (!configured || !options.to) {
		if (!configured) {
			logger.error("Courier not configured; skipping send", {
				emailKind: kind,
			});
		} else if (!options.to) {
			logger.warn("Email not sent; missing recipient email", {
				emailKind: kind,
			});
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

	logger.info("Email sent", {
		emailKind: kind,
		courierMessageId: res.requestId,
	});

	return res.requestId;
}
