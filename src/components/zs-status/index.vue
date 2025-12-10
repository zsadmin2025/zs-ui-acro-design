<template>
  <div v-if="config" class="zs-status">
    <ZsIcon :icon="config.icon" :color="config.color" />
    <span>{{ config.text }}</span>
  </div>
  <div v-else>
    <span>未知状态</span>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    value: {
      type: [Number, String], // 允许字符串或数字，更灵活
      default: 0,
    },
    // 自定义配置：只传需要覆盖的字段
    customConfig: {
      type: Object as () => Partial<
        Record<
          string | number,
          { icon?: string; color?: string; text?: string }
        >
      >,
      default: () => ({}),
    },
  });

  const defaultStatusConfig: Record<
    string | number,
    { icon: string; color: string; text: string }
  > = {
    0: { icon: 'icon-filled-minus-circle', color: '#f53f3f', text: '禁用' },
    1: { icon: 'icon-filled-check-circle', color: '#00b42a', text: '启用' },
  };

  // 合并：先取默认，再用 customConfig 覆盖
  // 替换原来的 for...in 循环部分
  const mergedConfig = computed(() => {
    const result: Record<
      string | number,
      { icon: string; color: string; text: string }
    > = {};

    // 使用 Object.entries 安全遍历 defaultStatusConfig
    Object.entries(defaultStatusConfig).forEach(([key, value]) => {
      result[key] = {
        ...value,
        ...props.customConfig[key],
      };
    });

    // 处理 customConfig 中新增的状态项（不在 defaultStatusConfig 中）
    Object.entries(props.customConfig).forEach(([key, value]) => {
      if (!(key in defaultStatusConfig)) {
        result[key] = {
          icon: 'icon-help',
          color: '#999',
          text: '未知',
          ...value,
        };
      }
    });

    return result;
  });

  const config = computed(() => {
    return mergedConfig.value[props.value];
  });
</script>

<style scoped lang="less">
  .zs-status {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
</style>
