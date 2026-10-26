<script setup lang="ts">
import { Icon } from "@iconify/vue";
import gsap from "gsap";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useScrollScene } from "../composables/useScrollScene";
import { config } from "../config";
import { iconFastArrowDown } from "../data/icons";
import { useEntered } from "../injectionKeys";

const { hero } = config;
const entered = useEntered();
const showElements = ref(false);
let revealTimer: number | undefined;

watch(
	entered,
	(val) => {
		if (revealTimer !== undefined) window.clearTimeout(revealTimer);
		if (val) {
			revealTimer = window.setTimeout(() => {
				showElements.value = true;
			}, 150);
		} else {
			showElements.value = false;
		}
	},
	{ immediate: true },
);

const sectionRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const veilRef = ref<HTMLElement | null>(null);

// Leaving the hero, the forest zooms in, the name rises into the fog and the
// screen darkens into the next section.
useScrollScene(() => {
	gsap
		.timeline({
			scrollTrigger: {
				trigger: sectionRef.value,
				start: "top top",
				end: "bottom top",
				scrub: true,
			},
		})
		.fromTo(
			sectionRef.value,
			{ "--hero-zoom": 1 },
			{ "--hero-zoom": 1.25, ease: "none" },
			0,
		)
		.to(
			titleRef.value,
			{ yPercent: -60, scale: 1.3, filter: "blur(10px)", ease: "none" },
			0,
		)
		.to(veilRef.value, { opacity: 0.9, ease: "none" }, 0);
});

const currentDay = ref("");
const currentTime = ref("");
let timeIntervalId: number | undefined;

onMounted(() => {
	const updateTime = () => {
		const now = new Date();
		currentDay.value = now.toLocaleDateString(undefined, {
			weekday: "long",
			day: "2-digit",
			month: "2-digit",
		});
		currentTime.value = now.toLocaleTimeString(undefined, {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	updateTime();
	timeIntervalId = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
	if (revealTimer !== undefined) window.clearTimeout(revealTimer);
	if (timeIntervalId !== undefined) {
		clearInterval(timeIntervalId);
	}
});
</script>

<template>
  <section id="home" ref="sectionRef" class="section home">
    <div :class="{ 'overlay--fade': entered }" class="overlay" aria-hidden="true"></div>
    <img
      class="bg immersive-bg"
      :src="hero.backgroundImage"
      alt=""
      fetchpriority="high"
      decoding="async"
    />
    <div class="bg-shade" aria-hidden="true"></div>
    <div ref="veilRef" class="hero-veil" aria-hidden="true"></div>
    <h1 ref="titleRef">{{ hero.displayName }}</h1>
    <div :class="{ 'visible slide-up': showElements }" class="scroll">
      <h5>{{ hero.scrollLabel }}</h5>
      <Icon class="scroll-icon" :icon="iconFastArrowDown" :width="20" :height="20" />
    </div>
    <h5 :class="{ 'visible slide-left': showElements }" class="meta day">
      {{ currentDay }}
    </h5>
    <h5 :class="{ 'visible slide-right': showElements }" class="meta time">
      {{ currentTime }}
    </h5>
  </section>
</template>

<style scoped>
.section.home {
  position: relative;
  overflow: hidden;
}

.overlay {
  position: absolute;
  inset: 0;
  background: var(--bg);
  z-index: 0;
  opacity: 1;
  pointer-events: none;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
	width: 100%;
	height: 100%;
	object-fit: cover;
  opacity: 1;
  scale: var(--hero-zoom, 1);
}

.bg-shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.hero-veil {
  position: absolute;
  inset: 0;
  background: var(--bg);
  opacity: 0;
  pointer-events: none;
}

h1 {
  color: var(--text);
  opacity: 1 !important;
  z-index: 100 !important;
}

.scroll {
  position: absolute;
  bottom: var(--spacing-xl);
  left: 0;
  right: 0;
  gap: var(--spacing-md);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px);
}

.meta {
  position: absolute;
  bottom: var(--spacing-3xl);
  color: var(--muted);
  z-index: 1;
  opacity: 0;
}

.meta.day {
  left: var(--spacing-3xl);
  transform: translateX(-30px);
}

.meta.time {
  right: var(--spacing-3xl);
  transform: translateX(30px);
}

@media (max-width: 900px) {
  .meta {
    bottom: var(--spacing-xl);
  }

  .meta.day {
    left: var(--spacing-xl);
    transform: translateX(-10px);
  }

  .meta.time {
    right: var(--spacing-xl);
    transform: translateX(10px);
  }
}
</style>
