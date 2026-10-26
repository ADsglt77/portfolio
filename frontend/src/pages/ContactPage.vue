<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import Button from "../components/Button.vue";
import ImageSection from "../components/ImageSection.vue";
import Input from "../components/Input.vue";
import { useCampfireSound } from "../composables/useCampfireSound";
import { useFadeIn } from "../composables/useFadeIn";
import { useTurnstile } from "../composables/useTurnstile";
import { config } from "../config";
import { iconSend } from "../data/icons";
import { sendContact } from "../lib/contact";

type FieldKey = "name" | "email" | "subject" | "message";

const FIELDS: Array<{
	key: FieldKey;
	type?: "text" | "email";
	textarea?: boolean;
}> = [
	{ key: "name" },
	{ key: "email", type: "email" },
	{ key: "subject" },
	{ key: "message", textarea: true },
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM: Record<FieldKey, string> = {
	name: "",
	email: "",
	subject: "",
	message: "",
};
const FEEDBACK_DURATION = 3000;

const { contact } = config;
const { form } = contact;
const linkedin = config.social.find((link) =>
	link.url.includes("linkedin.com"),
);

const panelRef = ref<HTMLElement | null>(null);
const formRef = ref<HTMLFormElement | null>(null);

useCampfireSound(panelRef);

useFadeIn(panelRef, {
	threshold: 0.1,
	duration: 650,
	delay: 60,
	translateY: 30,
});

const formData = ref({ ...EMPTY_FORM });
const errors = ref({ ...EMPTY_FORM });
const isSubmitting = ref(false);
const isSuccess = ref(false);
const isError = ref(false);
const captchaError = ref("");
const turnstileContainerRef = ref<HTMLElement | null>(null);

const {
	token: turnstileToken,
	loadError: captchaLoadError,
	reset: resetTurnstile,
} = useTurnstile(turnstileContainerRef, {
	onError: () => {
		captchaError.value = form.captcha.failed;
	},
});

watch(turnstileToken, (token) => {
	if (token) captchaError.value = "";
});

const showTemporaryState = (state: { value: boolean }) => {
	state.value = true;
	setTimeout(() => {
		state.value = false;
	}, FEEDBACK_DURATION);
};

const validateForm = (): boolean => {
	errors.value = { ...EMPTY_FORM };
	captchaError.value = "";

	for (const { key } of FIELDS) {
		if (!formData.value[key].trim()) errors.value[key] = form[key].error;
	}
	if (!errors.value.email && !EMAIL_PATTERN.test(formData.value.email)) {
		errors.value.email = form.email.errorInvalid;
	}
	if (!turnstileToken.value) {
		captchaError.value = form.captcha.required;
	}

	return !captchaError.value && Object.values(errors.value).every((e) => !e);
};

const handleSubmit = async () => {
	if (isSubmitting.value) return;

	if (!validateForm()) {
		showTemporaryState(isError);
		await nextTick();
		formRef.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
		return;
	}

	isSubmitting.value = true;
	isError.value = false;

	const result = await sendContact({
		...formData.value,
		turnstileToken: turnstileToken.value,
	});

	isSubmitting.value = false;

	if (!result.success) {
		if (result.message) captchaError.value = result.message;
		resetTurnstile();
		showTemporaryState(isError);
		return;
	}

	showTemporaryState(isSuccess);

	setTimeout(() => {
		formData.value = { ...EMPTY_FORM };
		errors.value = { ...EMPTY_FORM };
		resetTurnstile();
	}, FEEDBACK_DURATION);
};
</script>

<template>
  <ImageSection id="contact" :title="contact.title" :image="contact.image" title-area="1 / 2 / 2 / 5">
    <div ref="panelRef" class="contact-panel">
      <header class="contact-intro">
        <p class="section-eyebrow">{{ contact.eyebrow }}</p>
        <p>{{ contact.intro }}</p>
        <p v-if="linkedin" class="contact-alternative">
          {{ contact.alternativeLabel }}
          <a :href="linkedin.url" target="_blank" rel="noopener noreferrer">
            {{ contact.linkedinLabel }}
          </a>
        </p>
      </header>
      <form ref="formRef" novalidate @submit.prevent="handleSubmit">
        <Input
          v-for="field in FIELDS"
          :id="field.key"
          :key="field.key"
          v-model="formData[field.key]"
          :type="field.type"
          :textarea="field.textarea"
          :label="form[field.key].label"
          :placeholder="form[field.key].placeholder"
          :error="errors[field.key]"
        />
        <div class="actions">
          <Button
            type="submit"
            :icon="iconSend"
            :label="isSubmitting ? form.submittingLabel : form.submitLabel"
            :disabled="isSubmitting"
            :success="isSuccess"
            :error="isError"
          />
          <div class="captcha-block">
            <div ref="turnstileContainerRef" class="turnstile-widget" />
            <p v-if="captchaLoadError" class="captcha-error" role="alert">
              {{ form.captcha.loadError }}
            </p>
            <p v-else-if="captchaError" class="captcha-error" role="alert">
              {{ captchaError }}
            </p>
          </div>
        </div>
        <p class="sr-only" aria-live="polite">
          {{ isSuccess ? form.successMessage : isError ? form.errorMessage : "" }}
        </p>
      </form>
    </div>
  </ImageSection>
</template>

<style scoped>
.contact-panel {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--spacing-lg);
	align-self: center;
	grid-area: 2 / 3 / 7 / 5;
}

.contact-intro {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);
	max-width: 58ch;
}

.contact-intro > p:not(.section-eyebrow) {
	color: var(--muted);
}

.contact-alternative a {
	color: var(--text);
	text-decoration: underline;
	text-underline-offset: 4px;
}

form {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-xs);
}

form .actions {
	display: flex;
	gap: var(--spacing-sm);
	justify-content: space-between;
}

form .actions button {
	place-self: center;
	height: fit-content;
}

.captcha-block {
	display: flex;
	flex-direction: column;
}

.captcha-error {
	color: var(--error);
	font-size: var(--font-size-span);
}

@media (max-width: 900px) {
	.contact-panel {
		max-width: 100%;
	}

	form .actions {
		flex-direction: column;
	}

	form .actions button {
		place-self: unset;
	}
}
</style>
