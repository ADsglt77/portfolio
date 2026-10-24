import { onUnmounted, type Ref } from "vue";
import { typing } from "../lib/typing";
import { useInViewAnimation } from "./useInViewAnimation";

export function usePinnedTyping(
	sectionRef: Ref<HTMLElement | null>,
	fullText: string,
	displayedText: Ref<string>,
	{ typingDuration = 3000, threshold = 0.3 } = {},
) {
	let cancel = () => {};

	const setText = (text: string) => {
		cancel();
		displayedText.value = text;
	};

	useInViewAnimation(sectionRef, {
		threshold,
		enter: () => {
			setText("");
			cancel = typing(displayedText, fullText, typingDuration);
		},
		reset: () => setText(""),
		show: () => setText(fullText),
	});

	onUnmounted(() => cancel());
}
