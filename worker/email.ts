import siteConfig from "../frontend/site.config.json";

const { site, theme } = siteConfig;
// No background of its own: the mail sits on the client's white, so the site's dark
// green becomes the ink.
const { bg: ink, muted } = theme.colors;
// Mail clients do not load web fonts: the title is an image of the site's title font,
// and the text falls back on the closest monospace fonts each system has.
const TITLE_IMAGE = {
	src: `${site.url}/img/mail-title.png`,
	width: 428,
	height: 31,
};
const MONO_FONT = `'${theme.fonts.mono}', Consolas, Menlo, 'SF Mono', monospace`;

interface ContactMessage {
	name: string;
	email: string;
	subject: string;
	message: string;
}

const escapeHtml = (value: string) =>
	value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const row = (label: string, value: string) => `
	<tr>
		<td style="padding:6px 16px 6px 0;width:72px;vertical-align:top;color:${muted};">${label}</td>
		<td style="padding:6px 0;color:${ink};">${value}</td>
	</tr>`;

/** The mail sent to the site's owner for a contact form message, as text and HTML. */
export function contactEmail({
	name,
	email,
	subject,
	message,
}: ContactMessage) {
	const reply = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

	const textBody = [
		"Nouveau message",
		`Nom : ${name}`,
		`Email : ${email}`,
		`Sujet : ${subject}`,
		"",
		message,
	].join("\n");

	const html = `<!doctype html>
<html lang="${site.lang}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="${escapeHtml(theme.fonts.googleFontsUrl)}" rel="stylesheet">
</head>
<body style="margin:0;padding:0;">
	<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(`${name} : ${message.slice(0, 120)}`)}</div>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
		<tr><td style="padding:32px 16px;">
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${MONO_FONT};font-size:14px;line-height:1.6;color:${ink};">
				<tr><td style="padding-bottom:24px;">
					<img src="${escapeHtml(TITLE_IMAGE.src)}" width="${TITLE_IMAGE.width}" height="${TITLE_IMAGE.height}" alt="Nouveau message" style="display:block;max-width:100%;height:auto;border:0;">
				</td></tr>
				<tr><td>
					<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:${MONO_FONT};font-size:14px;">
						${row("Nom", escapeHtml(name))}
						${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${ink};">${escapeHtml(email)}</a>`)}
						${row("Sujet", escapeHtml(subject))}
					</table>
				</td></tr>
				<tr><td style="padding:24px 0;border-bottom:1px solid ${muted};line-height:1.7;">${escapeHtml(message).replace(/\r?\n/g, "<br>")}</td></tr>
				<tr><td style="padding-top:24px;">
					<a href="${escapeHtml(reply)}" style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:${ink};">Répondre</a>
				</td></tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`;

	return { subject: `[Portfolio] ${subject}`, text: textBody, html };
}
