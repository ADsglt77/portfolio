<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, inject, onMounted, onUnmounted, ref, watch } from "vue";
import { glideTo } from "../composables/useLenis";
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
import { audioKey, useAnimationsEnabled, useEntered } from "../injectionKeys";
import { scrambleText } from "../lib/textScramble";
import Button from "./Button.vue";

const { links, menuLabel, settings } = config.nav;

const audioRef = inject(audioKey);
const animationsEnabled = useAnimationsEnabled();
const entered = useEntered();
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

const scramble = (link: Element | null | undefined, text: string) => {
	const label = link?.querySelector("span");
	if (label) {
		scrambleText(label, text, { skipAnimation: !animationsEnabled.value });
	}
};

// The link of the section crossing the middle of the screen is lit, and scrambles
// as it lights up.
const navRef = ref<HTMLElement | null>(null);
const activeHref = ref<string | null>(null);
const observer = new IntersectionObserver(
	(entries) => {
		for (const { target, isIntersecting } of entries) {
			const href = `#${target.id}`;
			if (isIntersecting) activeHref.value = href;
			else if (activeHref.value === href) activeHref.value = null;
		}
	},
	{ rootMargin: "-50% 0px" },
);

watch(activeHref, (href) => {
	const link = links.find((l) => l.href === href);
	if (link) {
		scramble(navRef.value?.querySelector(`[href="${href}"]`), link.label);
	}
});

onMounted(() => {
	// captured before the click is handled: a toggled icon re-renders and would leave
	// the clicked element detached, so it would look like a click outside
	document.addEventListener("click", handleClickOutside, true);
	// the hero is watched too, so the nav knows when it is over it
	for (const href of ["#home", ...links.map((link) => link.href)]) {
		const section = document.querySelector(href);
		if (section) observer.observe(section);
	}
});
onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside, true);
	observer.disconnect();
});

const scrollToSection = (e: Event, href: string) => {
	e.preventDefault();
	showMobileMenu.value = false;
	const element = document.querySelector<HTMLElement>(href);
	if (element) glideTo(element);
};
</script>

<template>
  <nav
    ref="navRef"
    :class="{ visible: entered, 'over-hero': activeHref === '#home' }"
  >
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      class="nav-link"
      :class="{ 'is-active': link.href === activeHref }"
      :aria-current="link.href === activeHref ? 'location' : undefined"
      @click="scrollToSection($event, link.href)"
      @mouseenter="scramble($event.currentTarget as Element, link.label)"
    >
      <span>{{ link.label }}</span>
    </a>
    <div class="nav-mobile">
      <Button
        padding="0.6rem"
        borderRadius="50%"
        class="nav-hamburger"
        :aria-expanded="showMobileMenu"
        :aria-label="menuLabel"
        @click="showMobileMenu = !showMobileMenu"
      >
        <Icon
          :icon="showMobileMenu ? iconCancel : iconMenu"
          :width="16"
          :height="16"
          :stroke-width="3"
        />
      </Button>
      <Transition name="panel-fade">
        <div v-show="showMobileMenu" class="nav-panel mobile-menu-panel">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="mobile-menu-link"
            :class="{ 'is-active': link.href === activeHref }"
            :aria-current="link.href === activeHref ? 'location' : undefined"
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
        :aria-label="settings.label"
        @click="showSettings = !showSettings"
      >
        <Icon :icon="iconSettings" :width="16" :height="16" :stroke-width="3" />
      </Button>
      <Transition name="panel-fade">
        <div v-show="showSettings" class="nav-panel settings-panel">
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
              @click="toggleAnimations"
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
/* fixed, the nav stays where it is in the hero for the whole scroll */
nav {
  position: fixed;
  top: var(--spacing-xl);
  left: var(--spacing-3xl);
  right: var(--spacing-3xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2xl);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
}

/* fades in with the rest of the hero, then lets go of the nav: a fade held at its
   end would stop the panels from blurring the page behind them */
nav.visible {
  opacity: 1;
  animation-delay: 2s;
  animation-fill-mode: backwards;
}

/* only the controls catch clicks, not the empty band between them */
nav > * {
  pointer-events: auto;
}

nav * {
  color: var(--text);
}

/* past the hero, the page fades out under the nav so the nav stays readable */
nav::before {
  content: "";
  position: fixed;
  inset: 0 0 auto;
  z-index: -1;
  height: 7rem;
  background: linear-gradient(var(--bg) 50%, transparent);
  transition: opacity 0.4s ease;
}

nav.over-hero::before {
  opacity: 0;
}

.nav-link.is-active span {
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-thickness: 1px;
}

.nav-settings {
  position: relative;
}

.nav-panel {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  z-index: 10;
  padding: var(--spacing-sm);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.15s ease;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
}

.settings-panel {
  right: 0;
  min-width: 10rem;
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

.nav-mobile {
  display: none;
  position: relative;
}

.nav-hamburger {
  flex-shrink: 0;
}

.mobile-menu-panel {
  left: 0;
  min-width: 12rem;
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

.mobile-menu-link:hover,
.mobile-menu-link.is-active {
  background: var(--glass-hover);
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
