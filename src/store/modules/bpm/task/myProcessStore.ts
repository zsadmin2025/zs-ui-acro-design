import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmTaskMyProcessApi } from '@/api/bpm/task/my-process';
import type {
  MyProcessItem,
  MyProcessDetail,
  ApprovalTraceItem,
} from '@/types/bpm/bpmTypes';

export interface MyProcessState {
  loading: boolean;
  list: MyProcessItem[];
  total: number;
  searchForm: { processDefinitionName: string; status: string };
  pagination: { current: number; pageSize: number };
  detailVisible: boolean;
  detailLoading: boolean;
  currentDetail: MyProcessDetail | null;
  approvalTraces: ApprovalTraceItem[];
  rejectionRecords: ApprovalTraceItem[];
  modifyResubmitRecords: ApprovalTraceItem[];
  modelJson: string;
}

export const useMyProcessStore = defineStore('myProcess', {
  state: (): MyProcessState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { processDefinitionName: '', status: '' },
    pagination: { current: 1, pageSize: 10 },
    detailVisible: false,
    detailLoading: false,
    currentDetail: null,
    approvalTraces: [],
    rejectionRecords: [],
    modifyResubmitRecords: [],
    modelJson: '',
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmTaskMyProcessApi.getMyProcesses({
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
          await bpmTaskMyProcessApi.cancelProcess(record.processInstanceId);
          Message.success('撤销成功');
          this.loadData();
        },
      });
    },
    async handleUrge(record: MyProcessItem) {
      try {
        await bpmTaskMyProcessApi.urgeProcess(record.processInstanceId);
        Message.success('催办成功');
      } catch {
        Message.error('催办失败');
      }
    },
    async openDetail(record: MyProcessItem) {
      this.detailVisible = true;
      this.detailLoading = true;
      this.approvalTraces = [];
      this.rejectionRecords = [];
      this.modifyResubmitRecords = [];
      this.modelJson = '';
      try {
        const { data } = await bpmTaskMyProcessApi.getMyProcessDetail(
          record.processInstanceId,
        );
        const detail: MyProcessDetail = data?.data ?? data;
        this.currentDetail = detail;
        this.approvalTraces = detail.approvalTraces ?? [];
        this.rejectionRecords = detail.rejectionRecords ?? [];
        this.modifyResubmitRecords = detail.modifyResubmitRecords ?? [];
        this.modelJson = detail.modelJson ?? '';
      } finally {
        this.detailLoading = false;
      }
    },
    closeDetail() {
      this.detailVisible = false;
      this.currentDetail = null;
      this.approvalTraces = [];
      this.rejectionRecords = [];
      this.modifyResubmitRecords = [];
      this.modelJson = '';
    },
    resetState() {
      this.$reset();
    },
  },
});
