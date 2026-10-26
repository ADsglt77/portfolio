<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { inject, nextTick, ref, watch } from "vue";
import { config } from "../config";
import { iconCancel } from "../data/icons";
import type { Project } from "../data/projects";
import { lenisKey, useAnimationsEnabled } from "../injectionKeys";
import Button from "./Button.vue";
import ProjectLinks from "./ProjectLinks.vue";
import ProjectMedia from "./ProjectMedia.vue";
import ProjectTags from "./ProjectTags.vue";

const props = defineProps<{
	project: Project | null;
	/** Where the sheet opens from, in viewport pixels. */
	origin: { x: number; y: number };
}>();
const emit = defineEmits<{ close: [] }>();

const { closeLabel } = config.projects;
const dialogRef = ref<HTMLDialogElement | null>(null);
const getLenis = inject(lenisKey);
const animationsEnabled = useAnimationsEnabled();
let returnFocus: HTMLElement | null = null;

// The sheet opens as a circle growing from the button, and closes back into it.
const reveal = (opening: boolean) => {
	const dialog = dialogRef.value;
	if (!dialog || !animationsEnabled.value) return Promise.resolve();
	const at = `${props.origin.x}px ${props.origin.y}px`;
	const closed = `circle(0% at ${at})`;
	const open = `circle(150% at ${at})`;
	return dialog
		.animate(
			{ clipPath: opening ? [closed, open] : [open, closed] },
			{
				duration: opening ? 750 : 450,
				easing: "cubic-bezier(0.76, 0, 0.24, 1)",
			},
		)
		.finished.then(
			() => {},
			() => {},
		);
};

watch(
	() => props.project,
	async (project) => {
		const dialog = dialogRef.value;
		if (!dialog || !project || dialog.open) return;
		returnFocus = document.activeElement as HTMLElement | null;
		await nextTick();
		getLenis?.()?.stop();
		document.documentElement.style.overflow = "hidden";
		dialog.showModal();
		dialog.querySelector<HTMLElement>(".sheet-close")?.focus();
		reveal(true);
	},
);

const close = async () => {
	const dialog = dialogRef.value;
	if (!dialog?.open) return;
	dialog.querySelector("video")?.pause();
	await reveal(false);
	dialog.close();
};

const onClosed = () => {
	document.documentElement.style.overflow = "";
	getLenis?.()?.start();
	returnFocus?.focus();
	emit("close");
};
</script>

<template>
  <dialog
    ref="dialogRef"
    class="sheet"
    aria-labelledby="project-sheet-title"
    @cancel.prevent="close"
    @close="onClosed"
  >
    <div v-if="project" class="sheet-inner" data-lenis-prevent>
      <Button
        class="sheet-close"
        padding="0.6rem"
        borderRadius="50%"
        :aria-label="closeLabel"
        @click="close"
      >
        <Icon :icon="iconCancel" :width="18" :height="18" :stroke-width="3" />
      </Button>

      <ProjectMedia :project="project" class="sheet-media" />

      <div class="sheet-body">
        <h3 id="project-sheet-title" class="sheet-title">{{ project.title }}</h3>
        <p>{{ project.description }}</p>
        <ProjectTags :technologies="project.technologies" />
        <ProjectLinks :links="project.links" with-labels />
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.sheet {
  width: 100vw;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--bg);
  color: var(--text);
}

.sheet::backdrop {
  background: transparent;
}

.sheet-inner {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  align-items: center;
  gap: var(--spacing-3xl);
  padding: var(--spacing-3xl);
}

.sheet-close {
  position: absolute;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: 2;
}

.sheet-media {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: color-mix(in srgb, var(--text) 3%, transparent);
}

.sheet-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.sheet-title {
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  text-transform: uppercase;
}

@media (max-width: 900px) {
  .sheet-inner {
    grid-template-columns: 1fr;
    align-items: start;
    gap: var(--spacing-xl);
    padding: calc(var(--spacing-3xl) + var(--spacing-md)) var(--spacing-xl) var(--spacing-xl);
  }

  .sheet-close {
    top: var(--spacing-md);
    right: var(--spacing-md);
  }
}
</style>
