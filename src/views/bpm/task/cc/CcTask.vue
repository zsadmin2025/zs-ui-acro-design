<template>
  <div class="cc-task">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="[16, 16]">
          <a-col :flex="1">
            <a-form :model="searchForm" label-align="left" :auto-label-width="true">
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="流程名称">
                    <a-input v-model="searchForm.processDefinitionName" placeholder="请输入流程名称" :allow-clear="true" @press-enter="store.loadData()" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="标题">
                    <a-input v-model="searchForm.title" placeholder="请输入标题" :allow-clear="true" @press-enter="store.loadData()" />
                  </a-form-item>
                </a-col>
                <a-col flex="1">
                  <div style="text-align: right">
                    <a-space :size="9" wrap>
                      <a-button type="primary" @click="store.loadData()"><template #icon><icon-search /></template>搜索</a-button>
                      <a-button @click="store.resetSearch()"><template #icon><icon-refresh /></template>重置</a-button>
                    </a-space>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12"><span class="page-subtitle">抄送我的</span></a-col>
          <a-col v-if="appStore.device !== 'mobile'" :xs="24" :sm="12" style="display: flex; align-items: center; justify-content: end">
            <a-space>
              <a-tooltip content="刷新"><div class="action-icon" @click="store.loadData()"><icon-refresh size="18" /></div></a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table row-key="id" :loading="loading" :columns="columns" :data="list" :bordered="false" :size="currentSize" :pagination="false" :scroll="{ x: '100%', y: '100%' }">
          <template #readStatus="{ record }">
            <a-tag v-if="record.readStatus === 0" color="red">未读</a-tag>
            <a-tag v-else-if="record.readStatus === 1" color="green">已读</a-tag>
            <span v-else>-</span>
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link v-if="record.readStatus === 0" @click="store.markRead(record)"><template #icon><icon-check /></template>标记已读</a-link>
              <span v-else>-</span>
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination v-model:current="pagination.current" v-model:page-size="pagination.pageSize" :total="total" :show-total="appStore.device !== 'mobile'" :show-jumper="appStore.device !== 'mobile'" :show-page-size="appStore.device !== 'mobile'" :simple="appStore.device === 'mobile'" @change="store.loadData()" @page-size-change="store.loadData()" />
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { useCcTaskStore } from '@/store/modules/bpm/task/ccTaskStore';
import { useAppStore } from '@/store';
import DensityDropdown from '@/components/density-dropdown/index.vue';

const store = useCcTaskStore();
const appStore = useAppStore();
const { loading, list, total, searchForm, pagination } = storeToRefs(store);

const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
const handleSizeChange = (size: string) => { currentSize.value = size as 'small' | 'medium' | 'mini' | 'large'; };

const columns = computed<TableColumnData[]>(() => [
  { title: '#', dataIndex: 'index', render: ({ rowIndex }) => `${rowIndex + 1 + (pagination.value.current - 1) * pagination.value.pageSize}`, width: 60, align: 'center' },
  { title: '标题', dataIndex: 'title', ellipsis: true, tooltip: true, width: 300 },
  { title: '流程名称', dataIndex: 'processDefinitionName', ellipsis: true, tooltip: true, width: 200 },
  { title: '发送人', dataIndex: 'senderName', width: 120 },
  { title: '发送时间', dataIndex: 'createTime', width: 180 },
  { title: '状态', dataIndex: 'readStatus', slotName: 'readStatus', width: 80, align: 'center' },
  { title: '操作', dataIndex: 'operations', slotName: 'operations', width: 100, align: 'center', fixed: appStore.device === 'mobile' ? undefined : 'right', cellStyle: { whiteSpace: 'nowrap' } },
]);

onMounted(() => { store.loadData(); });
onUnmounted(() => { store.resetState(); });
</script>

<style lang="less" scoped>
.cc-task { height: 100%; }
.page-subtitle { font-size: 16px; font-weight: 500; }
.action-icon { cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s; &:hover { background-color: var(--color-fill-2); } }
</style>
