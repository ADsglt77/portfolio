import { onMounted, onUnmounted, ref } from "vue";

export function useMediaQuery(query: string) {
	const matches = ref(false);
	let mediaQuery: MediaQueryList | null = null;

	const update = (event?: MediaQueryListEvent) => {
		matches.value = event?.matches ?? mediaQuery?.matches ?? false;
	};

	onMounted(() => {
		mediaQuery = window.matchMedia(query);
		update();
		mediaQuery.addEventListener("change", update);
	});

	onUnmounted(() => mediaQuery?.removeEventListener("change", update));

	return matches;
}
