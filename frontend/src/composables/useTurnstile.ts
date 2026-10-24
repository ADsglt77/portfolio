import { onMounted, onUnmounted, type Ref, ref } from "vue";

type TurnstileApi = {
	render: (
		container: HTMLElement,
		options: {
			sitekey: string;
			callback: (token: string) => void;
			"expired-callback": () => void;
			"error-callback": () => void;
		},
	) => string;
	reset: (widgetId: string) => void;
	remove?: (widgetId: string) => void;
};

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE;
const TURNSTILE_SCRIPT_URL =
	"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const getTurnstile = (): TurnstileApi | undefined =>
	(window as Window & { turnstile?: TurnstileApi }).turnstile;

let scriptPromise: Promise<void> | null = null;

const loadTurnstileScript = (): Promise<void> => {
	if (getTurnstile()) return Promise.resolve();

	scriptPromise ??= new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = TURNSTILE_SCRIPT_URL;
		script.async = true;
		script.addEventListener("load", () => resolve(), { once: true });
		script.addEventListener(
			"error",
			() => {
				scriptPromise = null;
				script.remove();
				reject();
			},
			{ once: true },
		);
		document.head.append(script);
	});
	return scriptPromise;
};

/** Renders a Cloudflare Turnstile widget in `container` and exposes its token. */
export function useTurnstile(
	container: Ref<HTMLElement | null>,
	{ onError }: { onError: () => void },
) {
	const token = ref("");
	const loadError = ref(false);
	let widgetId: string | null = null;

	const render = () => {
		const api = getTurnstile();
		if (!api || !container.value || widgetId) return;

		widgetId = api.render(container.value, {
			sitekey: TURNSTILE_SITE_KEY,
			callback: (value) => {
				token.value = value;
			},
			"expired-callback": () => {
				token.value = "";
			},
			"error-callback": () => {
				token.value = "";
				onError();
			},
		});
	};

	const reset = () => {
		token.value = "";
		if (widgetId) getTurnstile()?.reset(widgetId);
	};

	onMounted(async () => {
		try {
			await loadTurnstileScript();
			render();
		} catch {
			loadError.value = true;
		}
	});

	onUnmounted(() => {
		if (widgetId) getTurnstile()?.remove?.(widgetId);
	});

	return { token, loadError, reset };
}
