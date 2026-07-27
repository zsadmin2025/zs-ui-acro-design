<template>
  <div class="todo-task">
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
                  <a-form-item label="任务名称">
                    <a-input
                      v-model="searchForm.taskName"
                      placeholder="请输入任务名称"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                    />
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
            ><span class="page-subtitle">待办任务</span></a-col
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
          row-key="taskId"
          :loading="loading"
          :columns="columns"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #startUserName="{ record }">
            <a-space :size="4">
              <a-avatar :size="22" :style="{ backgroundColor: '#3370ff' }">
                {{ record.startUser?.startUserName?.charAt(0) }}
              </a-avatar>
              <span>{{ record.startUser?.startUserName }}</span>
            </a-space>
          </template>
          <template #operations="{ record }">
            <a-link @click="goToDetail(record)"
              ><template #icon><icon-eye /></template>处理</a-link
            >
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
  import { h, resolveComponent } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useTodoTaskStore } from '@/store/modules/bpm/task/todoTaskStore';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';

  const store = useTodoTaskStore();
  const appStore = useAppStore();
  const router = useRouter();
  const { loading, list, total, searchForm, pagination } = storeToRefs(store);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const goToDetail = (record: any) => {
    router.push({
      path: '/bpm/task/todo-detail',
      query: {
        processInstanceId: record.processInstanceId,
      },
    });
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
      width: 180,
      minWidth: 120,
    },
    {
      title: '业务单据',
      dataIndex: 'businessKey',
      ellipsis: true,
      tooltip: true,
      width: 160,
      minWidth: 120,
    },
    {
      title: '发起人',
      slotName: 'startUserName',
      width: 140,
      minWidth: 100,
    },
    {
      title: '发起部门',
      ellipsis: true,
      tooltip: true,
      width: 140,
      minWidth: 100,
      render: ({ record }) => (record as any).startUser?.deptName || '-',
    },
    {
      title: '流程实例',
      dataIndex: 'processInstanceName',
      ellipsis: true,
      tooltip: true,
      width: 200,
      minWidth: 150,
    },
    { title: '开始时间', dataIndex: 'startTime', width: 170, minWidth: 140 },
    {
      title: '完成时间',
      width: 100,
      minWidth: 80,
      render: ({ record }) => (record as any).todoTask?.endTime || '-',
    },
    {
      title: '任务节点',
      dataIndex: 'taskName',
      ellipsis: true,
      width: 100,
      minWidth: 80,
      render: ({ record }) =>
        (record as any).taskName
          ? h(
              resolveComponent('a-tag'),
              { color: 'blue' },
              () => (record as any).taskName,
            )
          : h('span', '-'),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 80,
      minWidth: 60,
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
  .todo-task {
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
