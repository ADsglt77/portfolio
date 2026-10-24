export interface FadeInOptions {
	duration?: number;
	delay?: number;
	translateY?: number;
}

export function setFadeState(
	element: HTMLElement,
	visible: boolean,
	translateY = 20,
): void {
	element.style.opacity = visible ? "1" : "0";
	element.style.transform = visible
		? "translate(0, 0)"
		: `translate(0, ${translateY}px)`;
}

/** Fades the element in and returns a function cancelling the pending animation. */
export function fadeIn(
	element: HTMLElement,
	options: FadeInOptions = {},
): () => void {
	const { duration = 800, delay = 0, translateY = 20 } = options;

	setFadeState(element, false, translateY);
	element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;

	const timeoutId = window.setTimeout(() => setFadeState(element, true), delay);
	return () => clearTimeout(timeoutId);
}
