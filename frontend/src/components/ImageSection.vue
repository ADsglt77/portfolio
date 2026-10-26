<script setup lang="ts">
import gsap from "gsap";
import { ref } from "vue";
import { usePinnedTyping } from "../composables/usePinnedTyping";
import { useScrollScene } from "../composables/useScrollScene";

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
const imageRef = ref<HTMLImageElement | null>(null);

usePinnedTyping(sectionRef, props.title, displayedText, {
	threshold: 0.3,
	typingDuration: 800,
});

// The picture drifts inside its frame while the section crosses the screen.
useScrollScene(() => {
	gsap.fromTo(
		imageRef.value,
		{ objectPosition: "50% 15%" },
		{
			objectPosition: "50% 85%",
			ease: "none",
			scrollTrigger: {
				trigger: imageRef.value,
				start: "top bottom",
				end: "bottom top",
				scrub: true,
			},
		},
	);
});
</script>

<template>
	<section :id="id" ref="sectionRef" class="section image-section">
		<img ref="imageRef" :src="image.src" :alt="image.alt" loading="lazy" />
		<div class="title" :style="{ gridArea: titleArea }">
			<h2 class="heading-stroke" aria-hidden="true">{{ displayedText }}</h2>
			<h2 class="heading" :aria-label="title">
				<span aria-hidden="true">{{ displayedText }}</span>
			</h2>
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
	-webkit-text-fill-color: var(--text);
	z-index: 2;
}

:global(html.animations-off) .heading {
	opacity: 1;
	visibility: visible;
	color: var(--text);
	-webkit-text-fill-color: var(--text);
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
