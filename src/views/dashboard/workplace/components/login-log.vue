<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      title="登录日志"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '15px 20px 13px 20px' }"
    >
      <div class="timeline-list">
        <a-timeline :reverse="true" label-position="same">
          <a-timeline-item
            v-for="(item, index) in list"
            :key="index"
            :label="
              `${item.ipAddress || ''}  ${item.city || ''}`.trim() || '未知地址'
            "
          >
            {{ item.loginTime || '未知时间' }}
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { useLoginLogStore } from '@/store/modules/sys/log/loginLogStore';

  const loginStore = useLoginLogStore();

  const loading = computed(() => loginStore.loading);
  const list = computed(() => loginStore.list);

  onMounted(() => {
    loginStore.fetchList();
  });
</script>

<style scoped lang="less">
  .general-card {
    min-height: 560px;
    overflow-y: auto;
  }
  .timeline-list {
    max-height: 500px;
    overflow-y: auto;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
