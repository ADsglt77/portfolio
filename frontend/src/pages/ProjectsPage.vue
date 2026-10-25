<script setup lang="ts">
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ref, watch } from "vue";
import Button from "../components/Button.vue";
import ProjectLinks from "../components/ProjectLinks.vue";
import ProjectMedia from "../components/ProjectMedia.vue";
import ProjectSheet from "../components/ProjectSheet.vue";
import ProjectTags from "../components/ProjectTags.vue";
import { glideTo } from "../composables/useLenis";
import { useProjectToShow } from "../composables/useProjectToShow";
import { useScrollScene } from "../composables/useScrollScene";
import { config } from "../config";
import { iconExpand } from "../data/icons";
import { type Project, projects } from "../data/projects";
import { useAnimationsEnabled } from "../injectionKeys";
import { scrambleText } from "../lib/textScramble";

const MAX_TECHNOLOGIES = 4;
const { detailsLabel } = config.projects;

// With animations on, the section is a pinned "cinema": one project fills the screen at
// a time and the scroll moves to the next one. With animations off, the projects are
// simply stacked.
const animationsEnabled = useAnimationsEnabled();
const sectionRef = ref<HTMLElement | null>(null);
const stageRef = ref<HTMLElement | null>(null);
const slideRefs = ref<HTMLElement[]>([]);
const active = ref(0);
let stageVisible = false;
let cinema: ScrollTrigger | undefined;

const playActiveVideo = () => {
	slideRefs.value.forEach((slide, i) => {
		const video = slide.querySelector("video");
		if (!video) return;
		if (animationsEnabled.value && stageVisible && i === active.value) {
			video.play().catch(() => {});
		} else {
			video.pause();
		}
	});
};

const revealTitle = (index: number) => {
	const title =
		slideRefs.value[index]?.querySelector<HTMLElement>(".slide-title");
	const project = projects[index];
	if (title && project) scrambleText(title, project.title);
};

watch(active, (index) => {
	revealTitle(index);
	playActiveVideo();
});

useScrollScene(() => {
	const slides = slideRefs.value;
	const count = slides.length;
	if (!stageRef.value || count < 2) return;
	const media = slides.map((slide) => slide.querySelector(".slide-media"));
	const content = slides.map((slide) => slide.querySelector(".slide-content"));

	// waiting projects start hidden, their picture slightly closer, their text lower
	gsap.set(slides.slice(1), { autoAlpha: 0 });
	gsap.set(media.slice(1), { scale: 1.12 });
	gsap.set(content.slice(1), { autoAlpha: 0, y: 60 });
	const timeline = gsap.timeline({
		scrollTrigger: {
			trigger: stageRef.value,
			start: "top top",
			end: () => `+=${(count - 1) * window.innerHeight}`,
			pin: true,
			scrub: true,
			invalidateOnRefresh: true,
			onUpdate: (self) => {
				active.value = Math.round(self.progress * (count - 1));
			},
		},
	});
	// Moving to the next project: the current one plunges forward and fades its text,
	// the next one settles in on top of it, then its text rises.
	for (let i = 1; i < count; i++) {
		const at = i - 1;
		timeline
			.to(
				content[i - 1] ?? [],
				{ autoAlpha: 0, y: -60, duration: 0.35, ease: "power1.in" },
				at,
			)
			.to(media[i - 1] ?? [], { scale: 1.15, duration: 1, ease: "none" }, at)
			.fromTo(
				slides[i] ?? [],
				{ autoAlpha: 0 },
				{ autoAlpha: 1, duration: 0.45, ease: "none", immediateRender: false },
				at + 0.25,
			)
			.fromTo(
				media[i] ?? [],
				{ scale: 1.12 },
				{ scale: 1, duration: 1, ease: "none", immediateRender: false },
				at,
			)
			.fromTo(
				content[i] ?? [],
				{ autoAlpha: 0, y: 60 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.3,
					ease: "power1.out",
					immediateRender: false,
				},
				at + 0.65,
			)
			.set(slides[i - 1] ?? [], { autoAlpha: 0 }, at + 0.7);
	}
	cinema = timeline.scrollTrigger;

	// the section (not the pinned stage) spans the whole pinned run
	ScrollTrigger.create({
		trigger: sectionRef.value,
		start: "top bottom",
		end: "bottom top",
		onToggle: (self) => {
			stageVisible = self.isActive;
			playActiveVideo();
		},
		onEnter: () => revealTitle(active.value),
	});

	return () => {
		// back to the stacked layout: every video stops on its poster again
		cinema = undefined;
		stageVisible = false;
		for (const video of stageRef.value?.querySelectorAll("video") ?? []) {
			video.pause();
			video.load();
		}
	};
});

