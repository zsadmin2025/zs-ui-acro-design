import { caseInfoApprovalFormApi } from '@/api/lawyer/cases/infoApprovalForm';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  InfoApprovalFormState,
  InfoApprovalForm,
} from '@/types/lawyer/cases/infoApprovalForm/infoApprovalFormTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useInfoApprovalFormStore = defineStore('infoApprovalForm', {
  state: (): InfoApprovalFormState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      caseInfoApprovalFormId: '',
      caseInfoId: '',
      caseNo: '',
      current: 1,
      pageSize: 30,
    },
    selectedKeys: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await caseInfoApprovalFormApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.caseInfoApprovalFormId = data.caseInfoApprovalFormId;
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
        this.addEditRef.form.caseInfoApprovalFormId =
          row?.caseInfoApprovalFormId;
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
          await caseInfoApprovalFormApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: InfoApprovalForm) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await caseInfoApprovalFormApi.delete(record.caseInfoApprovalFormId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '案件审批表';
      const response = await caseInfoApprovalFormApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
