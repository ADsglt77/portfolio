<script setup lang="ts">
import { inject, ref } from "vue";
import { scrambleText } from "../lib/textScramble";
import { Icon } from "@iconify/vue";

interface Props {
	label?: string;
	icon?: string;
	iconPosition?: "left" | "right";
	disabled?: boolean;
	padding?: string;
	borderRadius?: string;
	type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
	label: "",
	icon: undefined,
	iconPosition: "left",
	disabled: false,
	padding: "var(--spacing-md)",
	borderRadius: "var(--radius-lg) 0",
	type: "button",
});

const emit = defineEmits<{
	click: [event: MouseEvent];
}>();

const animationsEnabled = inject<{ value: boolean } | undefined>(
	"animationsEnabled",
);
const buttonRef = ref<HTMLElement>();
const labelRef = ref<HTMLElement>();
const displayLabel = ref(props.label);

const handleClick = (event: MouseEvent) => {
	if (!props.disabled) {
		emit("click", event);
	}
};

const handleMouseEnter = () => {
	if (props.label && labelRef.value) {
		scrambleText(labelRef.value, props.label, {
			duration: 1000,
			fps: 10,
			skipAnimation: !animationsEnabled?.value,
		});
	}
};
</script>

<template>
  <button
    ref="buttonRef"
    :type="type"
    :class="{ 'btn--disabled': disabled }"
    :style="{
      padding: padding,
      borderRadius: borderRadius,
    }"
    :disabled="disabled"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <Icon
      v-if="icon && iconPosition === 'left'"
      :icon="icon"
      :width="18"
      :height="18"
      class="btn__icon btn__icon--left"
      aria-hidden
    />
    <slot>
      <span ref="labelRef" class="btn__label">{{ displayLabel }}</span>
    </slot>
    <Icon
      v-if="icon && iconPosition === 'right'"
      :icon="icon"
      :width="18"
      :height="18"
      class="btn__icon btn__icon--right"
      aria-hidden
    />
  </button>
</template>

<style scoped>
button {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text);
  font-family: var(--font-mono);
  cursor: pointer;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  &:hover {
    background: var(--glass-hover);
    border: 1px solid var(--glass-border-hover);
  }
}

.btn__icon {
  flex-shrink: 0;
}

.btn__label {
  display: inline-block;
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
