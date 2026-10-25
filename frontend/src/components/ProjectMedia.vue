<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { config } from "../config";
import { iconPlay } from "../data/icons";
import type { Project } from "../data/projects";
import { formatTemplate } from "../lib/format";

const props = defineProps<{
	project: Project;
	/** A silent loop playing behind the project, instead of a player. */
	preview?: boolean;
}>();

const { noMediaLabel, posterAltTemplate } = config.projects;
const videoAttrs = props.preview
	? { muted: true, loop: true, preload: "none", tabindex: -1 }
	: {
			controls: true,
			controlslist: "nodownload noplaybackrate",
			disablePictureInPicture: true,
			preload: "metadata",
		};
</script>

<template>
  <div class="project-media">
    <video
      v-if="project.video"
      :src="project.video"
      :poster="project.poster"
      playsinline
      v-bind="videoAttrs"
    ></video>
    <img
      v-else-if="project.poster"
      :src="project.poster"
      :alt="formatTemplate(posterAltTemplate, { title: project.title })"
      loading="lazy"
    />
    <div v-else class="project-media-empty">
      <Icon :icon="iconPlay" :width="48" :height="48" />
      <span>{{ noMediaLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.project-media video,
.project-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-media-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
