import { onUnmounted, type Ref } from "vue";
import { type FadeInOptions, fadeIn, setFadeState } from "../lib/fadeIn";
import { useInViewAnimation } from "./useInViewAnimation";

export function useFadeIn(
	elementRef: Ref<HTMLElement | null>,
	{ threshold, ...fadeOptions }: FadeInOptions & { threshold?: number } = {},
) {
	let cancel = () => {};

	const setVisible = (visible: boolean) => {
		cancel();
		if (elementRef.value) {
			setFadeState(elementRef.value, visible, fadeOptions.translateY);
		}
	};

	useInViewAnimation(elementRef, {
		threshold,
		enter: () => {
			if (elementRef.value) cancel = fadeIn(elementRef.value, fadeOptions);
		},
		reset: () => setVisible(false),
		show: () => setVisible(true),
	});

	onUnmounted(() => cancel());
}
