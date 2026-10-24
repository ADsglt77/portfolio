import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inject, nextTick, onUnmounted, type Ref, watch } from "vue";
import { audioKey, useEntered } from "../injectionKeys";

gsap.registerPlugin(ScrollTrigger);

/**
 * The ambient crackle grows louder as the visitor walks toward the campfire: quiet at
 * the top of the page, full volume once `target` reaches the middle of the screen.
 * Sound is not motion, so this runs whatever the animations setting is.
 */
export function useCampfireSound(
	target: Ref<HTMLElement | null>,
	minVolume = 0.25,
) {
	const audio = inject(audioKey);
	const entered = useEntered();
	let trigger: ScrollTrigger | null = null;

	const setVolume = (progress: number) => {
		if (!audio?.value) return;
		const eased = progress * progress * (3 - 2 * progress);
		audio.value.volume = minVolume + (1 - minVolume) * eased;
	};

	watch(
		entered,
		async (isEntered) => {
			trigger?.kill();
			trigger = null;
			if (!isEntered) return;
			await nextTick();
			trigger = ScrollTrigger.create({
				trigger: target.value,
				// from one screen before the fire comes into view to the fire at the centre
				start: "top 200%",
				end: "center center",
				onUpdate: (self) => setVolume(self.progress),
				onRefresh: (self) => setVolume(self.progress),
			});
			setVolume(trigger.progress);
		},
		{ immediate: true },
	);

	onUnmounted(() => {
		trigger?.kill();
		if (audio?.value) audio.value.volume = 1;
	});
}
