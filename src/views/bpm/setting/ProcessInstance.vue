<template>
  <div class="process-instance-admin">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="[16, 16]">
          <a-col :flex="1">
            <a-form :model="searchForm" label-align="left" :auto-label-width="true">
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="流程名称">
                    <a-input v-model="searchForm.processDefinitionName" placeholder="请输入流程名称" :allow-clear="true" @press-enter="loadData" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="状态">
                    <a-select v-model="searchForm.status" placeholder="请选择状态" :allow-clear="true">
                      <a-option value="RUNNING">运行中</a-option>
                      <a-option value="SUSPENDED">已挂起</a-option>
                      <a-option value="COMPLETED">已完成</a-option>
                      <a-option value="TERMINATED">已终止</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col flex="1">
                  <div style="text-align: right">
                    <a-space :size="9" wrap>
                      <a-button type="primary" @click="loadData"><template #icon><icon-search /></template>搜索</a-button>
                      <a-button @click="resetSearch"><template #icon><icon-refresh /></template>重置</a-button>
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
          <a-col :xs="24" :sm="12">
            <span class="page-subtitle">流程实例管理</span>
          </a-col>
          <a-col v-if="appStore.device !== 'mobile'" :xs="24" :sm="12" style="display: flex; align-items: center; justify-content: end">
            <a-space>
              <a-tooltip content="刷新"><div class="action-icon" @click="loadData"><icon-refresh size="18" /></div></a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table row-key="processInstanceId" :loading="loading" :columns="columns" :data="list" :bordered="false" :size="currentSize" :pagination="false" :scroll="{ x: '100%', y: '100%' }">
          <template #status="{ record }">
            <a-tag v-if="record.status === 'RUNNING'" color="blue">运行中</a-tag>
            <a-tag v-else-if="record.status === 'SUSPENDED'" color="orange">已挂起</a-tag>
            <a-tag v-else-if="record.status === 'COMPLETED'" color="green">已完成</a-tag>
            <a-tag v-else-if="record.status === 'TERMINATED'" color="red">已终止</a-tag>
            <span v-else>{{ record.status }}</span>
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link v-if="record.status === 'RUNNING'" status="warning" @click="handleSuspend(record)">
                <template #icon><icon-pause-circle /></template>挂起
              </a-link>
              <a-link v-if="record.status === 'SUSPENDED'" status="success" @click="handleActivate(record)">
                <template #icon><icon-play-circle /></template>激活
              </a-link>
              <a-link status="danger" @click="handleDelete(record)">
                <template #icon><icon-delete /></template>删除
              </a-link>
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination v-model:current="pagination.current" v-model:page-size="pagination.pageSize" :total="total" :show-total="appStore.device !== 'mobile'" :show-jumper="appStore.device !== 'mobile'" :show-page-size="appStore.device !== 'mobile'" :simple="appStore.device === 'mobile'" @change="loadData" @page-size-change="loadData" />
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { Modal, Message } from '@arco-design/web-vue';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import { bpmSettingApi } from '@/api/bpm/setting';
import type { ProcessInstanceItem } from '@/types/bpm/bpmTypes';
import { useAppStore } from '@/store';
import DensityDropdown from '@/components/density-dropdown/index.vue';

const appStore = useAppStore();
const loading = ref(false);
const list = ref<ProcessInstanceItem[]>([]);
const total = ref(0);
const currentSize = ref('medium');
const searchForm = reactive({ processDefinitionName: '', status: '' });
const pagination = reactive({ current: 1, pageSize: 10 });

const columns = computed<TableColumnData[]>(() => [
  { title: '#', dataIndex: 'index', render: ({ rowIndex }) => `${rowIndex + 1 + (pagination.current - 1) * pagination.pageSize}`, width: 60, align: 'center' },
  { title: '流程名称', dataIndex: 'processDefinitionName', ellipsis: true, tooltip: true, width: 200 },
  { title: '业务标识', dataIndex: 'businessKey', ellipsis: true, tooltip: true, width: 180 },
  { title: '发起人', dataIndex: 'startUserName', width: 120 },
  { title: '发起时间', dataIndex: 'startTime', width: 180 },
  { title: '结束时间', dataIndex: 'endTime', width: 180 },
  { title: '状态', dataIndex: 'status', slotName: 'status', width: 100, align: 'center' },
  { title: '操作', dataIndex: 'operations', slotName: 'operations', width: 180, align: 'center', fixed: appStore.device === 'mobile' ? undefined : 'right', cellStyle: { whiteSpace: 'nowrap' } },
]);

const loadData = async () => {
  loading.value = true;
  try {
    const { data } = await bpmSettingApi.getInstancePage({ ...searchForm, current: pagination.current, pageSize: pagination.pageSize });
    const result = data?.data ?? data;
    list.value = result?.list ?? result?.records ?? [];
    total.value = result?.total ?? 0;
  } finally { loading.value = false; }
};

const resetSearch = () => { searchForm.processDefinitionName = ''; searchForm.status = ''; pagination.current = 1; loadData(); };

const handleSuspend = (record: ProcessInstanceItem) => {
  Modal.confirm({
    title: '确认挂起', titleAlign: 'start',
    content: `确定挂起流程「${record.processDefinitionName}」吗？`,
    onOk: async () => { await bpmSettingApi.suspendInstance(record.processInstanceId); Message.success('已挂起'); loadData(); },
  });
};

const handleActivate = (record: ProcessInstanceItem) => {
  Modal.confirm({
    title: '确认激活', titleAlign: 'start',
    content: `确定激活流程「${record.processDefinitionName}」吗？`,
    onOk: async () => { await bpmSettingApi.activateInstance(record.processInstanceId); Message.success('已激活'); loadData(); },
  });
};

const handleDelete = (record: ProcessInstanceItem) => {
  Modal.confirm({
    title: '确认删除', titleAlign: 'start',
    content: `确定删除流程实例「${record.processDefinitionName}」吗？此操作不可恢复。`,
    onOk: async () => { await bpmSettingApi.deleteInstance(record.processInstanceId); Message.success('删除成功'); loadData(); },
  });
};

const handleSizeChange = (size: string) => { currentSize.value = size; };
onMounted(() => { loadData(); });
</script>

<style lang="less" scoped>
.process-instance-admin { height: 100%; .page-subtitle { font-size: 16px; font-weight: 500; } .action-icon { cursor: pointer; padding: 4px; border-radius: 4px; transition: background-color 0.2s; &:hover { background-color: var(--color-fill-2); } } }
</style>
