<template>
  <div class="todo-task">
    <zs-container v-if="!currentTask" layout="header-main-footer">
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
          <template #priority="{ record }">
            <a-tag v-if="record.priority === 1" color="red">高</a-tag>
            <a-tag v-else-if="record.priority === 2" color="orange">中</a-tag>
            <a-tag v-else-if="record.priority === 3" color="green">低</a-tag>
            <span v-else>-</span>
          </template>
          <template #operations="{ record }">
            <a-link @click="store.openDetail(record)"
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

    <zs-container v-else layout="header-main-footer">
      <template #header>
        <a-page-header title="待办详情" @back="store.goBack()">
          <template #subtitle>
            <a-space
              ><span>{{ currentTask.processDefinitionName }}</span
              ><span v-if="currentTask.taskName"
                >- {{ currentTask.taskName }}</span
              ></a-space
            >
          </template>
        </a-page-header>
      </template>
      <template #main-body>
        <a-spin :loading="detailLoading" style="width: 100%">
          <a-descriptions
            v-if="taskDetail?.processInstance"
            :column="{ xs: 1, sm: 2, md: 3 }"
            bordered
            size="small"
            title="流程信息"
          >
            <a-descriptions-item label="流程名称">{{
              taskDetail.processDefinitionName
            }}</a-descriptions-item>
            <a-descriptions-item label="发起人">{{
              taskDetail.processInstance.startUserName
            }}</a-descriptions-item>
            <a-descriptions-item label="发起时间">{{
              taskDetail.processInstance.startTime
            }}</a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <template
            v-if="taskDetail?.formType === 'DYNAMIC' && taskDetail?.formSchema"
          >
            <DynamicFormRenderer
              ref="dynamicFormRef"
              v-model="formData"
              :schema="taskDetail.formSchema"
              :field-permissions="taskDetail.fieldPermissions"
            />
          </template>
          <template
            v-else-if="
              taskDetail?.formType === 'BUSINESS' &&
              taskDetail?.businessFormPath
            "
          >
            <component
              :is="store.businessComponent"
              v-if="store.businessComponent"
              v-model="formData"
            />
            <a-empty v-else description="业务表单组件加载中..." />
          </template>
          <a-empty v-else-if="!detailLoading" description="无表单数据" />
          <a-divider />
          <ApprovalTrace :traces="approvalTraces" />
          <ApprovalActionPanel
            :task-id="currentTask.taskId"
            @success="store.handleActionSuccess"
          />
        </a-spin>
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useTodoTaskStore } from '@/store/modules/bpm/task/todoTaskStore';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import DynamicFormRenderer from '../components/DynamicFormRenderer.vue';
  import ApprovalTrace from '../components/ApprovalTrace.vue';
  import ApprovalActionPanel from '../components/ApprovalActionPanel.vue';

  const store = useTodoTaskStore();
  const appStore = useAppStore();
  const {
    loading,
    list,
    total,
    searchForm,
    pagination,
    currentTask,
    detailLoading,
    taskDetail,
    formData,
    approvalTraces,
    dynamicFormRef,
  } = storeToRefs(store);

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
      title: '任务名称',
      dataIndex: 'taskName',
      ellipsis: true,
      tooltip: true,
      width: 200,
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
      width: 150,
    },
    { title: '处理人', dataIndex: 'assigneeName', width: 120 },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    { title: '到期时间', dataIndex: 'dueDate', width: 180 },
    {
      title: '优先级',
      dataIndex: 'priority',
      slotName: 'priority',
      width: 80,
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
