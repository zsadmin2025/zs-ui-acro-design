import { caseHearingApi } from '@/api/lawyer/cases/hearing';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  HearingState,
  Hearing,
} from '@/types/lawyer/cases/hearing/hearingTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useHearingStore = defineStore('hearing', {
  state: (): HearingState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
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
      const { data } = await caseHearingApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.caseHearingId = data.caseHearingId;
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
    handleEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.caseInfoId = row.caseInfoId;
        this.addEditRef.form.caseHearingId = row?.caseHearingId;
        this.addEditRef.init();
      }
    },
    handleAdd(caseInfoId: string) {
      if (this.addEditRef) {
        this.addEditRef.form.caseInfoId = caseInfoId;
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
          await caseHearingApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(
      record: Hearing,
      emits: (event: 'update:caseHearingList') => void,
    ) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await caseHearingApi.delete(record.caseHearingId);
          emits('update:caseHearingList');
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '案件开庭信息';
      const response = await caseHearingApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
