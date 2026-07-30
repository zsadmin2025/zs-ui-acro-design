import { caseInfoFilesApi } from '@/api/lawyer/cases/infoFiles';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  InfoFilesState,
  InfoFiles,
} from '@/types/lawyer/cases/infoFiles/infoFilesTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useInfoFilesStore = defineStore('infoFiles', {
  state: (): InfoFilesState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      caseInfoFilesId: '',
      caseOtherId: '',
      fileSource: '',
      fileName: '',
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
      const { data } = await caseInfoFilesApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.caseInfoFilesId = data.caseInfoFilesId;
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
        this.addEditRef.form.caseInfoFilesId = row?.caseInfoFilesId;
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
          await caseInfoFilesApi.batchDel(ids);
        },
      });
    },
    async handleDelete(
      record: InfoFiles,
      emits: (event: 'refreshDetails') => void,
    ) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await caseInfoFilesApi.delete(record.caseInfoFilesId);
          emits('refreshDetails');
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '案件附件';
      const response = await caseInfoFilesApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
