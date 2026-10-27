import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, type HtmlTagDescriptor, type Plugin } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";
import siteConfig from "./site.config.json";

/**
 * Writes the SEO meta tags, fonts and theme colors of site.config.json into
 * index.html, so crawlers and link previews see them without running JS.
 */
function siteHead(): Plugin {
	const { hero, site, social, theme } = siteConfig;
	const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
		tag: "meta",
		attrs,
	});

	const themeVars = [
		...Object.entries(theme.colors).map(
			([key, value]) => `--${key}: ${value};`,
		),
		`--font-title: "${theme.fonts.title}", sans-serif;`,
		`--font-mono: "${theme.fonts.mono}", monospace;`,
	].join(" ");
	const imageUrl = new URL(site.image, site.url).href;
	const structuredData = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Person",
		name: site.name,
		url: site.url,
		image: imageUrl,
		jobTitle: site.jobTitle,
		description: site.description,
		email: `mailto:${site.email}`,
		address: {
			"@type": "PostalAddress",
			addressLocality: site.location.replace(", France", ""),
			addressCountry: "FR",
		},
		worksFor: {
			"@type": "Organization",
			name: site.employer,
		},
		affiliation: {
			"@type": "CollegeOrUniversity",
			name: site.school,
		},
		knowsLanguage: ["fr", "en", "es"],
		sameAs: social.map((link) => link.url),
	});

	const tags: HtmlTagDescriptor[] = [
		{ tag: "title", children: site.title },
		meta({ name: "description", content: site.description }),
		meta({ name: "author", content: site.name }),
		meta({ name: "keywords", content: site.keywords.join(", ") }),
		meta({ name: "robots", content: "index, follow, max-image-preview:large" }),
		meta({ name: "theme-color", content: site.themeColor }),
		meta({ property: "og:type", content: "website" }),
		meta({ property: "og:locale", content: site.locale }),
		meta({ property: "og:site_name", content: site.name }),
		meta({ property: "og:title", content: site.title }),
		meta({ property: "og:description", content: site.description }),
		meta({ property: "og:url", content: site.url }),
		meta({ property: "og:image", content: imageUrl }),
		meta({ property: "og:image:type", content: "image/jpeg" }),
		meta({ property: "og:image:alt", content: `Portfolio de ${site.name}` }),
		meta({ name: "twitter:card", content: "summary_large_image" }),
		meta({ name: "twitter:title", content: site.title }),
		meta({ name: "twitter:description", content: site.description }),
		meta({ name: "twitter:image", content: imageUrl }),
		{ tag: "link", attrs: { rel: "canonical", href: site.url } },
		{
			tag: "link",
			attrs: {
				rel: "preload",
				as: "image",
				href: hero.backgroundImage,
				fetchpriority: "high",
			},
		},
		{
			tag: "script",
			attrs: { type: "application/ld+json" },
			children: structuredData,
		},
		{ tag: "style", children: `:root { ${themeVars} }` },
		{
			tag: "link",
			attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" },
		},
		{
			tag: "link",
			attrs: {
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossorigin: true,
			},
		},
		{
			tag: "link",
			attrs: { rel: "stylesheet", href: theme.fonts.googleFontsUrl },
		},
	];

	return {
		name: "site-head",
		transformIndexHtml: (html) => ({
			html: html.replace("<html>", `<html lang="${site.lang}">`),
			// After <meta charset>, which must stay in the first 1024 bytes
			tags: tags.map((tag) => ({ ...tag, injectTo: "head" as const })),
		}),
	};
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools(), siteHead()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		// The contact API is served by the Worker (`wrangler dev`, port 8787)
		proxy: { "/api": "http://localhost:8787" },
	},
});
