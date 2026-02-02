<script setup lang="ts">
interface TimelineItem {
  date: string
  organization: string
  role?: string
  description?: string
}

interface Props {
  items: TimelineItem[]
}

defineProps<Props>()
</script>

<template>
  <div class="timeline">
    <div class="timeline-container">
      <div class="timeline-line"></div>
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="['timeline-item', index % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right']"
      >
        <div class="timeline-marker">
          <div class="timeline-marker-inner"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-date">
            <p>{{ item.date }}</p>
          </div>
          <div class="timeline-organization">
            <h4>{{ item.organization }}</h4>
          </div>
          <div v-if="item.role" class="timeline-role">
            <h5>{{ item.role }}</h5>
          </div>
          <div v-if="item.description" class="timeline-description">
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.timeline-container {
  position: relative;
  width: 100%;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--glass-border) 10%,
    var(--glass-border) 90%,
    transparent
  );
  transform: translateX(-50%);
  z-index: 0;
}

.timeline-item {
  position: relative;
  margin-bottom: var(--spacing-3xl);
  display: flex;
  align-items: flex-start;
}

.timeline-item--left {
  justify-content: flex-start;
}

.timeline-item--right {
  justify-content: flex-end;
}

.timeline-marker {
  position: absolute;
  left: 50%;
  top: var(--spacing-md);
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-marker-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text);
  border: 3px solid var(--bg);
  box-shadow: 0 0 0 2px var(--glass-border);
}

.timeline-content {
  display: flex;
  flex-direction: column;
  width: calc(50% - var(--spacing-3xl));
  background: color-mix(in srgb, var(--text) 8%, transparent);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  backdrop-filter: blur(10px);
  gap: var(--spacing-sm);
}

.timeline-date {
  color: var(--muted);
  text-transform: uppercase;
}

.timeline-organization h3 {
  color: var(--text);
}

.timeline-role h5 {
  color: var(--muted);
}

.timeline-description p {
  color: var(--text);
}

@media (max-width: 768px) {
  .timeline-line {
    left: var(--spacing-xl);
  }

  .timeline-item {
    justify-content: flex-start !important;
  }

  .timeline-marker {
    left: var(--spacing-xl);
  }

  .timeline-content {
    width: calc(100% - var(--spacing-3xl));
    margin-left: var(--spacing-3xl) !important;
    margin-right: 0 !important;
  }
}
</style>
