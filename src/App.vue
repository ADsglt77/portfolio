<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide } from 'vue'
import { Icon } from '@iconify/vue'
import Button from './components/Button.vue'
import Nav from './components/Nav.vue'
import logo from './assets/img/logo.svg'
import audioFile from './assets/sound/Flickering-Flames.mp3'

const progress = ref(0)
const ready = ref(false)
const entered = ref(false)
const title = ref('ADRIEN')
const audioRef = ref<HTMLAudioElement>()
const currentDay = ref('')
const currentTime = ref('')
let timeIntervalId: number | undefined

provide('audioRef', audioRef)

onMounted(() => {
  const startTime = Date.now()
  const duration = 1000

  const updateProgress = () => {
    const elapsed = Date.now() - startTime
    const newProgress = Math.min((elapsed / duration) * 100, 100)

    progress.value = newProgress

    if (newProgress < 100) {
      requestAnimationFrame(updateProgress)
    } else {
      ready.value = true
    }
  }

  requestAnimationFrame(updateProgress)

  const updateTime = () => {
    const now = new Date()
    currentDay.value = now.toLocaleDateString(undefined, {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    })
    currentTime.value = now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  updateTime()
  timeIntervalId = window.setInterval(updateTime, 1000)
})

const handleEnter = () => {
  entered.value = true
  audioRef.value?.play().catch(() => {})
}

onUnmounted(() => {
  if (timeIntervalId !== undefined) {
    clearInterval(timeIntervalId)
  }
})
</script>

<template>
  <div class="app-wrapper">
    <audio ref="audioRef" :src="audioFile" loop preload="auto" muted></audio>
    <!-- enlever attribut muted en production -->

    <!-- Gate (loader + enter) -->
    <div v-show="!entered" class="gate" role="dialog" aria-modal="true">
      <!-- Titre avec effet de remplissage -->
      <div class="hero-title">
        <h1>{{ title }}</h1>
        <h1 :style="{ width: `${progress}%` }">{{ title }}</h1>
      </div>
      <!-- Div séparée en dessous pour loading et bouton -->
      <div class="loading-status-container">
        <h4 v-show="!ready" role="status" aria-live="polite">
          Loading... {{ Math.round(progress) }}%
        </h4>
        <Button v-show="ready" label="ENTER WEBSITE" @click="handleEnter" />
      </div>
    </div>

    <!-- Site (après ENTER) -->
    <main v-show="entered">
      <!-- Section Home -->
      <section id="home" class="section home">
        <img :src="logo" alt="Logo" />
        <Nav />
        <div class="hero-title">
          <h1 class="after" :style="{ width: `${progress}%` }">{{ title }}</h1>
        </div>
        <div class="loading-status-container scroll">
          <h4>Scroll to explore</h4>
          <Icon icon="iconoir:fast-arrow-down" :width="20" :height="20" />
        </div>
        <h5 class="meta day">{{ currentDay }}</h5>
        <h5 class="meta time">{{ currentTime }}</h5>
      </section>

      <!-- Section About -->
      <section id="about" class="section about">
        <h2>About</h2>
        <p>Contenu à propos de moi...</p>
      </section>

      <!-- Section Expérience -->
      <section id="experience" class="section experience">
        <h2>Expérience</h2>
        <p>Mon parcours professionnel...</p>
      </section>

      <!-- Section Projects -->
      <section id="projects" class="section projects">
        <h2>Projects</h2>
        <p>Mes projets...</p>
      </section>

      <!-- Section Contact -->
      <section id="contact" class="section contact">
        <h2>Contact</h2>
        <p>Contactez-moi...</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
}

/* Gate (loader + enter) */
.gate {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.hero-title {
  position: relative;
}

.hero-title h1 {
  font-family: var(--font-title);
  font-size: clamp(4rem, 16vw, 12rem);
  font-weight: 600;
  color: color-mix(in srgb, var(--text) 10%, transparent);
}

.hero-title h1.after {
  color: var(--text);
  margin-bottom: calc(var(--spacing-3xl) + var(--spacing-md));
}

.hero-title h1:nth-of-type(2) {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--text);
  overflow: hidden;
  transition: width 0.08s linear;
}

.loading-status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--spacing-3xl) + var(--spacing-md));
  color: var(--muted);
}

.loading-status-container h4 {
  font-weight: 300;
}

.section.home .loading-status-container.scroll {
  position: absolute;
  bottom: var(--spacing-xl);
  left: 0;
  right: 0;
  gap: var(--spacing-md);
}

.section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* -------------------------------- */
/*          Section Home            */
/* -------------------------------- */
.section.home {
  background-image:
    linear-gradient(rgb(0, 0, 0, 0.3), rgb(0, 0, 0, 0.3)), url('./assets/img/hero-misty-forest.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.section.home img {
  width: 6rem;
  height: 6rem;
  position: absolute;
  top: var(--spacing-2xl);
  left: var(--spacing-2xl);
}

.meta {
  position: absolute;
  bottom: var(--spacing-xl);
  color: var(--muted);
  font-weight: 400;
}

.meta.day {
  left: var(--spacing-xl);
}

.meta.time {
  right: var(--spacing-xl);
}

/* -------------------------------- */
/*          Section About           */
/* -------------------------------- */

/* -------------------------------- */
/*          Section Experience      */
/* -------------------------------- */

/* -------------------------------- */
/*          Section Projects        */
/* -------------------------------- */

/* -------------------------------- */
/*          Section Contact         */
/* -------------------------------- */
</style>
