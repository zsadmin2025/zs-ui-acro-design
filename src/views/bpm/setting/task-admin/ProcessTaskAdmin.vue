<template>
  <div class="process-task-admin">
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
                  <a-form-item label="流程名称"
                    ><a-input
                      v-model="searchForm.processDefinitionName"
                      placeholder="请输入流程名称"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                  /></a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="任务名称"
                    ><a-input
                      v-model="searchForm.taskName"
                      placeholder="请输入任务名称"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                  /></a-form-item>
                </a-col>
                <!-- <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="处理人"
                    ><a-input
                      v-model="searchForm.assigneeName"
                      placeholder="请输入处理人"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                  /></a-form-item>
                </a-col> -->
                <a-col flex="1"
                  ><div style="text-align: right"
                    ><a-space :size="9" wrap
                      ><a-button type="primary" @click="store.loadData()"
                        ><template #icon><icon-search /></template
                        >搜索</a-button
                      ><a-button @click="store.resetSearch()"
                        ><template #icon><icon-refresh /></template
                        >重置</a-button
                      ></a-space
                    ></div
                  ></a-col
                >
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12"
            ><span class="page-subtitle">流程任务管理</span></a-col
          >
          <a-col
            v-if="appStore.device !== 'mobile'"
            :xs="24"
            :sm="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space
              ><a-tooltip content="刷新"
                ><div class="action-icon" @click="store.loadData()"
                  ><icon-refresh size="18" /></div></a-tooltip
              ><DensityDropdown @size-change="handleSizeChange"
            /></a-space>
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
          <template #status="{ record }">
            <a-tag v-if="record.approvalStatus === 'RUNNING'" color="blue"
              >审批中</a-tag
            >
            <a-tag
              v-else-if="record.approvalStatus === 'COMPLETED'"
              color="green"
              >已完成</a-tag
            >
            <a-tag v-else-if="record.approvalStatus === 'CANCELED'" color="red"
              >已取消</a-tag
            >
            <span v-else>{{ record.approvalStatus }}</span>
          </template>
          <template #duration="{ record }">
            <span>{{ formatDuration(record.durationInMillis) }}</span>
          </template>

          <template #operations="{ record }">
            <a-link @click="goToDetail(record)"
              ><template #icon><icon-eye /></template>详情</a-link
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
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useProcessTaskAdminStore } from '@/store/modules/bpm/setting/processTaskAdminStore';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';

  const store = useProcessTaskAdminStore();
  const appStore = useAppStore();
  const router = useRouter();
  const { loading, list, total, searchForm, pagination } = storeToRefs(store);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const formatDuration = (ms?: string | number) => {
    if (!ms) return '-';
    const num = Number(ms);
    if (num < 1000) return `${num}毫秒`;
    const seconds = Math.floor(num / 1000);
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}分${remainSeconds}秒`;
    const hours = Math.floor(minutes / 60);
    const remainMinutes = minutes % 60;
    return `${hours}时${remainMinutes}分${remainSeconds}秒`;
  };

  const goToDetail = (record: any) => {
    router.push({
      path: '/bpm/task/detail',
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
    { title: '流程定义名称', dataIndex: 'processDefinitionName', width: 180 },
    {
      title: '流程实例名称',
      dataIndex: 'processInstanceName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    { title: '流程单据', dataIndex: 'businessKey', width: 180 },
    { title: '发起人', dataIndex: 'startUserName', width: 120 },
    {
      title: '当前任务节点名称',
      dataIndex: 'taskName',
      ellipsis: true,
      tooltip: true,
      width: 160,
    },
    { title: '任务开始时间', dataIndex: 'taskStartTime', width: 180 },
    { title: '任务结束时间', dataIndex: 'taskEndTime', width: 180 },
    { title: '审批人', dataIndex: 'assigneeName', width: 120 },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      slotName: 'status',
      width: 100,
      align: 'center',
    },
    {
      title: '审批意见',
      dataIndex: 'comment',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '耗时',
      dataIndex: 'durationInMillis',
      slotName: 'duration',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 80,
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
  .process-task-admin {
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
