<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "../components/Button.vue";
import Timeline from "../components/Timeline.vue";
import { config } from "../config";

const showAll = ref(false);
const { timelineSection } = config;

const orderedTimeline = [...config.timeline].reverse();
const visibleItems = computed(() =>
	showAll.value
		? orderedTimeline
		: orderedTimeline.slice(0, timelineSection.featuredCount),
);
</script>

<template>
  <section id="timeline" class="section timeline" aria-labelledby="timeline-title">
    <header class="timeline-header">
      <h2 id="timeline-title">{{ timelineSection.title }}</h2>
    </header>
    <Timeline :key="showAll ? 'all' : 'featured'" :items="visibleItems" />
    <Button
      class="timeline-toggle"
      :label="showAll ? timelineSection.showLessLabel : timelineSection.showAllLabel"
      :aria-expanded="showAll"
      @click="showAll = !showAll"
    />
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

.timeline-toggle {
  margin-top: var(--spacing-md);
}

@media (max-width: 900px) {
	.section.timeline {
		padding: 7rem var(--spacing-lg) var(--spacing-3xl);
	}
}
</style>
