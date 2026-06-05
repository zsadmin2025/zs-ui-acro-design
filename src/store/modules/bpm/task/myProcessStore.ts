import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmTaskApi } from '@/api/bpm/task';
import type { MyProcessItem } from '@/types/bpm/bpmTypes';

export interface MyProcessState {
  loading: boolean;
  list: MyProcessItem[];
  total: number;
  searchForm: { processDefinitionName: string; status: string };
  pagination: { current: number; pageSize: number };
}

export const useMyProcessStore = defineStore('myProcess', {
  state: (): MyProcessState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { processDefinitionName: '', status: '' },
    pagination: { current: 1, pageSize: 10 },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmTaskApi.getMyProcesses({
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
      this.searchForm = { processDefinitionName: '', status: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleCancel(record: MyProcessItem) {
      Modal.confirm({
        title: '确认撤销',
        titleAlign: 'start',
        content: `确定要撤销流程「${record.processDefinitionName}」吗？`,
        onOk: async () => {
          await bpmTaskApi.cancelProcess(record.processInstanceId);
          Message.success('撤销成功');
          this.loadData();
        },
      });
    },
    resetState() {
      this.$reset();
    },
  },
});
