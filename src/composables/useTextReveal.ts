import { onUnmounted, watch, nextTick, type Ref } from 'vue'
import { textReveal } from '../lib/textReveal'
import type { TextRevealOptions } from '../lib/textReveal'

type UseTextRevealOptions = {
  active?: Ref<boolean> // ex: entered injecté depuis App
  threshold?: number // seuil IntersectionObserver (ex: 0.3)
} & TextRevealOptions

export function useTextReveal(
  elementRef: Ref<HTMLElement | null>,
  text: string,
  options: UseTextRevealOptions = {},
) {
  const { active, threshold = 0.3, delay = 50 } = options

  let hasRevealed = false
  let observer: IntersectionObserver | null = null

  const setupObserver = () => {
    if (!elementRef.value || !active?.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRevealed && active.value) {
            hasRevealed = true
            if (elementRef.value) {
              textReveal(elementRef.value, text, { delay })
            }
          } else if (!entry.isIntersecting && hasRevealed) {
            hasRevealed = false
            if (elementRef.value) {
              elementRef.value.innerHTML = ''
            }
          }
        })
      },
      { threshold },
    )

    observer.observe(elementRef.value)
  }

  watch(
    active ?? ({ value: true } as Ref<boolean>),
    async (isActive) => {
      if (!isActive) return
      await nextTick()
      setupObserver()
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    reveal: () => {
      if (elementRef.value && !hasRevealed) {
        hasRevealed = true
        textReveal(elementRef.value, text, { delay })
      }
    },
  }
}
