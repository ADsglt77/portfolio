<script setup lang="ts">
import { inject, type Ref, ref } from "vue";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import SectionHeader from "../components/SectionHeader.vue";
import { useFadeIn } from "../composables/useFadeIn";
import { usePinnedTyping } from "../composables/usePinnedTyping";
import { contactData } from "../data/contact";
import { iconSend } from "../data/icons";
import client from "../lib/client";

const entered = inject<Ref<boolean>>("entered")!;

const displayedText = ref("");
const sectionRef = ref<HTMLElement | null>(null);
const formRef = ref<HTMLElement | null>(null);

usePinnedTyping(sectionRef, contactData.title, displayedText, {
	active: entered,
	threshold: 0.3,
	typingDuration: 2000,
});

useFadeIn(formRef, {
	active: entered,
	threshold: 0.5,
	duration: 1500,
	delay: 500,
	translateY: 30,
});

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };
const FEEDBACK_DURATION = 3000;

const formData = ref({ ...EMPTY_FORM });
const errors = ref({ ...EMPTY_FORM });
const isSubmitting = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

const resetErrors = () => {
	errors.value = { ...EMPTY_FORM };
};

const showTemporaryState = (
	state: { value: boolean },
	duration = FEEDBACK_DURATION,
) => {
	state.value = true;
	setTimeout(() => {
		state.value = false;
	}, duration);
};

const validateForm = (): boolean => {
	resetErrors();
	let isValid = true;

	const f = contactData.form;
	if (!formData.value.name.trim()) {
		errors.value.name = f.name.error;
		isValid = false;
	}

	if (!formData.value.email.trim()) {
		errors.value.email = f.email.error;
		isValid = false;
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
		errors.value.email = f.email.errorInvalid;
		isValid = false;
	}

	if (!formData.value.subject.trim()) {
		errors.value.subject = f.subject.error;
		isValid = false;
	}

	if (!formData.value.message.trim()) {
		errors.value.message = f.message.error;
		isValid = false;
	}

	return isValid;
};

const handleSubmit = async (e: Event) => {
	e.preventDefault();
	if (isSubmitting.value) return;

	if (!validateForm()) {
		showTemporaryState(isError);
		return;
	}

	isSubmitting.value = true;
	isError.value = false;

	const { error } = await client.contact.post(formData.value);

	isSubmitting.value = false;

	if (error) {
		showTemporaryState(isError);
		return;
	}

	showTemporaryState(isSuccess);

	setTimeout(() => {
		formData.value = { ...EMPTY_FORM };
		resetErrors();
	}, FEEDBACK_DURATION);
};
</script>

<template>
  <section ref="sectionRef" id="contact" class="section contact">
    <SectionHeader
      :image-src="contactData.image.src"
      :image-alt="contactData.image.alt"
      :displayed-text="displayedText"
    />
    <form ref="formRef" @submit="handleSubmit" novalidate>
        <Input
          id="name"
          v-model="formData.name"
          type="text"
          :label="contactData.form.name.label"
          :placeholder="contactData.form.name.placeholder"
          :error="errors.name"
        />
        <Input
          id="email"
          v-model="formData.email"
          type="email"
          :label="contactData.form.email.label"
          :placeholder="contactData.form.email.placeholder"
          :error="errors.email"
        />
        <Input
          id="subject"
          v-model="formData.subject"
          type="text"
          :label="contactData.form.subject.label"
          :placeholder="contactData.form.subject.placeholder"
          :error="errors.subject"
        />
        <Input
          id="message"
          v-model="formData.message"
          :textarea="true"
          :rows="6"
          :label="contactData.form.message.label"
          :placeholder="contactData.form.message.placeholder"
          :error="errors.message"
        />
        <Button
          type="submit"
          :icon="iconSend"
          :label="isSubmitting ? contactData.form.submittingLabel : contactData.form.submitLabel"
          :disabled="isSubmitting"
          :success="isSuccess"
          :error="isError"
        />
    </form>
  </section>
</template>

<style scoped>
.section.contact {
	width: 100%;
	max-width: 80vw;
	margin: 0 auto;
	min-height: 100vh;
	display: grid;
	grid-template-columns: minmax(280px, 520px) minmax(320px, 1fr);
	gap: var(--spacing-2xl);
	padding: var(--spacing-3xl) var(--spacing-xl);
	align-items: center;
}

form {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);
}

@media (max-width: 900px) {
	.section.contact {
		grid-template-columns: 1fr;
		padding: 0 var(--spacing-xl);
		gap: var(--spacing-xl);
	}
}
</style>
