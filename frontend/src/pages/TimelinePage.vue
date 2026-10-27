<script setup lang="ts">
import Timeline from "../components/Timeline.vue";
import { config } from "../config";

const { timelineSection } = config;
const orderedTimeline = [...config.timeline].reverse();
</script>

<template>
  <section id="timeline" class="section timeline" aria-labelledby="timeline-title">
    <header class="timeline-header">
      <h2 id="timeline-title">{{ timelineSection.title }}</h2>
    </header>
    <Timeline :items="orderedTimeline" />
  </section>
</template>

<style scoped>
.section.timeline {
  height: auto;
  min-height: 100dvh;
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.timeline-header {
  width: min(100%, var(--content-max));
  margin: 0 auto var(--spacing-3xl);
}

@media (max-width: 900px) {
	.section.timeline {
		padding: 7rem var(--spacing-lg) var(--spacing-3xl);
	}
}
</style>
