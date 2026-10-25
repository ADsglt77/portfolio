<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import type { Technology } from "../config/types";

const props = defineProps<{ technologies: Technology[]; max?: number }>();

const shown = computed(() =>
	props.max ? props.technologies.slice(0, props.max) : props.technologies,
);
const hiddenCount = computed(
	() => props.technologies.length - shown.value.length,
);
</script>

<template>
  <div class="project-technologies">
    <span v-for="tech in shown" :key="tech.label" class="project-tech-tag">
      <Icon :icon="tech.icon" :width="18" :height="18" />
      <span>{{ tech.label }}</span>
    </span>
    <span v-if="hiddenCount > 0" class="project-tech-tag">
      <span>+{{ hiddenCount }}</span>
    </span>
  </div>
</template>

<style scoped>
.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.project-tech-tag {
  height: fit-content;
  color: var(--muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: color-mix(in srgb, var(--text) 3%, transparent);
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.project-tech-tag span {
  transition: all 0.3s ease;
}

.project-tech-tag:hover span {
  color: var(--text);
}
</style>
