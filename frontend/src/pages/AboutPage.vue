<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import Button from "../components/Button.vue";
import ImageSection from "../components/ImageSection.vue";
import { useFadeIn } from "../composables/useFadeIn";
import { useTextReveal } from "../composables/useTextReveal";
import { config } from "../config";
import { iconDownload } from "../data/icons";

const { about, social } = config;

const paragraphRef = ref<HTMLParagraphElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const isDownloaded = ref(false);

const downloadCV = () => {
	const link = document.createElement("a");
	link.href = about.cv.path;
	link.download = about.cv.filename;
	document.body.appendChild(link);
	link.click();
	link.remove();

	isDownloaded.value = true;
	setTimeout(() => {
		isDownloaded.value = false;
	}, 3000);
};

useTextReveal(paragraphRef, about.paragraph, {
	threshold: 0.5,
	delay: 3,
});

useFadeIn(buttonRef, {
	threshold: 0.5,
	duration: 1500,
	delay: 300,
	translateY: 0,
});
</script>

<template>
  <ImageSection id="about" :title="about.title" :image="about.image" title-area="1 / 2 / 3 / 5">
    <div class="subtitle">
      <p ref="paragraphRef"></p>
      <div class="actions">
        <div ref="buttonRef">
          <Button
            v-if="about.cv.path"
            :icon="iconDownload"
            :label="about.cv.label"
            :success="isDownloaded"
            @click="downloadCV"
          />
        </div>
        <div class="social-links">
          <a
            v-for="link in social"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="link.label"
            class="social-link"
          >
            <Icon :icon="link.icon" :width="24" :height="24" />
          </a>
        </div>
      </div>
    </div>
  </ImageSection>
</template>

<style scoped>
.subtitle {
	width: 100%;
	display: flex;
	flex-direction: column;
	max-width: 48ch;
	margin: 0 auto;
	gap: var(--spacing-lg);
	align-self: center;
	line-height: 1.8rem;
	grid-area: 3 / 3 / 7 / 5;
}

.subtitle .actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.subtitle .social-links {
	display: flex;
	gap: var(--spacing-md);
	align-items: center;
}

.subtitle .social-link {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	color: var(--muted);
	transition: all 0.3s ease;
	text-decoration: none;
}

.subtitle .social-link:hover {
	color: var(--text);
}

@media (max-width: 900px) {
	.subtitle {
		max-width: 100%;
	}

	.subtitle .actions {
		flex-wrap: wrap;
		gap: var(--spacing-md);
	}
}
</style>
