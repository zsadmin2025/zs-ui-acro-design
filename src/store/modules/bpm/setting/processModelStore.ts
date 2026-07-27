import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingModelApi } from '@/api/bpm/setting/model';
import type { ProcessModelItem } from '@/types/bpm/bpmTypes';

export interface ProcessModelState {
  loading: boolean;
  list: ProcessModelItem[];
  total: number;
  searchForm: { processName: string; processKey: string };
  pagination: { current: number; pageSize: number };
  dialogVisible: boolean;
  formRef: any;
  form: {
    id: string;
    processName: string;
    processKey: string;
    category: string;
    description: string;
  };
}

export const useProcessModelStore = defineStore('processModel', {
  state: (): ProcessModelState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { processName: '', processKey: '' },
    pagination: { current: 1, pageSize: 10 },
    dialogVisible: false,
    formRef: null,
    form: {
      id: '',
      processName: '',
      processKey: '',
      category: '',
      description: '',
    },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmSettingModelApi.getModelPage({
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
      this.searchForm = { processName: '', processKey: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleAdd() {
      Object.assign(this.form, {
        id: '',
        processName: '',
        processKey: '',
        category: '',
        description: '',
      });
      this.dialogVisible = true;
    },
    async handleEdit(record: ProcessModelItem) {
      const { data } = await bpmSettingModelApi.getModelById(record.id);
      Object.assign(this.form, data?.data ?? data);
      this.dialogVisible = true;
    },
    async handleSubmit() {
      const errors = await this.formRef?.validate();
      if (errors) return;
      const action = this.form.id
        ? bpmSettingModelApi.updateModel
        : bpmSettingModelApi.saveModel;
      await action({ ...this.form });
      Message.success(this.form.id ? '更新成功' : '创建成功');
      this.dialogVisible = false;
      this.loadData();
    },
    handleDeploy(record: ProcessModelItem) {
      Modal.confirm({
        title: '确认部署',
        titleAlign: 'start',
        content: `确定部署模型「${record.name}」吗？`,
        onOk: async () => {
          await bpmSettingModelApi.deployModel(record.id);
          Message.success('部署成功');
          this.loadData();
        },
      });
    },
    handleDelete(record: ProcessModelItem) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定删除模型「${record.name}」吗？`,
        onOk: async () => {
          await bpmSettingModelApi.deleteModel(record.id);
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
