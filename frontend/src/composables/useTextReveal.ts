import { onUnmounted, type Ref } from "vue";
import { normalizeText, textReveal } from "../lib/textReveal";
import { useInViewAnimation } from "./useInViewAnimation";

export function useTextReveal(
	elementRef: Ref<HTMLElement | null>,
	text: string,
	{ threshold = 0.3, delay = 50 } = {},
) {
	let cancel = () => {};

	const setText = (content: string) => {
		cancel();
		if (elementRef.value) elementRef.value.textContent = content;
	};

	useInViewAnimation(elementRef, {
		threshold,
		enter: () => {
			if (elementRef.value) cancel = textReveal(elementRef.value, text, delay);
		},
		reset: () => setText(""),
		show: () => setText(normalizeText(text)),
	});

	onUnmounted(() => cancel());
}
