<script setup lang="ts">
import { Icon } from "@iconify/vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ref } from "vue";
import { useScrollScene } from "../composables/useScrollScene";
import { technologiesList } from "../data/technologies";

// Each row renders its list twice so the -50% translation loops seamlessly.
const rows = [
	{ direction: "left", items: technologiesList },
	{ direction: "right", items: [...technologiesList].reverse() },
].map((row) => ({ ...row, items: [...row.items, ...row.items] }));

const sectionRef = ref<HTMLElement | null>(null);
const trackRefs = ref<HTMLElement[]>([]);

useScrollScene(() => {
	const animations = trackRefs.value.flatMap((track) => track.getAnimations());
	let velocity = 0;
	let rate = 1;
	ScrollTrigger.create({
		trigger: sectionRef.value,
		start: "top bottom",
		end: "bottom top",
		onUpdate: (self) => {
			velocity = self.getVelocity();
		},
	});
	const tick = () => {
		velocity *= 0.9;
		const target =
			(velocity < -1 ? -1 : 1) * (1 + Math.min(Math.abs(velocity) / 300, 8));
		rate += (target - rate) * 0.1;
		for (const animation of animations) animation.playbackRate = rate;
	};
	gsap.ticker.add(tick);
	return () => {
		gsap.ticker.remove(tick);
		for (const animation of animations) animation.playbackRate = 1;
	};
});
</script>

<template>
  <section id="tech" ref="sectionRef" class="section technologies">
    <div
      v-for="row in rows"
      :key="row.direction"
      :class="['tech-row', `tech-row--${row.direction}`]"
    >
      <div ref="trackRefs" class="tech-row-inner">
        <div
          v-for="(tech, index) in row.items"
          :key="index"
          class="tech-item"
          :aria-hidden="index >= row.items.length / 2 || undefined"
        >
          <Icon :icon="tech.icon" :width="36" :height="36" />
          <h3>{{ tech.label }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section.technologies {
  min-height: 0;
  height: 50vh;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3xl);
}

.tech-row {
  width: 100%;
  overflow: hidden;
}

.tech-row-inner {
  display: flex;
  width: max-content;
  gap: var(--spacing-md);
  text-transform: uppercase;
}

.tech-row--left .tech-row-inner {
  animation: tech-scroll-left 45s linear infinite;
}

.tech-row--right .tech-row-inner {
  animation: tech-scroll-right 45s linear infinite;
}

.tech-row:has(.tech-item:hover) .tech-row-inner {
  animation-play-state: paused;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--muted);
}

.tech-item h3 {
  line-height: 0;
  transition:
    color 0.25s ease,
    -webkit-text-stroke 0.25s ease;
}

.tech-item:nth-child(odd) h3 {
  color: var(--text);
}

.tech-item:nth-child(even) h3 {
  color: transparent;
  -webkit-text-stroke: 1px var(--text);
}

.tech-item:nth-child(odd):hover h3 {
  color: transparent;
  -webkit-text-stroke: 1px var(--text);
}

.tech-item:nth-child(even):hover h3 {
  color: var(--text);
  -webkit-text-stroke: none;
}
</style>
