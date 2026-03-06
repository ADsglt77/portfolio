<script setup lang="ts">
interface Props {
	text: string;
	gridArea?: string;
}

const props = withDefaults(defineProps<Props>(), {
	gridArea: "1 / 2 / 3 / 5",
});
</script>

<template>
	<div class="title" :style="{ gridArea: props.gridArea }">
		<div class="heading-stroke-container">
			<h2 class="heading-stroke">{{ text }}</h2>
			<h2 class="heading">{{ text }}</h2>
		</div>
	</div>
</template>

<style scoped>
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
	.heading-stroke-container h2 {
		position: static;
	}
}
</style>
