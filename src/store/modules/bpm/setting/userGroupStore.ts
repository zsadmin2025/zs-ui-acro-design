import { defineStore } from 'pinia';
import { Modal, Message } from '@arco-design/web-vue';
import { bpmSettingUserGroupApi } from '@/api/bpm/setting/user-group';
import type { UserGroupItem } from '@/types/bpm/bpmTypes';

export interface UserGroupState {
  loading: boolean;
  list: UserGroupItem[];
  total: number;
  searchForm: { groupName: string };
  pagination: { current: number; pageSize: number };
  dialogVisible: boolean;
  formRef: any;
  form: {
    id: string;
    groupName: string;
    groupCode: string;
    userIds: string[];
    userNames: string[];
    status: number;
    description: string;
  };
}

export const useUserGroupStore = defineStore('userGroup', {
  state: (): UserGroupState => ({
    loading: false,
    list: [],
    total: 0,
    searchForm: { groupName: '' },
    pagination: { current: 1, pageSize: 10 },
    dialogVisible: false,
    formRef: null,
    form: {
      id: '',
      groupName: '',
      groupCode: '',
      userIds: [],
      userNames: [],
      status: 1,
      description: '',
    },
  }),
  actions: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await bpmSettingUserGroupApi.getUserGroupPage({
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
      this.searchForm = { groupName: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleAdd() {
      Object.assign(this.form, {
        id: '',
        groupName: '',
        groupCode: '',
        userIds: [],
        userNames: [],
        status: 1,
        description: '',
      });
      this.dialogVisible = true;
    },
    async handleEdit(record: UserGroupItem) {
      const { data } = await bpmSettingUserGroupApi.getUserGroupById(record.id);
      Object.assign(this.form, data?.data ?? data);
      this.dialogVisible = true;
    },
    handleUserSelect(val: any) {
      if (val) {
        const users = Array.isArray(val) ? val : [val];
        this.form.userIds = users.map((u: any) => u.userId);
        this.form.userNames = users.map((u: any) => u.realName);
      }
    },
    async handleSubmit() {
      const e = await this.formRef?.validate();
      if (e) return;
      const a = this.form.id
        ? bpmSettingUserGroupApi.updateUserGroup
        : bpmSettingUserGroupApi.saveUserGroup;
      await a({ ...this.form });
      Message.success(this.form.id ? '更新成功' : '创建成功');
      this.dialogVisible = false;
      this.loadData();
    },
    handleDelete(record: UserGroupItem) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定删除分组「${record.groupName}」吗？`,
        onOk: async () => {
          await bpmSettingUserGroupApi.deleteUserGroup(record.id);
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
