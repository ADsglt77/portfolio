<script setup lang="ts">
import { Icon } from "@iconify/vue";
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
	rows?: number;
}> = [
	{ key: "name" },
	{ key: "email", type: "email" },
	{ key: "subject" },
	{ key: "message", textarea: true, rows: 4 },
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM: Record<FieldKey, string> = {
	name: "",
	email: "",
	subject: "",
	message: "",
};
const FEEDBACK_DURATION = 3000;

const { contact, social } = config;
const { form } = contact;
const contactEmailHref = `mailto:${config.site.email}`;

const formRef = ref<HTMLFormElement | null>(null);

useCampfireSound(formRef);

useFadeIn(formRef, {
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
    <form ref="formRef" novalidate @submit.prevent="handleSubmit">
      <div class="contact-details">
        <a :href="contactEmailHref">
          <Icon icon="iconoir:mail" :width="18" :height="18" aria-hidden="true" />
          {{ config.site.email }}
        </a>
        <span>
          <Icon icon="iconoir:map-pin" :width="18" :height="18" aria-hidden="true" />
          {{ contact.locationLabel }}
        </span>
      </div>
      <Input
        v-for="field in FIELDS"
        :id="field.key"
        :key="field.key"
        v-model="formData[field.key]"
        :type="field.type"
        :textarea="field.textarea"
        :rows="field.rows"
        :label="form[field.key].label"
        :placeholder="form[field.key].placeholder"
        :error="errors[field.key]"
      />
      <div class="actions">
        <div class="submit-group">
          <Button
            type="submit"
            :icon="iconSend"
            :label="isSubmitting ? form.submittingLabel : form.submitLabel"
            :disabled="isSubmitting"
            :success="isSuccess"
            :error="isError"
          />
          <div class="contact-socials">
            <a
              v-for="link in social"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label"
            >
              <Icon :icon="link.icon" :width="22" :height="22" aria-hidden="true" />
            </a>
          </div>
        </div>
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
  </ImageSection>
</template>

<style scoped>
form {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0;
	align-self: center;
	grid-area: 2 / 3 / 7 / 5;
}

.contact-details {
	display: flex;
	flex-wrap: wrap;
	gap: var(--spacing-sm) var(--spacing-lg);
	margin-bottom: var(--spacing-sm);
	font-size: var(--font-size-span);
}

.contact-details a,
.contact-details span {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
	color: var(--text);
	text-decoration: none;
}

.contact-details span {
	color: var(--muted);
}

form .actions {
	display: flex;
	gap: var(--spacing-sm);
	justify-content: space-between;
	margin-top: var(--spacing-xs);
}

form .actions button {
	place-self: center;
	height: fit-content;
}

.submit-group,
.contact-socials {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
}

.contact-socials a {
	display: grid;
	width: 44px;
	height: 44px;
	place-items: center;
	border: 1px solid var(--glass-border);
	border-radius: var(--radius-full);
	color: var(--muted);
	text-decoration: none;
	transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.contact-socials a:hover {
	border-color: var(--glass-border-hover);
	background: var(--glass-hover);
	color: var(--text);
}

.captcha-block {
	display: flex;
	flex-direction: column;
}

.captcha-error {
	color: var(--error);
	font-size: var(--font-size-span);
}

@media (min-width: 901px) {
	:global(#contact > img) {
		height: clamp(360px, 82vh, 700px);
	}
}

@media (max-width: 900px) {
	form {
		max-width: 100%;
	}

	form .actions {
		flex-direction: column;
	}

	form .actions button {
		place-self: unset;
	}

	.submit-group {
		justify-content: space-between;
	}
}
</style>
