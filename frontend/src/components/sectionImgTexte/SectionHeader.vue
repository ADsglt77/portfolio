<script setup lang="ts">
interface Props {
	imageSrc: string;
	imageAlt: string;
}

defineProps<Props>();
</script>

<template>
	<img :src="imageSrc" :alt="imageAlt" loading="lazy" />
</template>

<style scoped>
img {
	width: 100%;
	height: clamp(360px, 90vh, 760px);
	object-fit: cover;
	border-radius: var(--radius-lg);
	border: 1px solid var(--glass-border);
	grid-area: 1 / 1 / 7 / 3;
	align-self: start;
}

@media (max-width: 900px) {
	img {
		height: clamp(240px, 40vh, 400px);
	}
}
</style>
