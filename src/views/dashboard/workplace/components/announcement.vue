<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :title="$t('workplace.announcement')"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '15px 20px 13px 20px' }"
    >
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <div>
        <div v-for="(item, idx) in list" :key="idx" class="item">
          <a-tag v-if="item.type === 1" color="orangered" size="small">
            通知
          </a-tag>
          <a-tag v-else-if="item.type === 2" color="" size="small">
            公告
          </a-tag>
          <a-tag v-else color="blue" size="small">其他</a-tag>
          <span class="item-title" @click="openNotice(item)">
            {{ item.title }}
          </span>
        </div>
      </div>
      <a-modal
        v-model:visible="visible"
        title-align="start"
        width="50%"
        @cancel="visible = false"
      >
        <template #title> 查看公告 </template>
        <div class="notice">
          <div class="item-title">{{ dataForm.title }}</div>
          <div class="item-time">{{ dataForm.releaseTime }}</div>
          <div v-dompurify-html="dataForm.content" class="item-content"></div>
        </div>
      </a-modal>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { sysNoticeApi } from '@/api/sys/notice';

  interface NoticeItem {
    type: number;
    title: string;
  }

  const loading = ref(false);
  const list = ref<NoticeItem[]>([]);
  const dataForm = reactive({
    title: '',
    content: '',
    releaseTime: '',
    type: 1, // 1: 通知, 2: 公告, 3: 其他
    status: 1, // 1: 发布, 2: 草稿
    level: 1, // 通知公告等级: 普通、一般、紧急
  });
  const visible = ref(false);

  const fetchNoticeList = async () => {
    try {
      loading.value = true;
      const res = await sysNoticeApi.getLimit(6);
      list.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  const openNotice = (item: NoticeItem) => {
    visible.value = true;
    // 这里可以添加更多逻辑，比如跳转到公告详情页等

    Object.assign(dataForm, item);
  };

  onMounted(() => {
    fetchNoticeList();
  });
</script>

<style scoped lang="less">
  .general-card {
    min-height: 170px;
  }
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 8px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
  }
  .notice {
    padding: 16px;
    .item-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
      text-align: center;
    }
    .item-time {
      color: var(--color-text-3);
      margin-bottom: 12px;
      text-align: center;
    }
    .item-content {
      font-size: 14px;
      line-height: 1.5;
      color: var(--color-text-2);
    }
  }
</style>
