import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingApi } from '@/api/bpm/setting';
import type { ProcessTaskAdminItem } from '@/types/bpm/bpmTypes';

export interface ProcessTaskAdminState {
  loading: boolean;
  list: ProcessTaskAdminItem[];
  total: number;
  searchForm: {
    processDefinitionName: string;
    taskName: string;
    assigneeName: string;
  };
  pagination: { current: number; pageSize: number };
}

export const useProcessTaskAdminStore = defineStore('processTaskAdmin', {
  state: (): ProcessTaskAdminState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { processDefinitionName: '', taskName: '', assigneeName: '' },
    pagination: { current: 1, pageSize: 10 },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmSettingApi.getTaskAdminPage({
          ...this.searchForm,
          current: this.pagination.current,
          pageSize: this.pagination.pageSize,
        });
        const r = data?.data ?? data;
        this.list = r?.list ?? r?.records ?? [];
        this.total = r?.total ?? 0;
      } finally {
        this.loading = false;
      }
    },
    resetSearch() {
      this.searchForm = {
        processDefinitionName: '',
        taskName: '',
        assigneeName: '',
      };
      this.pagination.current = 1;
      this.loadData();
    },
    handleDelete(record: ProcessTaskAdminItem) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定删除任务「${record.taskName}」吗？`,
        onOk: async () => {
          await bpmSettingApi.deleteTaskAdmin(record.taskId);
          Message.success('删除成功');
          this.loadData();
        },
      });
    },
    resetState() {
      this.$reset();
    },
  },
});
