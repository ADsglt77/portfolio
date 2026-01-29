<template>
  <nav>
    <a href="#about" class="nav-link"><p>ABOUT</p></a>
    <a href="#experience" class="nav-link"><p>WORK</p></a>
    <a href="#contact" class="nav-link"><p>CONTACT</p></a>
    <Button padding="0.6rem" borderRadius="50%" @click="toggleMute">
      <Icon
        :icon="isMuted ? 'iconoir:sound-off' : 'iconoir:sound-high'"
        :width="16"
        :height="16"
        :stroke-width="3"
      />
    </Button>
  </nav>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Icon } from '@iconify/vue'
import Button from './Button.vue'

const audioRef = inject<{ value: HTMLAudioElement | null }>('audioRef')
const isMuted = ref(true) // mettre false en production

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (audioRef?.value) {
    audioRef.value.muted = isMuted.value
  }
}
</script>

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
