import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingApi } from '@/api/bpm/setting';
import type { ProcessModelItem } from '@/types/bpm/bpmTypes';

export interface ProcessModelState {
  loading: boolean;
  list: ProcessModelItem[];
  total: number;
  searchForm: { name: string; key: string };
  pagination: { current: number; pageSize: number };
  dialogVisible: boolean;
  formRef: any;
  form: {
    id: string;
    name: string;
    key: string;
    category: string;
    description: string;
  };
}

export const useProcessModelStore = defineStore('processModel', {
  state: (): ProcessModelState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { name: '', key: '' },
    pagination: { current: 1, pageSize: 10 },
    dialogVisible: false,
    formRef: null,
    form: { id: '', name: '', key: '', category: '', description: '' },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmSettingApi.getModelPage({
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
      this.searchForm = { name: '', key: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleAdd() {
      Object.assign(this.form, {
        id: '',
        name: '',
        key: '',
        category: '',
        description: '',
      });
      this.dialogVisible = true;
    },
    async handleEdit(record: ProcessModelItem) {
      const { data } = await bpmSettingApi.getModelById(record.id);
      Object.assign(this.form, data?.data ?? data);
      this.dialogVisible = true;
    },
    async handleSubmit() {
      const errors = await this.formRef?.validate();
      if (errors) return;
      const action = this.form.id
        ? bpmSettingApi.updateModel
        : bpmSettingApi.saveModel;
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
          await bpmSettingApi.deployModel(record.id);
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
          await bpmSettingApi.deleteModel(record.id);
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
