<script setup lang="ts">
import { Icon } from "@iconify/vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { nextTick, onUnmounted, ref, watch } from "vue";
import { useScrollScene } from "../composables/useScrollScene";
import type { TimelineItem } from "../config/types";
import { iconFormation, iconWork } from "../data/icons";
import { useAnimationsEnabled, useEntered } from "../injectionKeys";
import { fadeIn, setFadeState } from "../lib/fadeIn";

const TRANSLATE_Y = 30;

defineProps<{ items: TimelineItem[] }>();

const entered = useEntered();
const animationsEnabled = useAnimationsEnabled();
const contentRefs = ref<HTMLElement[]>([]);
const containerRef = ref<HTMLElement | null>(null);
const lineFillRef = ref<HTMLElement | null>(null);
const markerRefs = ref<HTMLElement[]>([]);

useScrollScene(() => {
	gsap.to(lineFillRef.value, {
		scaleY: 1,
		ease: "none",
		scrollTrigger: {
			trigger: containerRef.value,
			start: "top 60%",
			end: "bottom 60%",
			scrub: true,
		},
	});
	for (const marker of markerRefs.value) {
		ScrollTrigger.create({
			trigger: marker,
			start: "center 60%",
			endTrigger: document.documentElement,
			end: "bottom bottom",
			toggleClass: { targets: marker, className: "is-lit" },
		});
	}
});
let observer: IntersectionObserver | null = null;

const setupObserver = async () => {
	await nextTick();
	observer?.disconnect();

	const animate = animationsEnabled.value;
	for (const el of contentRefs.value) {
		setFadeState(el, !animate, TRANSLATE_Y);
	}
	if (!animate) return;

	// Each item fades in once; re-running the setup (animations toggled) replays them.
	observer = new IntersectionObserver(
		(entries, obs) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const target = entry.target as HTMLElement;
				obs.unobserve(target);
				fadeIn(target, {
					delay: Number(target.dataset.index) * 100,
					translateY: TRANSLATE_Y,
				});
			}
		},
		{ threshold: 0.2 },
	);
	for (const el of contentRefs.value) observer.observe(el);
};

watch(
	[entered, animationsEnabled],
	() => {
		if (entered.value) setupObserver();
	},
	{ immediate: true },
);

onUnmounted(() => {
	observer?.disconnect();
});
</script>

<template>
  <div class="timeline">
    <ol ref="containerRef" class="timeline-container">
      <div class="timeline-line">
        <div ref="lineFillRef" class="timeline-line-fill"></div>
      </div>
      <li
        v-for="(item, index) in items"
		:key="`${item.date}-${item.organization}`"
        :class="['timeline-item', index % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right']"
      >
        <div class="timeline-marker">
          <div ref="markerRefs" class="timeline-marker-inner"></div>
        </div>
        <div
          ref="contentRefs"
          :data-index="index"
          class="timeline-content"
        >
          <div class="timeline-date">
            <p>{{ item.date }}</p>
          </div>
          <div class="timeline-organization">
            <Icon
              :icon="item.type === 'formation' ? iconFormation : iconWork"
              class="timeline-icon"
							aria-hidden="true"
            />
            <h4>{{ item.organization }}</h4>
          </div>
          <div v-if="item.role" class="timeline-role">
            <h5>{{ item.role }}</h5>
          </div>
          <div v-if="item.description" class="timeline-description">
            <p>{{ item.description }}</p>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.timeline {
  width: 100%;
	max-width: var(--content-max);
  margin: 0 auto;
	padding: 0;
}

.timeline-container {
  position: relative;
  width: 100%;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--glass-border) 10%,
    var(--glass-border) 90%,
    transparent
  );
  transform: translateX(-50%);
  z-index: 0;
}

.timeline-item {
  position: relative;
  margin-bottom: var(--spacing-2xl);
  display: flex;
  align-items: flex-start;
}

.timeline-item--left {
  justify-content: flex-start;
}

.timeline-item--right {
  justify-content: flex-end;
}

.timeline-marker {
  position: absolute;
  left: 50%;
  top: var(--spacing-md);
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-line-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--text) 10%,
    var(--text) 90%,
    transparent
  );
  transform: scaleY(0);
  transform-origin: top;
}

.timeline-marker-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text);
  border: 3px solid var(--bg);
  box-shadow: 0 0 0 2px var(--glass-border);
  transition:
    box-shadow 0.4s ease,
    transform 0.4s ease;
}

.timeline-marker-inner.is-lit {
  box-shadow: 0 0 0 2px var(--text);
  transform: scale(1.25);
}

.timeline-content {
  display: flex;
  flex-direction: column;
  width: calc(50% - var(--spacing-3xl));
	background: var(--surface);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  backdrop-filter: blur(10px);
  gap: var(--spacing-sm);
	transition: border-color 0.25s ease, background 0.25s ease;
}

.timeline-content:hover {
	background: var(--surface-strong);
	border-color: var(--glass-border-hover);
}

.timeline-date {
  color: var(--muted);
  text-transform: uppercase;
}

.timeline-organization {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.timeline-icon {
  width: 40px;
  height: 40px;
}

.timeline-role h5 {
  color: var(--muted);
}

@media (max-width: 768px) {
  .timeline-line {
    left: var(--spacing-xl);
  }

  .timeline-item {
    justify-content: flex-start !important;
  }

  .timeline-marker {
    left: var(--spacing-xl);
  }

  .timeline-content {
    width: calc(100% - var(--spacing-3xl));
    margin-left: var(--spacing-3xl) !important;
    margin-right: 0 !important;
  }
}

@media (max-width: 900px) {
	.timeline {
    padding: 0;
  }
}
</style>
