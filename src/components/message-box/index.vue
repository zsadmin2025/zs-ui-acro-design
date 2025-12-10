<template>
  <a-spin style="display: block" :loading="loading">
    <a-tabs v-model:active-key="messageType" type="rounded" destroy-on-hide>
      <a-tab-pane v-for="item in tabList" :key="item.key">
        <template #title>
          <span> {{ item.title }}{{ formatUnreadLength(item.key) }} </span>
        </template>
        <a-result v-if="!renderList.length" status="404">
          <template #subtitle> {{ $t('messageBox.noContent') }} </template>
        </a-result>
        <List
          :render-list="renderList"
          :unread-count="unreadCount"
          @item-click="handleItemClick"
        />
      </a-tab-pane>
      <template #extra>
        <a-button type="text" @click="emptyList">
          {{ $t('messageBox.tab.button') }}
        </a-button>
      </template>
    </a-tabs>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRefs, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { sysMessagesApi } from '@/api/sys/message';
  import { Messages } from '@/types/sys/messages/messagesTypes';
  import useLoading from '@/hooks/loading';
  import { useMessagesStore } from '@/store/modules/sys/messages/message/messagesStore';
  import List from './list.vue';

  interface TabItem {
    key: number;
    title: string;
  }
  const { loading, setLoading } = useLoading(true);
  const messageType = ref(1);
  const { t } = useI18n();
  const messageData = reactive<{
    renderList: Messages[];
    messageList: Messages[];
  }>({
    renderList: [],
    messageList: [],
  });
  toRefs(messageData);
  const tabList: TabItem[] = [
    {
      key: 1,
      title: t('messageBox.tab.title.message'),
    },
    {
      key: 2,
      title: t('messageBox.tab.title.notice'),
    },
    {
      key: 3,
      title: t('messageBox.tab.title.todo'),
    },
  ];
  async function fetchSourceData() {
    setLoading(true);
    try {
      const { data } = await sysMessagesApi.getList({});
      messageData.messageList = data ?? [];
    } catch (err) {
      // you can report use errorHandler or other
      /* eslint-disable no-console */
      console.error(err);
    } finally {
      await useMessagesStore().queryUnReadCount();
      setLoading(false);
    }
  }
  async function readMessage(data: Messages[]) {
    const ids = data.map((item) => item.sysMessageId);
    // 设置已读
    await sysMessagesApi.batchUpdateRead(ids);
    fetchSourceData();
  }
  const renderList = computed(() => {
    return messageData.messageList.filter(
      (item) => messageType.value === item.type,
    );
  });
  const unreadCount = computed(() => {
    return renderList.value.filter((item) => !item.isRead).length;
  });
  const getUnreadList = (type: number) => {
    const list = messageData.messageList.filter(
      (item) => item.type === type && !item.isRead,
    );
    return list;
  };
  const formatUnreadLength = (type: number) => {
    const list = getUnreadList(type);
    return list.length ? `(${list.length})` : ``;
  };
  const handleItemClick = (items: Messages[]) => {
    console.log('handleItemClick', items);
    if (renderList.value.length) readMessage(items);
  };
  const emptyList = () => {
    messageData.messageList = [];
  };
  fetchSourceData();
</script>

<style scoped lang="less">
  :deep(.arco-popover-popup-content) {
    padding: 0;
  }

  :deep(.arco-list-item-meta) {
    align-items: flex-start;
  }
  :deep(.arco-tabs-nav) {
    padding: 14px 0 12px 16px;
    border-bottom: 1px solid var(--color-neutral-3);
  }
  :deep(.arco-tabs-content) {
    padding-top: 0;
    .arco-result-subtitle {
      color: rgb(var(--gray-6));
    }
  }
</style>
