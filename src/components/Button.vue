<script setup lang="ts">
interface Props {
  label?: string
  disabled?: boolean
  padding?: string
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false,
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--radius-md) 0',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="{ 'btn--disabled': disabled }"
    :style="{
      padding: padding,
      borderRadius: borderRadius,
    }"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
button {
  display: flex;
  align-items: center;
  color: var(--text);
  font-family: var(--font-mono, 'Space Mono', monospace);
  cursor: pointer;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
  &:hover {
    background: var(--glass-hover);
    border: 1px solid var(--glass-border-hover);
  }
}

.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
