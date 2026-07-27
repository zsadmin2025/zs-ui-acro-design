import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingListenerApi } from '@/api/bpm/setting/listener';
import type { ProcessListenerItem } from '@/types/bpm/bpmTypes';

export interface ProcessListenerState {
  loading: boolean;
  list: ProcessListenerItem[];
  total: number;
  searchForm: { name: string; eventType: string };
  pagination: { current: number; pageSize: number };
  dialogVisible: boolean;
  formRef: any;
  form: {
    id: string;
    name: string;
    eventType: string;
    handlerType: string;
    handlerValue: string;
    status: number;
    description: string;
  };
}

export const useProcessListenerStore = defineStore('processListener', {
  state: (): ProcessListenerState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { name: '', eventType: '' },
    pagination: { current: 1, pageSize: 10 },
    dialogVisible: false,
    formRef: null,
    form: {
      id: '',
      name: '',
      eventType: '',
      handlerType: '',
      handlerValue: '',
      status: 1,
      description: '',
    },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmSettingListenerApi.getListenerPage({
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
      this.searchForm = { name: '', eventType: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleAdd() {
      Object.assign(this.form, {
        id: '',
        name: '',
        eventType: '',
        handlerType: '',
        handlerValue: '',
        status: 1,
        description: '',
      });
      this.dialogVisible = true;
    },
    async handleEdit(record: ProcessListenerItem) {
      const { data } = await bpmSettingListenerApi.getListenerById(record.id);
      Object.assign(this.form, data?.data ?? data);
      this.dialogVisible = true;
    },
    async handleSubmit() {
      const e = await this.formRef?.validate();
      if (e) return;
      const a = this.form.id
        ? bpmSettingListenerApi.updateListener
        : bpmSettingListenerApi.saveListener;
      await a({ ...this.form });
      Message.success(this.form.id ? '更新成功' : '创建成功');
      this.dialogVisible = false;
      this.loadData();
    },
    handleDelete(record: ProcessListenerItem) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定删除「${record.name}」吗？`,
        onOk: async () => {
          await bpmSettingListenerApi.deleteListener(record.id);
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
