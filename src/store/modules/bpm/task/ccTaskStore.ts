import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { bpmTaskCcApi } from '@/api/bpm/task/cc';
import type { CcTaskItem } from '@/types/bpm/bpmTypes';

export interface CcTaskState {
  loading: boolean;
  list: CcTaskItem[];
  total: number;
  searchForm: {
    processDefinitionName: string;
    processDefinitionKey: string;
    processInstanceName: string;
    businessKey: string;
  };
  pagination: { current: number; pageSize: number };
}

export const useCcTaskStore = defineStore('ccTask', {
  state: (): CcTaskState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: {
      processDefinitionName: '',
      processDefinitionKey: '',
      processInstanceName: '',
      businessKey: '',
    },
    pagination: { current: 1, pageSize: 10 },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmTaskCcApi.getCcPage({
          ...this.searchForm,
          current: this.pagination.current,
          pageSize: this.pagination.pageSize,
        });
        const result = data?.data ?? data;
        this.list = result?.list ?? result?.records ?? [];
        this.total = result?.total ?? 0;
      } finally {
        this.loading = false;
      }
    },
    resetSearch() {
      this.searchForm = {
        processInstanceName: '',
        processDefinitionName: '',
        processDefinitionKey: '',
        businessKey: '',
      };
      this.pagination.current = 1;
      this.loadData();
    },
    async markRead(record: CcTaskItem) {
      await bpmTaskCcApi.markCcRead(record.id);
      Message.success('已标记为已读');
      this.loadData();
    },
    resetState() {
      this.$reset();
    },
  },
});
