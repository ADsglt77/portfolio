import { nextTick, onUnmounted, type Ref, watch } from "vue";
import { useAnimationsEnabled, useEntered } from "../injectionKeys";

interface InViewAnimation {
	threshold?: number;
	/** Plays the animation when the target enters the viewport. */
	enter: () => void;
	/** Restores the initial (hidden) state, also called when the target leaves the viewport. */
	reset: () => void;
	/** Shows the final state without animation. */
	show: () => void;
}

/**
 * Replays an animation each time the target scrolls into view once the site is entered,
 * or shows its final state directly when animations are disabled.
 */
export function useInViewAnimation(
	target: Ref<HTMLElement | null>,
	{ threshold = 0.3, enter, reset, show }: InViewAnimation,
) {
	const entered = useEntered();
	const animationsEnabled = useAnimationsEnabled();

	let observer: IntersectionObserver | null = null;
	let played = false;

	const disconnect = () => {
		observer?.disconnect();
		observer = null;
	};

	const apply = async () => {
		if (!entered.value) return;
		await nextTick();
		disconnect();

		if (!animationsEnabled.value) {
			show();
			return;
		}

		played = false;
		reset();
		if (!target.value) return;

		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && !played) {
						played = true;
						enter();
					} else if (!entry.isIntersecting && played) {
						played = false;
						reset();
					}
				}
			},
			{ threshold },
		);
		observer.observe(target.value);
	};

	watch([entered, animationsEnabled], apply, { immediate: true });
	onUnmounted(disconnect);
}
