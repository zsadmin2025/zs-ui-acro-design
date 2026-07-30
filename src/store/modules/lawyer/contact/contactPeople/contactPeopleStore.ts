import { contactPeopleApi } from '@/api/lawyer/contact/contactPeople';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  ContactPeopleState,
  ContactPeople,
} from '@/types/lawyer/contact/contactPeople/contactPeopleTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useContactPeopleStore = defineStore('contactPeople', {
  state: (): ContactPeopleState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      contactPeopleId: '',
      name: '',
      phone: '',
      sex: '',
      contactCategoryId: '',
      placeWork: '',
      creator: '',
      updater: '',
      creatorDept: '',
      tenantId: '',
      current: 1,
      pageSize: 30,
      order: 'asc',
      orderField: 'createTime',
    },
    selectedKeys: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await contactPeopleApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.contactPeopleId = data.contactPeopleId;
      this.fetchData();
    },
    handleSizeChange(val: number) {
      this.form.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val: number) {
      this.form.current = val;
      this.fetchData();
    },
    reset() {
      this.form = {
        current: 1,
        pageSize: 30,
      };
      this.fetchData();
    },
    setSelectedKeys(keys: number[]) {
      this.selectedKeys = keys;
    },
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.contactPeopleId = row?.contactPeopleId;
        this.addEditRef.init();
      }
    },
    async handleDeleteSelected() {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行批量删除操作,是否继续?',
        onOk: async () => {
          const ids = this.selectedKeys.map((item: any) => item);
          await contactPeopleApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: ContactPeople) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await contactPeopleApi.delete(record.contactPeopleId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '通讯录联系人';
      const response = await contactPeopleApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
