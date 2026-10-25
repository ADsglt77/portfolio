interface ScrambleOptions {
	duration?: number;
	fps?: number;
	/** Afficher le texte directement sans effet (ex. mode sans animation) */
	skipAnimation?: boolean;
}

const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getRandomChar = () =>
	charset[Math.floor(Math.random() * charset.length)] ?? "A";

// The latest scramble of an element wins: one still running on it stops.
const latestRun = new WeakMap<HTMLElement, object>();

export function scrambleText(
	el: HTMLElement,
	finalText: string,
	options: ScrambleOptions = {},
): void {
	const run = {};
	latestRun.set(el, run);

	if (
		options.skipAnimation ||
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		el.textContent = finalText;
		return;
	}

	const { duration = 1000, fps = 10 } = options;
	const frameTime = 1000 / fps;
	const totalFrames = Math.ceil(duration / frameTime);
	let frame = 0;

	const animate = () => {
		if (latestRun.get(el) !== run) return;
		if (frame >= totalFrames) {
			el.textContent = finalText;
			return;
		}

		const progress = frame / totalFrames;
		let text = "";

		for (let i = 0; i < finalText.length; i++) {
			if (progress < 0.8) {
				text += getRandomChar();
			} else {
				const reveal = Math.floor(((progress - 0.8) / 0.2) * finalText.length);
				text += i <= reveal ? finalText[i] : getRandomChar();
			}
		}

		el.textContent = text;
		frame++;
		setTimeout(() => requestAnimationFrame(animate), frameTime);
	};

	animate();
}
