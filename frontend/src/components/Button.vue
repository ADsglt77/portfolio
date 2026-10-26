<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, useAttrs } from "vue";
import { iconCheck, iconClose } from "../data/icons";
import { useAnimationsEnabled } from "../injectionKeys";
import { scrambleText } from "../lib/textScramble";

interface Props {
	label?: string;
	icon?: string;
	disabled?: boolean;
	padding?: string;
	borderRadius?: string;
	type?: "button" | "submit" | "reset";
	success?: boolean;
	error?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	label: "",
	icon: undefined,
	disabled: false,
	padding: "var(--spacing-md)",
	borderRadius: "var(--radius-lg) 0",
	type: "button",
	success: false,
	error: false,
});

defineOptions({ inheritAttrs: false });

const animationsEnabled = useAnimationsEnabled();
const attrs = useAttrs();
const labelRef = ref<HTMLElement>();

const accessibleLabel = computed(() => {
	const ariaLabel = attrs["aria-label"];
	return typeof ariaLabel === "string" ? ariaLabel : props.label || undefined;
});

const currentIcon = computed(() => {
	if (props.error) return iconClose;
	if (props.success) return iconCheck;
	return props.icon;
});

const handleMouseEnter = () => {
	if (props.label && labelRef.value) {
		scrambleText(labelRef.value, props.label, {
			skipAnimation: !animationsEnabled.value,
		});
	}
};
</script>

<template>
  <button
    v-bind="attrs"
    :type="type"
    :class="{ 'btn--success': success, 'btn--error': error }"
    :style="{ padding, borderRadius }"
    :disabled="disabled"
    :aria-label="accessibleLabel"
    @mouseenter="handleMouseEnter"
  >
    <Icon
      v-if="currentIcon"
      :icon="currentIcon"
      :width="18"
      :height="18"
      class="btn__icon"
      aria-hidden
    />
    <slot>
      <span ref="labelRef" class="btn__label" aria-hidden="true">{{ label }}</span>
    </slot>
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

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__icon {
  flex-shrink: 0;
}

.btn__label {
  display: inline-block;
}

.btn--success {
  background-color: color-mix(in srgb, var(--success) 10%, transparent);
  border-color: color-mix(in srgb, var(--success) 50%, transparent);
  color: var(--success);
}

.btn--success:hover {
  background-color: color-mix(in srgb, var(--success) 20%, transparent);
  border-color: color-mix(in srgb, var(--success) 70%, transparent);
}

.btn--success .btn__icon {
  animation: successIcon 0.6s ease;
}

@keyframes successIcon {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.btn--error {
  background-color: color-mix(in srgb, var(--error) 10%, transparent);
  border-color: color-mix(in srgb, var(--error) 50%, transparent);
  color: var(--error);
}

.btn--error:hover {
  background-color: color-mix(in srgb, var(--error) 20%, transparent);
  border-color: color-mix(in srgb, var(--error) 70%, transparent);
}

.btn--error .btn__icon {
  animation: errorIcon 0.6s ease;
}

@keyframes errorIcon {
  0% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
</style>
