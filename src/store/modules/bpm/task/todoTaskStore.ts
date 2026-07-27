import { shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { bpmTaskTodoApi } from '@/api/bpm/task/todo';
import type {
  TaskItem,
  TaskDetail,
  ApprovalTraceItem,
} from '@/types/bpm/bpmTypes';

export interface TodoTaskState {
  loading: boolean;
  list: TaskItem[];
  total: number;
  searchForm: { processDefinitionName: string; taskName: string };
  pagination: { current: number; pageSize: number };
  currentTask: TaskItem | null;
  detailLoading: boolean;
  taskDetail: TaskDetail | null;
  formData: Record<string, any>;
  businessComponent: any;
  dynamicFormRef: any;
  approvalTraces: ApprovalTraceItem[];
}

export const useTodoTaskStore = defineStore('todoTask', {
  state: (): TodoTaskState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { processDefinitionName: '', taskName: '' },
    pagination: { current: 1, pageSize: 10 },
    currentTask: null,
    detailLoading: false,
    taskDetail: null,
    formData: {},
    businessComponent: shallowRef(null),
    dynamicFormRef: null,
    approvalTraces: [],
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmTaskTodoApi.getTodoList({
          ...this.searchForm,
          current: this.pagination.current,
          pageSize: this.pagination.pageSize,
        });
        const result = data?.data ?? data;
        const rawList = result?.list ?? result?.records ?? [];
        this.list = rawList.map((item: Record<string, any>) => ({
          ...item,
          taskId: item.todoTask?.taskId || item.taskId || item.id,
          taskName: item.todoTask?.nodeName || item.taskName || item.name,
          createTime: item.startTime || item.createTime,
        }));
        this.total = result?.total ?? 0;
      } finally {
        this.loading = false;
      }
    },
    resetSearch() {
      this.searchForm = { processDefinitionName: '', taskName: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    async openDetail(record: TaskItem) {
      this.currentTask = record;
      this.detailLoading = true;
      this.formData = {};
      this.businessComponent = shallowRef(null);
      try {
        const { data } = await bpmTaskTodoApi.getTodoDetail(
          record.taskId || '',
        );
        const detail: TaskDetail = data?.data ?? data;
        this.taskDetail = detail;
        if (detail.formData) {
          this.formData = { ...detail.formData };
        }
        this.approvalTraces = (detail as any).approvalTraces ?? [];
      } finally {
        this.detailLoading = false;
      }
    },
    goBack() {
      this.currentTask = null;
      this.taskDetail = null;
    },
    handleActionSuccess(actionType: string) {
      if (actionType === 'PASS' || actionType === 'REJECT') {
        Message.success('处理完成');
        this.currentTask = null;
        this.loadData();
      }
    },
    resetState() {
      this.$reset();
    },
  },
});
