interface ScrambleOptions {
  duration?: number
  fps?: number
  charset?: string
}

const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const animations = new WeakMap<HTMLElement, number>()

export function scrambleText(
  el: HTMLElement,
  finalText: string,
  options: ScrambleOptions = {},
): void {
  const prev = animations.get(el)
  if (prev) cancelAnimationFrame(prev)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = finalText
    return
  }

  const { duration = 1000, fps = 10 } = options
  const frameTime = 1000 / fps
  const totalFrames = Math.ceil(duration / frameTime)
  let frame = 0

  const animate = () => {
    if (frame >= totalFrames) {
      el.textContent = finalText
      animations.delete(el)
      return
    }

    const progress = frame / totalFrames
    let text = ''

    for (let i = 0; i < finalText.length; i++) {
      if (progress < 0.8) {
        text += charset[Math.floor(Math.random() * charset.length)]
      } else {
        const reveal = Math.floor(((progress - 0.8) / 0.2) * finalText.length)
        text += i <= reveal ? finalText[i] : charset[Math.floor(Math.random() * charset.length)]
      }
    }
    el.textContent = text
    frame++

    const id = requestAnimationFrame(() => setTimeout(animate, frameTime))
    animations.set(el, id)
  }

  animate()
}

export function scrambleFromEvent(
  e: Event,
  finalText: string,
  options: ScrambleOptions = {},
): void {
  scrambleText(e.currentTarget as HTMLElement, finalText, options)
}
