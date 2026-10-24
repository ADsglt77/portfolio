/** Replaces each `{{key}}` placeholder of a config template with its value. */
export function formatTemplate(
	template: string,
	values: Record<string, string | number>,
): string {
	return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
		key in values ? String(values[key]) : match,
	);
}
