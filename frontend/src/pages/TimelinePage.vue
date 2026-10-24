<script setup lang="ts">
import Timeline from "../components/Timeline.vue";
import { config } from "../config";
</script>

<template>
  <section id="timeline" class="section timeline">
    <Timeline :items="config.timeline" />
  </section>
</template>

<style scoped>
.section.timeline {
  height: 100%;
  padding: var(--spacing-3xl) var(--spacing-xl);
}

@media (max-width: 900px) {
	.section.timeline {
		padding: var(--spacing-lg);
	}
}
</style>
