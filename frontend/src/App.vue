<script setup lang="ts">
import { computed, onUnmounted, provide, ref, watch, watchEffect } from "vue";
import Button from "./components/Button.vue";
import Footer from "./components/Footer.vue";
import Nav from "./components/Nav.vue";
import { useLenis } from "./composables/useLenis";
import { useLoadingProgress } from "./composables/useLoadingProgress";
import { config } from "./config";
import {
	animationsEnabledKey,
	audioKey,
	enteredKey,
	lenisKey,
} from "./injectionKeys";
import { formatTemplate } from "./lib/format";
import AboutPage from "./pages/AboutPage.vue";
import ContactPage from "./pages/ContactPage.vue";
import HomePage from "./pages/HomePage.vue";
import ProjectsPage from "./pages/ProjectsPage.vue";
import TechnologiesPage from "./pages/TechnologiesPage.vue";
import TimelinePage from "./pages/TimelinePage.vue";

const { hero } = config;

const entered = ref(false);
const isButtonFading = ref(false);
const audioRef = ref<HTMLAudioElement>();

const { progress, ready } = useLoadingProgress({ image: hero.backgroundImage });
const loadingText = computed(() =>
	formatTemplate(hero.loadingLabel, { progress: progress.value }),
);

const STORAGE_ANIMATIONS = "portfolio-animations-enabled";
// A saved choice wins; otherwise follow the system "reduce motion" setting.
const readStoredAnimations = () => {
	let stored: string | null = null;
	try {
		stored = localStorage.getItem(STORAGE_ANIMATIONS);
	} catch {
		/* storage unavailable */
	}
	return stored === null
		? !window.matchMedia("(prefers-reduced-motion: reduce)").matches
		: stored !== "false";
};
const animationsEnabled = ref(readStoredAnimations());
watchEffect(() => {
	document.documentElement.classList.toggle(
		"animations-off",
		!animationsEnabled.value,
	);
});
// Only an explicit toggle is saved, so the system setting keeps applying until then.
watch(animationsEnabled, (enabled) => {
	try {
		localStorage.setItem(STORAGE_ANIMATIONS, String(enabled));
	} catch {
		/* storage unavailable */
	}
});

const { start: startLenis, getInstance: getLenisInstance } = useLenis({
	lerp: 0.5,
	duration: 3,
	wheelMultiplier: 0.5,
	touchMultiplier: 1,
});

provide(audioKey, audioRef);
provide(enteredKey, entered);
provide(lenisKey, getLenisInstance);
provide(animationsEnabledKey, animationsEnabled);

const handleEnter = () => {
	isButtonFading.value = true;
	audioRef.value?.play().catch(() => {});
	setTimeout(() => {
		entered.value = true;
		startLenis();
	}, 1000);
};

watchEffect(() => {
	document.body.style.overflow = entered.value ? "" : "hidden";
});

onUnmounted(() => {
	document.body.style.overflow = "";
});
</script>

<template>
  <audio
    v-if="hero.ambientSound"
    ref="audioRef"
    :src="hero.ambientSound"
    loop
    preload="auto"
    muted
  ></audio>

  <div v-show="!entered" class="loader" role="dialog" aria-modal="true">
    <h1
      :style="{
        backgroundImage: `linear-gradient(to right, var(--text) 0%, var(--text) ${progress}%, color-mix(in srgb, var(--text) 10%, transparent) ${progress}%, color-mix(in srgb, var(--text) 10%, transparent) 100%)`,
      }"
    >
      {{ hero.displayName }}
    </h1>
    <div class="loading-status-container">
      <Transition name="fade" mode="out-in">
        <p v-if="!ready" key="loading" role="status" aria-live="polite">
          {{ loadingText }}
        </p>
        <Button
          v-else
          key="button"
          :class="{ 'button--fade': isButtonFading }"
          :label="hero.enterLabel"
          @click="handleEnter"
        />
      </Transition>
    </div>
  </div>

  <main v-show="entered" class="site-content">
    <Nav />
    <HomePage />
    <div class="gradient-overlay"></div>
    <AboutPage />
    <TechnologiesPage />
    <TimelinePage />
    <ProjectsPage />
    <ContactPage />
    <Footer />
  </main>
</template>

<style scoped>
.loader {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

h1 {
  position: absolute;
  z-index: 1;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.loading-status-container {
  position: relative;
  top: 15%;
  color: var(--muted);
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease 0.6s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--bg));
}
</style>
