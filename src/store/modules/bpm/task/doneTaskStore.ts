import { defineStore } from 'pinia';
import { bpmTaskApi } from '@/api/bpm/task';
import type { TaskItem } from '@/types/bpm/bpmTypes';

export interface DoneTaskState {
  loading: boolean;
  list: (TaskItem & { result?: string })[];
  total: number;
  searchForm: { processDefinitionName: string; taskName: string };
  pagination: { current: number; pageSize: number };
}

export const useDoneTaskStore = defineStore('doneTask', {
  state: (): DoneTaskState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { processDefinitionName: '', taskName: '' },
    pagination: { current: 1, pageSize: 10 },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmTaskApi.getDoneList({
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
      this.searchForm = { processDefinitionName: '', taskName: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    resetState() {
      this.$reset();
    },
  },
});
