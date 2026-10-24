<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import { config } from "../config";
import {
	iconCancel,
	iconEye,
	iconEyeOff,
	iconMenu,
	iconSettings,
	iconSoundHigh,
	iconSoundOff,
} from "../data/icons";
import { audioKey, lenisKey, useAnimationsEnabled } from "../injectionKeys";
import { scrambleText } from "../lib/textScramble";
import Button from "./Button.vue";

const { links, settings } = config.nav;

const audioRef = inject(audioKey);
const getLenisInstance = inject(lenisKey);
const animationsEnabled = useAnimationsEnabled();
const showSettings = ref(false);
const showMobileMenu = ref(false);
const isMuted = ref(true);

const soundIcon = computed(() =>
	isMuted.value ? iconSoundOff : iconSoundHigh,
);

const toggleMute = () => {
	isMuted.value = !isMuted.value;
	if (audioRef?.value) {
		audioRef.value.muted = isMuted.value;
	}
};

const toggleAnimations = () => {
	animationsEnabled.value = !animationsEnabled.value;
};

const handleClickOutside = (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	if (showSettings.value && !target.closest(".nav-settings")) {
		showSettings.value = false;
	}
	if (showMobileMenu.value && !target.closest(".nav-mobile")) {
		showMobileMenu.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
});

const handleScramble = (e: Event, text: string) => {
	const target = (e.currentTarget as HTMLElement).querySelector("span");
	if (target) {
		scrambleText(target, text, { skipAnimation: !animationsEnabled.value });
	}
};

const scrollToSection = (e: Event, href: string) => {
	e.preventDefault();
	showMobileMenu.value = false;
	const lenis = getLenisInstance?.();
	const element = document.querySelector<HTMLElement>(href);
	if (lenis && element) {
		lenis.scrollTo(element, {
			duration: 5,
			easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
		});
	}
};
</script>

<template>
  <nav>
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      class="nav-link"
      @click="scrollToSection($event, link.href)"
      @mouseenter="handleScramble($event, link.label)"
    >
      <span>{{ link.label }}</span>
    </a>
    <div class="nav-mobile">
      <Button
        padding="0.6rem"
        borderRadius="50%"
        class="nav-hamburger"
        :aria-expanded="showMobileMenu"
        aria-label="Menu"
        @click="showMobileMenu = !showMobileMenu"
      >
        <Icon
          :icon="showMobileMenu ? iconCancel : iconMenu"
          :width="16"
          :height="16"
          :stroke-width="3"
        />
      </Button>
      <Transition name="menu-fade">
        <div v-show="showMobileMenu" class="mobile-menu-panel">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="mobile-menu-link"
            @click="scrollToSection($event, link.href)"
          >
            {{ link.label }}
          </a>
        </div>
      </Transition>
    </div>
    <div class="nav-settings">
      <Button
        padding="0.6rem"
        borderRadius="50%"
        :aria-expanded="showSettings"
        aria-label="Paramètres"
        @click="showSettings = !showSettings"
      >
        <Icon :icon="iconSettings" :width="16" :height="16" :stroke-width="3" />
      </Button>
      <Transition name="settings-fade">
        <div v-show="showSettings" class="settings-panel">
          <div class="settings-row">
            <span>{{ settings.soundLabel }}</span>
            <button
              type="button"
              class="settings-toggle"
              :aria-label="settings.soundLabel"
              :aria-pressed="!isMuted"
              @click="toggleMute"
            >
              <Icon :icon="soundIcon" :width="14" :height="14" :stroke-width="3" />
            </button>
          </div>
          <div class="settings-row">
            <span>{{ settings.animationsLabel }}</span>
            <button
              type="button"
              class="settings-toggle"
              :aria-label="settings.animationsLabel"
              :aria-pressed="animationsEnabled"
              @click.stop="toggleAnimations"
            >
              <Icon :icon="animationsEnabled ? iconEye : iconEyeOff" :width="14" :height="14" :stroke-width="3" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: absolute;
  top: var(--spacing-xl);
  left: var(--spacing-3xl);
  right: var(--spacing-3xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2xl);
}

nav * {
  color: var(--text);
}

.nav-settings {
  position: relative;
}

.settings-panel {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  min-width: 10rem;
  padding: var(--spacing-sm);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
  z-index: 10;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text);
}

.settings-row span {
  font-size: var(--font-size-span);
}

.settings-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.settings-toggle:hover {
  background: var(--glass-hover);
  border-color: var(--glass-border-hover);
}

.settings-fade-enter-active,
.settings-fade-leave-active {
  transition: opacity 0.15s ease;
}

.settings-fade-enter-from,
.settings-fade-leave-to {
  opacity: 0;
}

.nav-mobile {
  display: none;
  position: relative;
}

.nav-hamburger {
  flex-shrink: 0;
}

.mobile-menu-panel {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  left: 0;
  min-width: 12rem;
  padding: var(--spacing-sm);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-menu-link {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-span);
  text-transform: uppercase;
  text-decoration: none;
  color: var(--text);
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.mobile-menu-link:hover {
  background: var(--glass-hover);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.15s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .nav-link {
    display: none;
  }

  .nav-mobile {
    display: block;
  }
}

@media (min-width: 901px) {
  nav {
    justify-content: flex-end;
  }
}
</style>
