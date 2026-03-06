<script setup lang="ts">
interface Props {
	imageSrc: string;
	imageAlt: string;
	displayedText: string;
	strokeLeft?: string;
}

const props = withDefaults(defineProps<Props>(), {
	strokeLeft: "-200px",
});
</script>

<template>
	<div class="section-header">
		<img :src="imageSrc" :alt="imageAlt" loading="lazy" />
		<div class="title">
			<div class="heading-stroke-container">
				<h2 class="heading-stroke" :style="{ left: strokeLeft }">{{ displayedText }}</h2>
				<h2 class="heading" :style="{ left: strokeLeft }">{{ displayedText }}</h2>
			</div>
		</div>
	</div>
</template>

<style scoped>
.section-header {
	display: contents;
}

img {
	width: 100%;
	height: clamp(360px, 90vh, 760px);
	object-fit: cover;
	border-radius: var(--radius-lg);
	border: 1px solid var(--glass-border);
	grid-row: 1 / 3;
}

.title {
	align-self: center;
}

.heading-stroke-container {
	position: relative;
}

.heading-stroke-container h2 {
	position: absolute;
	text-transform: uppercase;
}

.heading-stroke {
	color: transparent;
	-webkit-text-stroke: 40px var(--bg);
	z-index: 1;
	clip-path: none;
}

.heading {
	color: var(--text);
	z-index: 2;
	clip-path: none;
}

@media (max-width: 900px) {
	img {
		height: clamp(240px, 44vh, 400px);
	}

	.heading-stroke-container h2 {
		position: static;
		left: 0;
	}
}
</style>