// Asked from another section, glide to a project: in the cinema it sits at its share
// of the pinned run, stacked it is its own block.
const projectToShow = useProjectToShow();
watch(projectToShow, (index) => {
	if (index === null) return;
	projectToShow.value = null;
	const target = cinema
		? cinema.start +
			(cinema.end - cinema.start) * (index / (projects.length - 1))
		: slideRefs.value[index];
	if (target !== undefined) glideTo(target);
});

// The detail sheet opens from where it was asked for.
const selected = ref<Project | null>(null);
const origin = ref({ x: 0, y: 0 });
const openSheet = (project: Project, event: MouseEvent) => {
	const target = event.currentTarget as HTMLElement | null;
	const rect = target?.getBoundingClientRect();
	const fromKeyboard = event.clientX === 0 && event.clientY === 0;
	origin.value =
		fromKeyboard && rect
			? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
			: { x: event.clientX, y: event.clientY };
	selected.value = project;
};
</script>

<template>
  <section id="projects" ref="sectionRef" class="section projects">
    <div ref="stageRef" class="projects-stage" :class="{ 'is-cinema': animationsEnabled }">
      <article
        v-for="(project, index) in projects"
        :key="project.id"
        ref="slideRefs"
        class="slide"
        :inert="(animationsEnabled && index !== active) || undefined"
      >
        <ProjectMedia :project="project" preview class="slide-media" aria-hidden="true" />
        <div class="slide-shade" aria-hidden="true"></div>

        <div class="slide-content">
          <p class="slide-count">{{ index + 1 }} / {{ projects.length }}</p>
          <h3 class="slide-title">{{ project.title }}</h3>
          <p class="slide-description">{{ project.description }}</p>
          <ProjectTags :technologies="project.technologies" :max="MAX_TECHNOLOGIES" />
          <div class="slide-actions">
            <Button :icon="iconExpand" :label="detailsLabel" @click="openSheet(project, $event)" />
            <ProjectLinks :links="project.links" />
          </div>
        </div>
      </article>
    </div>

    <ProjectSheet :project="selected" :origin="origin" @close="selected = null" />
  </section>
</template>

<style scoped>
.section.projects {
  display: block;
  height: auto;
  min-height: auto;
  padding: 0;
}

.projects-stage {
  position: relative;
}

.slide {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.projects-stage.is-cinema {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.projects-stage.is-cinema .slide {
  position: absolute;
  inset: 0;
}

.projects-stage.is-cinema .slide:not(:first-of-type) {
  visibility: hidden;
  opacity: 0;
}

.slide-media {
  position: absolute;
  inset: 0;
}

.slide-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.45) 45%,
    var(--bg)
  );
}

.slide-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 60rem;
  padding: var(--spacing-3xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.slide-title {
  font-size: clamp(2.5rem, 7vw, 6rem);
  line-height: 1;
  text-transform: uppercase;
}

.slide-description {
  max-width: 60ch;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.slide-count {
  color: var(--muted);
}

@media (max-width: 900px) {
  .slide-content {
    padding: var(--spacing-xl);
  }
}
</style>
