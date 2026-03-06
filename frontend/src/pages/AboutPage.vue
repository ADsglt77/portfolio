<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { inject, type Ref, ref } from "vue";
import Button from "../components/Button.vue";
import SectionHeader from "../components/sectionImgTexte/SectionHeader.vue";
import SectionTexte from "../components/sectionImgTexte/SectionTexte.vue";
import { useFadeIn } from "../composables/useFadeIn";
import { usePinnedTyping } from "../composables/usePinnedTyping";
import { useTextReveal } from "../composables/useTextReveal";
import { aboutData } from "../data/about";
import { iconDownload } from "../data/icons";
import { socialLinks } from "../data/socialLinks";

const entered = inject<Ref<boolean>>("entered")!;

const displayedText = ref("");
const sectionRef = ref<HTMLElement | null>(null);
const paragraphRef = ref<HTMLParagraphElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const isDownloaded = ref(false);

const downloadCV = () => {
	if (!aboutData.cv.path) return;
	const link = document.createElement("a");
	link.href = aboutData.cv.path;
	link.download = aboutData.cv.filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	isDownloaded.value = true;
	setTimeout(() => {
		isDownloaded.value = false;
	}, 3000);
};

usePinnedTyping(sectionRef, aboutData.title, displayedText, {
	active: entered,
	threshold: 0.3,
	typingDuration: 2000,
});

useTextReveal(paragraphRef, aboutData.paragraph, {
	active: entered,
	threshold: 0.5,
	delay: 3,
});

useFadeIn(buttonRef, {
	active: entered,
	threshold: 0.5,
	duration: 1500,
	delay: 300,
	translateY: 0,
});
</script>

<template>
  <section ref="sectionRef" id="about" class="section about">
	<div class="section-header">
		<SectionHeader :image-src="aboutData.image.src" :image-alt="aboutData.image.alt" />
		<SectionTexte :text="displayedText" grid-area="1 / 2 / 3 / 5" />
	</div>
    <div class="subtitle">
      <p ref="paragraphRef"></p>
      <div class="actions">
        <div ref="buttonRef">
          <Button
            v-if="aboutData.cv.path"
            :icon="iconDownload"
            :label="aboutData.cv.label"
            :success="isDownloaded"
            @click="downloadCV"
          />
        </div>
        <div class="social-links">
          <a
            v-for="link in socialLinks"
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
  </section>
</template>

<style scoped>
.section.about {
	width: 100%;
	height: 100%;
	padding: var(--spacing-3xl) var(--spacing-xl);
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(6, 1fr);
	gap: var(--spacing-xl);
}

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

.section-header {
	display: contents;
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
	.section.about {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.section.about :deep(img),
	.section.about :deep(.title) {
		grid-area: unset;
	}

	.subtitle {
		grid-area: unset;
		max-width: 100%;
	}

	.subtitle .actions {
		flex-wrap: wrap;
		gap: var(--spacing-md);
	}
}
</style>
