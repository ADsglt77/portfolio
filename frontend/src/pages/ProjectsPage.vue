<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "../components/Button.vue";
import ProjectCard from "../components/ProjectCard.vue";
import { config } from "../config";
import { iconExpand } from "../data/icons";
import { projects } from "../data/projects";

const INITIAL_COUNT = 6;

const showAll = ref(false);
const visibleProjects = computed(() =>
	showAll.value ? projects : projects.slice(0, INITIAL_COUNT),
);
</script>

<template>
  <section id="projects" class="section projects">
    <div class="projects-container">
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
