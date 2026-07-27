<template>
  <div class="trace">
    <a-timeline v-if="traces?.length">
      <a-timeline-item
        v-for="(trace, idx) in traces"
        :key="trace.id"
        :dot-color="dotColor(trace.result)"
        :label="formatTime(trace.endTime || trace.startTime)"
      >
        <div class="trace-card" :class="`trace-card--${key(trace.result)}`">
          <!-- 头部 -->
          <div class="trace-card__hd">
            <strong>#{{ idx + 1 }} {{ trace.taskName }}</strong>
            <a-tag
              v-if="trace.result"
              :color="tagColor(trace.result)"
              size="small"
              >{{ label(trace.result) }}</a-tag
            >
            <span v-if="trace.duration" class="trace-card__cost"
              >耗时 {{ formatDuration(trace.duration) }}</span
            >
          </div>

          <!-- 审批人 -->
          <template v-if="trace.approvers?.length">
            <div
              v-for="(a, i) in trace.approvers"
              :key="i"
              class="trace-card__ap"
            >
              <div class="trace-card__ap-row">
                <span class="ap-name">{{ a.assigneeName || '-' }}</span>
                <a-tag
                  v-if="a.result"
                  :color="tagColor(a.result)"
                  size="small"
                  >{{ label(a.result) }}</a-tag
                >
                <span v-if="a.startTime" class="ap-time">{{
                  formatTime(a.startTime)
                }}</span>
                <span v-if="a.endTime" class="ap-time"
                  >→ {{ formatTime(a.endTime) }}</span
                >
                <span v-if="a.duration" class="ap-cost"
                  >耗时 {{ formatDuration(a.duration) }}</span
                >
              </div>
              <div v-if="a.comment" class="trace-card__comment">{{
                a.comment
              }}</div>
            </div>
          </template>

          <!-- 回退 -->
          <div v-else-if="trace.assigneeName" class="trace-card__ap">
            <div class="trace-card__ap-row">
              <span class="ap-name">{{ trace.assigneeName }}</span>
              <a-tag
                v-if="trace.result"
                :color="tagColor(trace.result)"
                size="small"
                >{{ label(trace.result) }}</a-tag
              >
            </div>
            <div v-if="trace.comment" class="trace-card__comment">{{
              trace.comment
            }}</div>
          </div>

          <!-- 加签 -->
          <div v-if="trace.children?.length" class="trace-card__cs">
            <div class="cs-label">加签流转</div>
            <div v-for="c in trace.children" :key="c.id" class="cs-item">
              <span>{{ c.taskName }}</span>
              <a-tag v-if="c.result" :color="tagColor(c.result)" size="small">{{
                label(c.result)
              }}</a-tag>
              <span v-if="c.assigneeName">{{ c.assigneeName }}</span>
              <span v-if="c.startTime" class="ap-time">{{
                formatTime(c.startTime)
              }}</span>
              <span v-if="c.duration" class="ap-cost"
                >耗时 {{ formatDuration(c.duration) }}</span
              >
              <div v-if="c.comment" class="trace-card__comment">{{
                c.comment
              }}</div>
            </div>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
    <a-empty v-else description="暂无审批记录" />
  </div>
</template>

<script lang="ts" setup>
  import type { ApprovalTraceItem } from '@/types/bpm/bpmTypes';
  import dayjs from 'dayjs';

  defineProps<{ traces: ApprovalTraceItem[] }>();

  const key = (r?: string) =>
    ((
      {
        PASS: 'pass',
        REJECT: 'reject',
        PENDING: 'pending',
        TRANSFER: 'transfer',
        DELEGATE: 'delegate',
      } as const
    )[r ?? ''] || 'default');

  const label = (r?: string) =>
    ((
      {
        PASS: '通过',
        REJECT: '驳回',
        TRANSFER: '转办',
        DELEGATE: '委派',
        PENDING: '审批中',
      } as const
    )[r ?? ''] ||
    r ||
    '待处理');

  const dotColor = (r?: string) =>
    ((
      {
        PASS: 'green',
        REJECT: 'red',
        PENDING: 'blue',
        TRANSFER: 'orangered',
        DELEGATE: 'purple',
      } as const
    )[r ?? ''] || 'gray');

  const tagColor = (r?: string) =>
    ((
      {
        PASS: 'green',
        REJECT: 'red',
        TRANSFER: 'orangered',
        DELEGATE: 'arcoblue',
      } as const
    )[r ?? ''] || 'arcoblue');

  const formatTime = (t?: string) =>
    t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : '';
  const formatDuration = (ms?: number): string => {
    if (!ms) return '';
    if (ms < 60_000) return `${Math.floor(ms / 1000)}秒`;
    if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}分钟`;
    if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}小时`;
    return `${Math.floor(ms / 86_400_000)}天`;
  };
</script>

<style lang="less" scoped>
  .trace {
    :deep(.arco-timeline-item-label) {
      font-size: 12px;
      color: var(--color-text-4);
    }
  }
  .trace-card {
    padding: 12px 16px;
    border: 1px solid var(--color-border-1);
    border-radius: 6px;
    background: var(--color-bg-2);
    &--pass {
      border-left: 3px solid #10b981;
    }
    &--reject {
      border-left: 3px solid #ef4444;
    }
    &--pending {
      border-left: 3px solid #3b82f6;
    }
    &--transfer {
      border-left: 3px solid #f59e0b;
    }
    &--delegate {
      border-left: 3px solid #8b5cf6;
    }
    &--default {
      border-left: 3px solid #94a3b8;
    }
    &__hd {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 10px;
      strong {
        font-size: 14px;
        color: var(--color-text-1);
      }
    }
    &__cost {
      margin-left: auto;
      font-size: 12px;
      color: var(--color-text-4);
      white-space: nowrap;
    }
    &__ap {
      padding: 6px 0;
      & + & {
        border-top: 1px solid var(--color-border-1);
      }
    }
    &__ap-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    &__comment {
      margin-top: 6px;
      padding: 8px 12px;
      font-size: 13px;
      color: var(--color-text-2);
      background: var(--color-fill-1);
      border-radius: 4px;
      line-height: 1.5;
    }
    &__cs {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed var(--color-border-2);
    }
  }
  .ap-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-1);
  }
  .ap-time {
    font-size: 12px;
    color: var(--color-text-3);
  }
  .ap-cost {
    font-size: 12px;
    color: var(--color-text-4);
  }
  .cs-label {
    font-size: 12px;
    color: var(--color-text-3);
    margin-bottom: 6px;
  }
  .cs-item {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 10px;
    padding: 4px 0 4px 10px;
    border-left: 2px solid var(--color-border-2);
    margin-bottom: 4px;
    font-size: 13px;
  }
</style>
