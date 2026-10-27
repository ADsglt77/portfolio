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
  <div class="project-media" :class="{ 'project-media--preview': preview }">
    <img
      v-if="project.video && preview && project.poster"
      class="media-backdrop"
      :src="project.poster"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
    <video
      v-if="project.video"
      class="media-video"
      :src="project.video"
      :poster="project.poster"
      playsinline
      v-bind="videoAttrs"
    ></video>
    <img
      v-else-if="project.poster"
      class="media-poster"
      :src="project.poster"
      :alt="formatTemplate(posterAltTemplate, { title: project.title })"
      loading="lazy"
			decoding="async"
    />
    <div v-else class="project-media-empty">
      <Icon :icon="iconPlay" :width="48" :height="48" />
      <span>{{ noMediaLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.project-media {
  position: relative;
  overflow: hidden;
  background: color-mix(in srgb, var(--text) 3%, var(--bg));
}

.media-video,
.media-poster {
  width: 100%;
  height: 100%;
}

.media-video {
  position: relative;
  z-index: 1;
  object-fit: contain;
}

.media-poster {
  object-fit: cover;
}

.media-backdrop {
  position: absolute;
  inset: -2rem;
  width: calc(100% + 4rem);
  height: calc(100% + 4rem);
  object-fit: cover;
  filter: blur(28px) brightness(0.55);
  transform: scale(1.08);
  opacity: 0.85;
}

.project-media--preview .media-video {
  padding: clamp(1rem, 4vw, 3rem);
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
