<template>
  <div class="approval-trace">
    <a-timeline v-if="traces && traces.length > 0">
      <a-timeline-item
        v-for="trace in traces"
        :key="trace.id"
        :dot-color="getDotColor(trace.result)"
        label=""
      >
        <div class="trace-item">
          <div class="trace-header">
            <span class="trace-name">{{ trace.taskName }}</span>
            <a-tag
              v-if="trace.result"
              :color="getResultColor(trace.result)"
              size="small"
            >
              {{ getResultLabel(trace.result) }}
            </a-tag>
          </div>
          <div v-if="trace.assigneeName" class="trace-info">
            <span class="trace-assignee">
              <icon-user />
              {{ trace.assigneeName }}
            </span>
            <span v-if="trace.startTime" class="trace-time">
              {{ formatTime(trace.startTime) }}
            </span>
            <span v-if="trace.duration" class="trace-duration">
              耗时 {{ formatDuration(trace.duration) }}
            </span>
          </div>
          <div v-if="trace.comment" class="trace-comment">
            <span class="comment-label">意见：</span>
            {{ trace.comment }}
          </div>
          <!-- 子节点（加签流转） -->
          <div
            v-if="trace.children && trace.children.length > 0"
            class="trace-children"
          >
            <a-timeline style="margin-left: 24px">
              <a-timeline-item
                v-for="child in trace.children"
                :key="child.id"
                :dot-color="getDotColor(child.result)"
              >
                <div class="trace-item">
                  <div class="trace-header">
                    <span class="trace-name">{{ child.taskName }}</span>
                    <a-tag
                      v-if="child.result"
                      :color="getResultColor(child.result)"
                      size="small"
                    >
                      {{ getResultLabel(child.result) }}
                    </a-tag>
                  </div>
                  <div v-if="child.assigneeName" class="trace-info">
                    <span class="trace-assignee">
                      <icon-user />
                      {{ child.assigneeName }}
                    </span>
                    <span v-if="child.startTime" class="trace-time">
                      {{ formatTime(child.startTime) }}
                    </span>
                  </div>
                  <div v-if="child.comment" class="trace-comment">
                    {{ child.comment }}
                  </div>
                </div>
              </a-timeline-item>
            </a-timeline>
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

  defineProps<{
    traces: ApprovalTraceItem[];
  }>();

  // 节点颜色
  const getDotColor = (result?: string): string => {
    switch (result) {
      case 'PASS':
        return 'green';
      case 'REJECT':
        return 'red';
      case 'TRANSFER':
      case 'DELEGATE':
        return 'blue';
      case 'ADD_SIGN':
      case 'REDUCE_SIGN':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // 结果标签颜色
  const getResultColor = (result?: string): string => {
    switch (result) {
      case 'PASS':
        return 'green';
      case 'REJECT':
        return 'red';
      case 'TRANSFER':
      case 'DELEGATE':
        return 'arcoblue';
      default:
        return 'gray';
    }
  };

  // 结果文本
  const getResultLabel = (result?: string): string => {
    const labelMap: Record<string, string> = {
      PASS: '通过',
      REJECT: '驳回',
      TRANSFER: '转办',
      DELEGATE: '委派',
      ADD_SIGN: '加签',
      REDUCE_SIGN: '减签',
      CC: '抄送',
    };
    return labelMap[result ?? ''] || result || '处理中';
  };

  // 格式化时间
  const formatTime = (time?: string): string => {
    if (!time) return '';
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  };

  // 格式化耗时
  const formatDuration = (ms?: number): string => {
    if (!ms) return '';
    if (ms < 1000 * 60) return `${Math.floor(ms / 1000)}秒`;
    if (ms < 1000 * 60 * 60) return `${Math.floor(ms / (1000 * 60))}分钟`;
    if (ms < 1000 * 60 * 60 * 24)
      return `${Math.floor(ms / (1000 * 60 * 60))}小时`;
    return `${Math.floor(ms / (1000 * 60 * 60 * 24))}天`;
  };
</script>

<style lang="less" scoped>
  .approval-trace {
    padding: 16px;

    .trace-item {
      .trace-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .trace-name {
          font-weight: 500;
          font-size: 14px;
        }
      }

      .trace-info {
        display: flex;
        align-items: center;
        gap: 16px;
        color: var(--color-text-3);
        font-size: 12px;
        margin-bottom: 4px;

        .trace-assignee {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .trace-comment {
        color: var(--color-text-2);
        font-size: 13px;
        padding: 6px 10px;
        background: var(--color-fill-2);
        border-radius: 4px;
        margin-top: 4px;

        .comment-label {
          font-weight: 500;
        }
      }

      .trace-children {
        margin-top: 8px;
      }
    }
  }
</style>
