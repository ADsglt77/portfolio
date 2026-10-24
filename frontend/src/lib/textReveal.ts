export const normalizeText = (text: string): string =>
	text.trim().replace(/\s+/g, " ");

function createHiddenChar(char: string): HTMLSpanElement {
	const span = document.createElement("span");
	span.textContent = char;
	span.style.opacity = "0";
	span.style.transition = "opacity 0.3s ease-out";
	return span;
}

/** Reveals the text character by character in random order and returns a function cancelling it. */
export function textReveal(
	element: HTMLElement,
	text: string,
	delay = 50,
): () => void {
	element.innerHTML = "";

	const words = normalizeText(text).split(" ");
	const spans: HTMLSpanElement[] = [];

	words.forEach((word, wordIndex) => {
		const wordSpan = document.createElement("span");
		wordSpan.style.display = "inline-block";
		wordSpan.style.whiteSpace = "nowrap";

		const chars = wordIndex < words.length - 1 ? [...word, " "] : [...word];
		for (const char of chars) {
			const charSpan = createHiddenChar(char);
			wordSpan.appendChild(charSpan);
			spans.push(charSpan);
		}

		element.appendChild(wordSpan);
	});

	// Fisher-Yates shuffle
	for (let i = spans.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[spans[i], spans[j]] = [spans[j]!, spans[i]!];
	}

	const timeoutIds = spans.map((span, i) =>
		window.setTimeout(() => {
			span.style.opacity = "1";
		}, i * delay),
	);
	return () => {
		for (const id of timeoutIds) clearTimeout(id);
	};
}
