import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingFormApi } from '@/api/bpm/setting/form';
import type { ProcessFormItem } from '@/types/bpm/bpmTypes';

export interface ProcessFormState {
  loading: boolean;
  list: ProcessFormItem[];
  total: number;
  searchForm: { formName: string; formKey: string };
  pagination: { current: number; pageSize: number };
  dialogVisible: boolean;
  formRef: any;
  form: { id: string; formName: string; formKey: string; description: string };
}

export const useProcessFormStore = defineStore('processForm', {
  state: (): ProcessFormState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { formName: '', formKey: '' },
    pagination: { current: 1, pageSize: 10 },
    dialogVisible: false,
    formRef: null,
    form: { id: '', formName: '', formKey: '', description: '' },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmSettingFormApi.getFormPage({
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
      this.searchForm = { formName: '', formKey: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleAdd() {
      Object.assign(this.form, {
        id: '',
        formName: '',
        formKey: '',
        description: '',
      });
      this.dialogVisible = true;
    },
    async handleEdit(record: ProcessFormItem) {
      const { data } = await bpmSettingFormApi.getFormById(record.id);
      Object.assign(this.form, data?.data ?? data);
      this.dialogVisible = true;
    },
    async handleSubmit() {
      const e = await this.formRef?.validate();
      if (e) return;
      const a = this.form.id
        ? bpmSettingFormApi.updateForm
        : bpmSettingFormApi.saveForm;
      await a({ ...this.form });
      Message.success(this.form.id ? '更新成功' : '创建成功');
      this.dialogVisible = false;
      this.loadData();
    },
    handlePublish(record: ProcessFormItem) {
      Modal.confirm({
        title: '确认发布',
        titleAlign: 'start',
        content: `确定发布表单「${record.formName}」吗？`,
        onOk: async () => {
          await bpmSettingFormApi.publishForm(record.id);
          Message.success('发布成功');
          this.loadData();
        },
      });
    },
    handleDelete(record: ProcessFormItem) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定删除表单「${record.formName}」吗？`,
        onOk: async () => {
          await bpmSettingFormApi.deleteForm(record.id);
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
