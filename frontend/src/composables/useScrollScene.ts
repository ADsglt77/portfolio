import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { nextTick, onUnmounted, type Ref, watch } from "vue";
import { useAnimationsEnabled, useEntered } from "../injectionKeys";

gsap.registerPlugin(ScrollTrigger);

/**
 * Builds scroll-linked GSAP animations once the site is entered, and reverts them
 * (back to the page's own styles) when animations are turned off or on unmount.
 * `build` runs inside a gsap.context and may return a cleanup function.
 */
export function useScrollScene(
	build: () => void | (() => void),
	dependencies: Ref<unknown>[] = [],
) {
	const entered = useEntered();
	const animationsEnabled = useAnimationsEnabled();
	let ctx: gsap.Context | null = null;

	const apply = async () => {
		ctx?.revert();
		ctx = null;
		if (!entered.value || !animationsEnabled.value) return;
		await nextTick();
		ctx = gsap.context(build);
		ScrollTrigger.refresh();
	};

	watch([entered, animationsEnabled, ...dependencies], apply, {
		immediate: true,
	});
	onUnmounted(() => ctx?.revert());
}
