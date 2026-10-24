<script setup lang="ts">
import { ref } from "vue";
import { usePinnedTyping } from "../composables/usePinnedTyping";

interface Props {
	id: string;
	title: string;
	image: { src: string; alt: string };
	/** Grid area of the typed title on desktop. */
	titleArea: string;
}

const props = defineProps<Props>();

const sectionRef = ref<HTMLElement | null>(null);
const displayedText = ref("");

usePinnedTyping(sectionRef, props.title, displayedText, {
	threshold: 0.3,
	typingDuration: 2000,
});
</script>

<template>
	<section :id="id" ref="sectionRef" class="section image-section">
		<img :src="image.src" :alt="image.alt" loading="lazy" />
		<div class="title" :style="{ gridArea: titleArea }">
			<h2 class="heading-stroke" aria-hidden="true">{{ displayedText }}</h2>
			<h2 class="heading">{{ displayedText }}</h2>
		</div>
		<slot />
	</section>
</template>

<style scoped>
.section.image-section {
	width: 100%;
	height: 100%;
	padding: var(--spacing-3xl) var(--spacing-xl);
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(6, 1fr);
	gap: var(--spacing-xl);
}

img {
	width: 100%;
	height: clamp(360px, 90vh, 760px);
	object-fit: cover;
	border-radius: var(--radius-lg);
	border: 1px solid var(--glass-border);
	grid-area: 1 / 1 / 7 / 3;
	align-self: start;
}

.title {
	position: relative;
	align-self: center;
}

.title h2 {
	position: absolute;
	text-transform: uppercase;
}

.heading-stroke {
	color: transparent;
	-webkit-text-stroke: 40px var(--bg);
	z-index: 1;
}

.heading {
	color: var(--text);
	z-index: 2;
}

@media (max-width: 900px) {
	.section.image-section {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	img {
		height: clamp(240px, 40vh, 400px);
	}

	.title h2 {
		position: static;
		min-width: 90vw;
	}

	.heading-stroke {
		display: none;
	}
}
</style>
