<script setup lang="ts">
interface Props {
	id: string;
	type?: "text" | "email";
	label?: string;
	placeholder?: string;
	error?: string;
	textarea?: boolean;
	rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
	type: "text",
	label: "",
	placeholder: "",
	error: undefined,
	textarea: false,
	rows: 6,
});

const model = defineModel<string>({ required: true });
const errorId = `${props.id}-error`;
</script>

<template>
	<div class="input-group">
		<label v-if="label" :for="id">
			{{ label }}
		</label>
		<textarea
			v-if="textarea"
			:id="id"
			v-model="model"
			:name="id"
			:placeholder="placeholder"
			:rows="rows"
			:class="{ 'input--error': error }"
			:aria-invalid="Boolean(error)"
			:aria-describedby="error ? errorId : undefined"
		></textarea>
		<input
			v-else
			:id="id"
			v-model="model"
			:name="id"
			:type="type"
			:placeholder="placeholder"
			:class="{ 'input--error': error }"
			:aria-invalid="Boolean(error)"
			:aria-describedby="error ? errorId : undefined"
		/>
		<span
			:id="errorId"
			class="input-error"
			:class="{ 'input-error--visible': error }"
			role="alert"
		>
			{{ error || " " }}
		</span>
	</div>
</template>

<style scoped>
.input-group {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-xs);
}

input,
textarea {
	width: 100%;
	padding: var(--spacing-sm);
	background: color-mix(in srgb, var(--text) 5%, transparent);
	border: 1px solid var(--glass-border);
	border-radius: var(--radius-sm);
	color: var(--text);
	font-family: var(--font-mono);
	font-size: var(--font-size-h5);
	transition: border-color 0.2s ease;
	resize: none;
}

input:focus,
textarea:focus {
	border-color: var(--text);
	box-shadow: 0 0 0 1px var(--text);
}

input::placeholder,
textarea::placeholder {
	color: var(--muted);
	opacity: 0.6;
}

.input--error {
	border-color: var(--error);
}

.input-error {
	min-height: 1.25rem;
	color: var(--error);
	opacity: 0;
	transition: opacity 0.15s ease;
}

.input-error--visible {
	opacity: 1;
}
</style>
