import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingApi } from '@/api/bpm/setting';
import type { ProcessExpressionItem } from '@/types/bpm/bpmTypes';

export interface ProcessExpressionState {
  loading: boolean;
  list: ProcessExpressionItem[];
  total: number;
  searchForm: { name: string };
  pagination: { current: number; pageSize: number };
  dialogVisible: boolean;
  formRef: any;
  form: {
    id: string;
    name: string;
    expression: string;
    status: number;
    description: string;
  };
}

export const useProcessExpressionStore = defineStore('processExpression', {
  state: (): ProcessExpressionState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { name: '' },
    pagination: { current: 1, pageSize: 10 },
    dialogVisible: false,
    formRef: null,
    form: { id: '', name: '', expression: '', status: 1, description: '' },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmSettingApi.getExpressionPage({
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
      this.searchForm = { name: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleAdd() {
      Object.assign(this.form, {
        id: '',
        name: '',
        expression: '',
        status: 1,
        description: '',
      });
      this.dialogVisible = true;
    },
    async handleEdit(record: ProcessExpressionItem) {
      const { data } = await bpmSettingApi.getExpressionById(record.id);
      Object.assign(this.form, data?.data ?? data);
      this.dialogVisible = true;
    },
    async handleSubmit() {
      const e = await this.formRef?.validate();
      if (e) return;
      const a = this.form.id
        ? bpmSettingApi.updateExpression
        : bpmSettingApi.saveExpression;
      await a({ ...this.form });
      Message.success(this.form.id ? '更新成功' : '创建成功');
      this.dialogVisible = false;
      this.loadData();
    },
    handleDelete(record: ProcessExpressionItem) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定删除「${record.name}」吗？`,
        onOk: async () => {
          await bpmSettingApi.deleteExpression(record.id);
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
