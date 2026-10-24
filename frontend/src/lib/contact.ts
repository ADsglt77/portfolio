interface ContactPayload {
	name: string;
	email: string;
	subject: string;
	message: string;
	turnstileToken: string;
}

interface ContactResponse {
	success: boolean;
	message?: string;
}

/** Sends the contact form to the Worker (`worker/index.ts`). */
export async function sendContact(
	payload: ContactPayload,
): Promise<ContactResponse> {
	try {
		const response = await fetch("/api/contact", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		});
		return (await response.json()) as ContactResponse;
	} catch {
		return { success: false };
	}
}
