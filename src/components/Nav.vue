<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { scrambleText } from '../lib/textScramble'
import Button from './Button.vue'
import { iconSoundOff, iconSoundHigh } from '../data/icons'

const audioRef = inject<{ value: HTMLAudioElement | null }>('audioRef')
const isMuted = ref(true) // mettre false en production

const soundIcon = computed(() => (isMuted.value ? iconSoundOff : iconSoundHigh))

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audioRef?.value) {
    audioRef.value.muted = isMuted.value
  }
}

const handleScramble = (e: Event, text: string) => {
  const target = (e.currentTarget as HTMLElement)?.querySelector('span')
  if (target) {
    scrambleText(target, text, { duration: 1000, fps: 10 })
  }
}
</script>

<template>
  <nav>
    <a href="#about" class="nav-link" @mouseenter="handleScramble($event, 'ABOUT')">
      <span>ABOUT</span>
    </a>
    <a href="#timeline" class="nav-link" @mouseenter="handleScramble($event, 'EXPERIENCE')">
      <span>EXPERIENCE</span>
    </a>
    <a href="#projects" class="nav-link" @mouseenter="handleScramble($event, 'PROJECTS')">
      <span>PROJECTS</span>
    </a>
    <a href="#contact" class="nav-link" @mouseenter="handleScramble($event, 'CONTACT')">
      <span>CONTACT</span>
    </a>
    <Button padding="0.6rem" borderRadius="50%" @click="toggleMute">
      <Icon :icon="soundIcon" :width="16" :height="16" :stroke-width="3" />
    </Button>
  </nav>
</template>

<style scoped>
nav {
  position: absolute;
  top: var(--spacing-xl);
  right: var(--spacing-3xl);
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
}

nav * {
  color: var(--text);
}
</style>
