import type { Ref } from "vue";

/** Types `fullText` into `textRef` over `duration` ms and returns a function cancelling it. */
export function typing(
	textRef: Ref<string>,
	fullText: string,
	duration = 3000,
): () => void {
	const chars = [...fullText];
	const delay = duration / chars.length;
	let index = 0;
	let timeoutId: number | undefined;

	const revealChar = () => {
		if (index < chars.length) {
			textRef.value += chars[index];
			index++;
			timeoutId = window.setTimeout(revealChar, delay);
		}
	};

	revealChar();
	return () => clearTimeout(timeoutId);
}
