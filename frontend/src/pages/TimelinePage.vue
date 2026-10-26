<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "../components/Button.vue";
import Timeline from "../components/Timeline.vue";
import { useFadeIn } from "../composables/useFadeIn";
import { config } from "../config";

const showAll = ref(false);
const headerRef = ref<HTMLElement | null>(null);
const { timelineSection } = config;

const orderedTimeline = [...config.timeline].reverse();
const visibleItems = computed(() =>
	showAll.value
		? orderedTimeline
		: orderedTimeline.slice(0, timelineSection.featuredCount),
);

useFadeIn(headerRef, { threshold: 0.2, duration: 650, translateY: 24 });
</script>

<template>
  <section id="timeline" class="section timeline" aria-labelledby="timeline-title">
    <header ref="headerRef" class="timeline-header">
      <p class="section-eyebrow">{{ timelineSection.eyebrow }}</p>
      <h2 id="timeline-title">{{ timelineSection.title }}</h2>
      <p>{{ timelineSection.intro }}</p>
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
  padding: clamp(6rem, 10vw, 10rem) var(--page-gutter);
}

.timeline-header {
  width: min(100%, var(--content-max));
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
  align-items: end;
  gap: var(--spacing-xl) var(--spacing-3xl);
  margin-bottom: var(--spacing-3xl);
}

.timeline-header .section-eyebrow,
.timeline-header h2 {
  grid-column: 1;
}

.timeline-header h2 {
  max-width: 14ch;
}

.timeline-header > p:last-child {
  grid-column: 2;
  grid-row: 1 / span 2;
  max-width: 48ch;
  color: var(--muted);
}

.timeline-toggle {
  margin-top: var(--spacing-md);
}

@media (max-width: 900px) {
	.section.timeline {
		padding: 6rem var(--page-gutter);
	}

	.timeline-header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-md);
		margin-bottom: var(--spacing-2xl);
	}
}
</style>
