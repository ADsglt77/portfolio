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
	// A low threshold keeps the reveal stable on narrow screens, where the
	// paragraph becomes taller and cannot reliably remain 50% visible.
	threshold: 0.15,
	delay: 3,
});

useFadeIn(buttonRef, {
	threshold: 0.5,
	duration: 650,
	delay: 120,
	translateY: 0,
});
</script>

<template>
  <ImageSection id="about" :title="about.title" :image="about.image" title-area="1 / 2 / 3 / 5">
    <div class="subtitle">
			<p class="about-status">
				<span aria-hidden="true"></span>
				{{ about.status }}
			</p>
			<p class="sr-only">{{ about.paragraph }}</p>
      <p ref="paragraphRef" class="about-copy-animated" aria-hidden="true"></p>
      <p class="about-copy-mobile" aria-hidden="true">{{ about.paragraph }}</p>
      <dl class="about-highlights">
        <div v-for="item in about.highlights" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
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
	max-width: 58ch;
	margin: 0 auto;
	gap: var(--spacing-lg);
	align-self: center;
	line-height: 1.8rem;
	grid-area: 3 / 3 / 7 / 5;
}

.about-status {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
	color: var(--text);
	font-size: var(--font-size-span);
}

.about-status span {
	width: 8px;
	height: 8px;
	flex: 0 0 8px;
	border-radius: var(--radius-full);
	background: var(--success);
	box-shadow: 0 0 0 4px color-mix(in srgb, var(--success) 18%, transparent);
}

.about-copy-mobile {
	display: none;
}

.about-highlights {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: var(--spacing-sm);
}

.about-highlights > div {
	padding: var(--spacing-sm);
	border-left: 1px solid var(--glass-border);
}

.about-highlights dt {
	margin-bottom: var(--spacing-xs);
	color: var(--muted);
	font-size: var(--font-size-span);
	text-transform: uppercase;
}

.about-highlights dd {
	font-size: var(--font-size-span);
	line-height: 1.5;
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

	/* The long copy wraps across many lines on mobile, so it remains stable
	   and readable instead of animating while its layout enters the viewport. */
	.about-copy-animated {
		display: none;
	}

	.about-copy-mobile {
		display: block;
	}

	.subtitle .actions {
		flex-wrap: wrap;
		gap: var(--spacing-md);
	}

	.about-highlights {
		grid-template-columns: 1fr;
	}
}
</style>
