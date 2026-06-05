<template>
  <div class="my-process">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="[16, 16]">
          <a-col :flex="1">
            <a-form
              :model="searchForm"
              label-align="left"
              :auto-label-width="true"
            >
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="流程名称">
                    <a-input
                      v-model="searchForm.processDefinitionName"
                      placeholder="请输入流程名称"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="状态">
                    <a-select
                      v-model="searchForm.status"
                      placeholder="请选择状态"
                      :allow-clear="true"
                    >
                      <a-option value="RUNNING">运行中</a-option>
                      <a-option value="COMPLETED">已完成</a-option>
                      <a-option value="TERMINATED">已终止</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col flex="1">
                  <div style="text-align: right">
                    <a-space :size="9" wrap>
                      <a-button type="primary" @click="store.loadData()"
                        ><template #icon><icon-search /></template
                        >搜索</a-button
                      >
                      <a-button @click="store.resetSearch()"
                        ><template #icon><icon-refresh /></template
                        >重置</a-button
                      >
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
          <a-col :xs="24" :sm="12"
            ><span class="page-subtitle">我发起的流程</span></a-col
          >
          <a-col
            v-if="appStore.device !== 'mobile'"
            :xs="24"
            :sm="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip content="刷新"
                ><div class="action-icon" @click="store.loadData()"
                  ><icon-refresh size="18" /></div
              ></a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table
          row-key="processInstanceId"
          :loading="loading"
          :columns="columns"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <a-tag v-if="record.status === 'RUNNING'" color="blue"
              >运行中</a-tag
            >
            <a-tag v-else-if="record.status === 'COMPLETED'" color="green"
              >已完成</a-tag
            >
            <a-tag v-else-if="record.status === 'TERMINATED'" color="red"
              >已终止</a-tag
            >
            <span v-else>{{ record.status }}</span>
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-if="record.status === 'RUNNING'"
                status="danger"
                @click="store.handleCancel(record)"
              >
                <template #icon><icon-close-circle /></template>撤销
              </a-link>
              <span v-else>-</span>
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :show-total="appStore.device !== 'mobile'"
          :show-jumper="appStore.device !== 'mobile'"
          :show-page-size="appStore.device !== 'mobile'"
          :simple="appStore.device === 'mobile'"
          @change="store.loadData()"
          @page-size-change="store.loadData()"
        />
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useMyProcessStore } from '@/store/modules/bpm/task/myProcessStore';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';

  const store = useMyProcessStore();
  const appStore = useAppStore();
  const { loading, list, total, searchForm, pagination } = storeToRefs(store);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${
          rowIndex +
          1 +
          (pagination.value.current - 1) * pagination.value.pageSize
        }`,
      width: 60,
      align: 'center',
    },
    {
      title: '流程名称',
      dataIndex: 'processDefinitionName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '业务标识',
      dataIndex: 'businessKey',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    { title: '发起人', dataIndex: 'startUserName', width: 120 },
    { title: '发起时间', dataIndex: 'startTime', width: 180 },
    { title: '结束时间', dataIndex: 'endTime', width: 180 },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 100,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);

  onMounted(() => {
    store.loadData();
  });
  onUnmounted(() => {
    store.resetState();
  });
</script>

<style lang="less" scoped>
  .my-process {
    height: 100%;
  }
  .page-subtitle {
    font-size: 16px;
    font-weight: 500;
  }
  .action-icon {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    &:hover {
      background-color: var(--color-fill-2);
    }
  }
</style>
