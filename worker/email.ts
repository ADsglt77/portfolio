import siteConfig from "../frontend/site.config.json";

const { site, theme } = siteConfig;
const { bg, text, muted } = theme.colors;
// Mail clients that cannot load the site's fonts fall back on close ones.
const TITLE_FONT = `'${theme.fonts.title}', 'Trebuchet MS', Arial, sans-serif`;
const MONO_FONT = `'${theme.fonts.mono}', 'Courier New', monospace`;

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
		<td style="padding:6px 0;color:${text};">${value}</td>
	</tr>`;

/** The mail sent to the site's owner for a contact form message, as text and HTML. */
export function contactEmail({
	name,
	email,
	subject,
	message,
}: ContactMessage) {
	const host = new URL(site.url).host;
	const reply = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;

	const textBody = [
		`Nouveau message depuis ${host}`,
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
	<meta name="color-scheme" content="dark">
	<meta name="supported-color-schemes" content="dark">
	<link href="${escapeHtml(theme.fonts.googleFontsUrl)}" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${bg};">
	<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(`${name} : ${message.slice(0, 120)}`)}</div>
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${bg}" style="background:${bg};">
		<tr><td align="center" style="padding:40px 16px;">
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${MONO_FONT};font-size:14px;line-height:1.6;color:${text};">
				<tr><td style="font-family:${TITLE_FONT};font-size:34px;font-weight:700;line-height:1.1;text-transform:uppercase;color:${text};">Nouveau message</td></tr>
				<tr><td style="padding:8px 0 24px;color:${muted};">depuis <a href="${escapeHtml(site.url)}" style="color:${muted};">${escapeHtml(host)}</a></td></tr>
				<tr><td>
					<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:${MONO_FONT};font-size:14px;">
						${row("Nom", escapeHtml(name))}
						${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${text};">${escapeHtml(email)}</a>`)}
						${row("Sujet", escapeHtml(subject))}
					</table>
				</td></tr>
				<tr><td style="padding:24px 0;border-bottom:1px solid ${muted};line-height:1.7;">${escapeHtml(message).replace(/\r?\n/g, "<br>")}</td></tr>
				<tr><td style="padding-top:24px;">
					<a href="${escapeHtml(reply)}" style="font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:${text};">Répondre</a>
				</td></tr>
				<tr><td style="padding-top:24px;font-size:12px;color:${muted};">Envoyé depuis le formulaire de contact de ${escapeHtml(host)}</td></tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`;

	return { subject: `[Portfolio] ${subject}`, text: textBody, html };
}
