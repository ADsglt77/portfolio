<script setup lang="ts">
import {
	computed,
	onMounted,
	onUnmounted,
	provide,
	ref,
	watch,
	watchEffect,
} from "vue";
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

const STORAGE_INTRO = "portfolio-intro-seen";
const readIntroSeen = () => {
	try {
		return localStorage.getItem(STORAGE_INTRO) === "true";
	} catch {
		return false;
	}
};

const entered = ref(readIntroSeen());
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
	document.documentElement.classList.toggle(
		"animations-on",
		animationsEnabled.value,
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
	setTimeout(() => {
		entered.value = true;
		startLenis();
		try {
			localStorage.setItem(STORAGE_INTRO, "true");
		} catch {
			/* storage unavailable */
		}
	}, 350);
};

const skipIntro = () => {
	entered.value = true;
	startLenis();
	try {
		localStorage.setItem(STORAGE_INTRO, "true");
	} catch {
		/* storage unavailable */
	}
};

onMounted(() => {
	if (entered.value) startLenis();
});

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
    preload="none"
    muted
  ></audio>

  <a v-if="entered" class="skip-link" href="#main-content">Aller au contenu</a>

  <div
    v-show="!entered"
    class="loader"
    role="dialog"
    aria-modal="true"
    aria-labelledby="loader-title"
  >
    <h1
      id="loader-title"
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
      <button type="button" class="skip-intro" @click="skipIntro">
        {{ hero.skipIntroLabel }}
      </button>
    </div>
  </div>

  <main id="main-content" v-show="entered" class="site-content" tabindex="-1">
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

.skip-link {
  position: fixed;
  top: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 1000;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  background: var(--text);
  color: var(--bg);
  transform: translateY(-200%);
  transition: transform 0.2s ease;
}

.skip-link:focus {
  transform: translateY(0);
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
  min-height: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.skip-intro {
  padding: 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: var(--font-size-span);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.2s ease;
}

.skip-intro:hover,
.skip-intro:focus-visible {
  color: var(--text);
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
