import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingInstanceApi } from '@/api/bpm/setting/instance';
import type { ProcessInstanceItem } from '@/types/bpm/bpmTypes';

export interface ProcessInstanceState {
  loading: boolean;
  list: ProcessInstanceItem[];
  total: number;
  searchForm: { processDefinitionName: string; status: string };
  pagination: { current: number; pageSize: number };
}

export const useProcessInstanceStore = defineStore('processInstance', {
  state: (): ProcessInstanceState => ({
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
        const { data } = await bpmSettingInstanceApi.getAllInstancePage({
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
      this.searchForm = { processDefinitionName: '', status: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleSuspend(record: ProcessInstanceItem) {
      Modal.confirm({
        title: '确认挂起',
        titleAlign: 'start',
        content: `确定挂起流程「${record.processDefinitionName}」吗？`,
        onOk: async () => {
          await bpmSettingInstanceApi.suspendInstance(record.processInstanceId);
          Message.success('已挂起');
          this.loadData();
        },
      });
    },
    handleActivate(record: ProcessInstanceItem) {
      Modal.confirm({
        title: '确认激活',
        titleAlign: 'start',
        content: `确定激活流程「${record.processDefinitionName}」吗？`,
        onOk: async () => {
          await bpmSettingInstanceApi.activateInstance(
            record.processInstanceId,
          );
          Message.success('已激活');
          this.loadData();
        },
      });
    },
    handleDelete(record: ProcessInstanceItem) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定删除流程实例「${record.processDefinitionName}」吗？`,
        onOk: async () => {
          await bpmSettingInstanceApi.terminateInstance(
            record.processInstanceId,
          );
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
