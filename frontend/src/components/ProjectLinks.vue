<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { config } from "../config";
import type { ProjectLinks as Links } from "../config/types";
import { iconGithub, iconLink, iconPdf } from "../data/icons";

const LINK_TYPES: Array<{
	key: keyof Links;
	icon: string;
	external: boolean;
}> = [
	{ key: "readmePdf", icon: iconPdf, external: false },
	{ key: "website", icon: iconLink, external: true },
	{ key: "github", icon: iconGithub, external: true },
];

const props = defineProps<{ links: Links; withLabels?: boolean }>();

const { ariaLabels } = config.projects;

const actions = computed(() =>
	LINK_TYPES.flatMap(({ key, icon, external }) => {
		const href = props.links[key];
		return href ? [{ icon, href, external, label: ariaLabels[key] }] : [];
	}),
);
</script>

<template>
  <div class="project-actions">
    <a
      v-for="action in actions"
      :key="action.icon"
      :href="action.href"
      class="project-action"
      :aria-label="withLabels ? undefined : action.label"
      :target="action.external ? '_blank' : undefined"
      :rel="action.external ? 'noopener noreferrer' : undefined"
    >
      <Icon :icon="action.icon" :width="24" :height="24" />
      <span v-if="withLabels">{{ action.label }}</span>
    </a>
  </div>
</template>

<style scoped>
.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.project-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--text);
  padding: var(--spacing-sm);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--text) 5%, transparent);
  transition: all 0.3s ease;
}

.project-action:has(span) {
  padding-right: var(--spacing-md);
}

.project-action:hover {
  border-color: var(--glass-border-hover);
  background: color-mix(in srgb, var(--text) 10%, transparent);
}
</style>
