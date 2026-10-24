<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { computed, ref } from "vue";
import Button from "../components/Button.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { useScrollScene } from "../composables/useScrollScene";
import { config } from "../config";
import { iconExpand } from "../data/icons";
import { projects } from "../data/projects";

const INITIAL_COUNT = 6;

const showAll = ref(false);
const visibleProjects = computed(() =>
	showAll.value ? projects : projects.slice(0, INITIAL_COUNT),
);

const containerRef = ref<HTMLElement | null>(null);

useScrollScene(() => {
	const cards = [...(containerRef.value?.children ?? [])];
	// the cards' own hover transition would fight the entrance, so it is held until they land
	gsap.set(cards, { opacity: 0, y: 60, transition: "none" });
	ScrollTrigger.batch(cards, {
		start: "top 88%",
		once: true,
		onEnter: (batch) =>
			gsap.to(batch, {
				opacity: 1,
				y: 0,
				duration: 0.9,
				stagger: 0.12,
				ease: "power3.out",
				clearProps: "transition,transform,opacity",
			}),
	});
});
</script>

<template>
  <section id="projects" class="section projects">
    <div ref="containerRef" class="projects-container">
      <ProjectCard v-for="project in visibleProjects" :key="project.id" :project="project" />
    </div>
    <div v-if="visibleProjects.length < projects.length" class="projects-more">
      <Button :icon="iconExpand" :label="config.projects.seeAllLabel" @click="showAll = true" />
    </div>
  </section>
</template>

<style scoped>
.section.projects {
  height: 100%;
  padding: var(--spacing-3xl) var(--spacing-xl);
  min-height: auto;
}

.projects-container {
  width: 100%;
  max-width: 80vw;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-3xl);
}

.projects-more {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-3xl);
}

@media (max-width: 768px) {
  .projects-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
  }
}
</style>
