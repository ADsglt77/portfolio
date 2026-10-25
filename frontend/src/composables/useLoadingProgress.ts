import { onMounted, onUnmounted, ref } from "vue";

interface LoadingOptions {
	/** The hero picture, followed byte by byte. */
	image?: string;
	/** The bar never fills faster than this, so the intro keeps its rhythm. */
	minDuration?: number;
	/** After this, the site opens even if something is still loading. */
	timeout?: number;
}

// The ambient sound is left out on purpose: it starts muted, so waiting for it would
// only hold slow connections back.
const WEIGHTS = { fonts: 0.3, image: 0.7 };

async function trackDownload(url: string, onProgress: (ratio: number) => void) {
	const response = await fetch(url);
	const total = Number(response.headers.get("content-length")) || 0;
	if (!response.body || !total) {
		await response.blob();
		return;
	}
	const reader = response.body.getReader();
	let loaded = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) return;
		loaded += value.length;
		onProgress(Math.min(loaded / total, 1));
	}
}

/**
 * Loading screen progress driven by what the first screen really needs: the fonts and
 * the hero picture. The displayed value eases toward the real one.
 */
export function useLoadingProgress({
	image,
	minDuration = 1000,
	timeout = 8000,
}: LoadingOptions = {}) {
	const progress = ref(0);
	const ready = ref(false);
	const parts = { fonts: 0, image: image ? 0 : 1 };
	let rafId = 0;
	let displayed = 0;

	const set = (key: keyof typeof parts) => (ratio: number) => {
		parts[key] = Math.max(parts[key], ratio);
	};
	const real = () => parts.fonts * WEIGHTS.fonts + parts.image * WEIGHTS.image;

	onMounted(() => {
		const start = performance.now();

		document.fonts.ready.then(() => set("fonts")(1));
		if (image) {
			const done = () => set("image")(1);
			trackDownload(image, set("image")).then(done, done);
		}

		const tick = (now: number) => {
			const elapsed = now - start;
			const target = elapsed >= timeout ? 1 : real();
			// ease toward the real value (faster once everything is in), never ahead of the minimum duration
			displayed += (target - displayed) * (target >= 1 ? 0.3 : 0.12);
			if (target - displayed < 0.01) displayed = target;
			const shown = Math.min(displayed, elapsed / minDuration);
			progress.value = Math.min(100, Math.ceil(shown * 100));
			if (shown >= 1) {
				// let "100%" show before the loading line gives way to the button
				setTimeout(() => {
					ready.value = true;
				}, 150);
				return;
			}
			rafId = requestAnimationFrame(tick);
		};
		rafId = requestAnimationFrame(tick);
	});

	onUnmounted(() => cancelAnimationFrame(rafId));

	return { progress, ready };
}
