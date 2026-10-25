import { contactEmail } from "./email";

const TURNSTILE_VERIFY_URL =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maximum length of each form field, to reject oversized payloads.
const FIELDS = {
	name: 200,
	email: 320,
	subject: 200,
	message: 5000,
	turnstileToken: 2048,
} as const;

type ContactForm = Record<keyof typeof FIELDS, string>;

const reply = (success: boolean, message: string, status = 200) =>
	Response.json({ success, message }, { status });

function parseForm(data: unknown): ContactForm | null {
	if (typeof data !== "object" || data === null) return null;

	const form: Partial<ContactForm> = {};
	for (const [key, maxLength] of Object.entries(FIELDS)) {
		const value = (data as Record<string, unknown>)[key];
		if (typeof value !== "string") return null;
		const trimmed = value.trim();
		if (!trimmed || trimmed.length > maxLength) return null;
		form[key as keyof ContactForm] = trimmed;
	}

	const valid = form as ContactForm;
	return EMAIL_PATTERN.test(valid.email) ? valid : null;
}

async function verifyTurnstile(
	token: string,
	secret: string,
	ip: string | null,
): Promise<boolean> {
	const body = new URLSearchParams({ secret, response: token });
	if (ip) body.set("remoteip", ip);

	// Siteverify answers in JSON even when it fails (a wrong secret is a 400), so the
	// reason always reaches the logs.
	const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
	const result = await response
		.json<{ success: boolean; "error-codes"?: string[] }>()
		.catch(() => ({ success: false, "error-codes": ["unreadable-response"] }));
	if (!result.success) {
		console.error("Turnstile validation failed", {
			status: response.status,
			errors: result["error-codes"],
		});
	}
	return result.success;
}

async function handleContact(request: Request, env: Env): Promise<Response> {
	const form = parseForm(await request.json().catch(() => null));
	if (!form) {
		return reply(false, "Formulaire invalide", 400);
	}

	const isHuman = await verifyTurnstile(
		form.turnstileToken,
		env.TURNSTILE_SECRET,
		request.headers.get("CF-Connecting-IP"),
	);
	if (!isHuman) {
		return reply(false, "Validation anti-spam invalide", 400);
	}

	try {
		await env.EMAIL.send({
			from: { email: env.CONTACT_FROM_EMAIL, name: env.CONTACT_FROM_NAME },
			to: env.CONTACT_TO_EMAIL,
			replyTo: { email: form.email, name: form.name },
			...contactEmail(form),
		});
	} catch (error) {
		console.error("Email sending failed", error);
		return reply(false, "L'envoi du message a échoué", 500);
	}

	return reply(true, "Message envoyé avec succès");
}

export default {
	async fetch(request, env) {
		const { pathname } = new URL(request.url);

		if (pathname === "/api/contact" && request.method === "POST") {
			return handleContact(request, env);
		}
		return reply(false, "Not found", 404);
	},
} satisfies ExportedHandler<Env>;
