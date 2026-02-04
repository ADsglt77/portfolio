<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide, watch, watchEffect, nextTick } from 'vue'
import Button from './components/Button.vue'
import HomePage from './pages/HomePage.vue'
import AboutPage from './pages/AboutPage.vue'
import TechnologiesPage from './pages/TechnologiesPage.vue'
import TimelinePage from './pages/TimelinePage.vue'
import ProjectsPage from './pages/ProjectsPage.vue'
import audioFile from './assets/sound/Flickering-Flames.mp3'
import { useLenis } from './composables/useLenis'

const progress = ref(0)
const ready = ref(false)
const entered = ref(false)
const isButtonFading = ref(false)
const title = ref('ADRIEN')
const audioRef = ref<HTMLAudioElement>()
const loadingStatusContainerRef = ref<HTMLElement>()
const loadingStatusHeight = ref(0)

const { start: startLenis, stop: stopLenis } = useLenis()

provide('audioRef', audioRef)
provide('entered', entered)

onMounted(() => {
  const startTime = Date.now()
  const duration = 1000

  const updateProgress = () => {
    const elapsed = Date.now() - startTime
    const newProgress = Math.min((elapsed / duration) * 100, 100)

    if (newProgress >= 100) {
      progress.value = 100
      ready.value = true
    } else {
      progress.value = Math.ceil(newProgress)
      requestAnimationFrame(updateProgress)
    }
  }

  requestAnimationFrame(updateProgress)
})

// Calculer la hauteur quand ready change (le bouton apparaît)
watch(ready, () => {
  nextTick(() => {
    if (loadingStatusContainerRef.value) {
      loadingStatusHeight.value = loadingStatusContainerRef.value.offsetHeight
    }
  })
})

const handleEnter = () => {
  isButtonFading.value = true
  audioRef.value?.play().catch(() => {})
  setTimeout(() => {
    entered.value = true
    startLenis()
  }, 1000)
}

// Scroll lock : bloquer le scroll avant ENTER, libérer après
watchEffect(() => {
  document.body.style.overflow = entered.value ? '' : 'hidden'
})

onUnmounted(() => {
  stopLenis()
  document.body.style.overflow = ''
})
</script>

<template>
  <audio ref="audioRef" :src="audioFile" loop preload="auto" muted></audio>
  <!-- enlever attribut muted en production -->
  <!-- loader (loader + enter) -->
  <div v-show="!entered" class="loader" role="dialog" aria-modal="true">
    <!-- Titre avec effet de remplissage -->
    <h1
      :style="{
        backgroundImage: `linear-gradient(to right, var(--text) 0%, var(--text) ${progress}%, color-mix(in srgb, var(--text) 10%, transparent) ${progress}%, color-mix(in srgb, var(--text) 10%, transparent) 100%)`,
      }"
    >
      {{ title }}
    </h1>
    <!-- Div séparée en dessous pour loading et bouton -->
    <div ref="loadingStatusContainerRef" class="loading-status-container">
      <Transition name="fade" mode="out-in">
        <p v-if="!ready" key="loading" role="status" aria-live="polite">
          Loading... {{ progress }}%
        </p>
        <Button
          v-else
          key="button"
          :class="{ 'button--fade': isButtonFading }"
          label="ENTER WEBSITE"
          @click="handleEnter"
        />
      </Transition>
    </div>
  </div>

  <!-- Site (après ENTER) -->
  <main v-show="entered" class="site-content">
    <HomePage />
    <AboutPage />
    <TechnologiesPage />
    <TimelinePage />
    <ProjectsPage />
  </main>
</template>

<style scoped>
/* loader (loader + enter) */
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
  transition: background-image 0.08s linear;
}

.loading-status-container {
  position: relative;
  top: 15%;
  color: var(--muted);
  gap: var(--spacing-md);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease 0.6s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
