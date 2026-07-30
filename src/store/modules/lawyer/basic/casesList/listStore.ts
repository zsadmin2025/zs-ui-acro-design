import { caseListApi } from '@/api/lawyer/basic/casesList';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ListState, List } from '@/types/lawyer/basic/list/listTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useListStore = defineStore('list', {
  state: (): ListState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      caseListId: '',
      caseType: '',
      fileName: '',
      fileUrl: '',
      isRequired: 1,
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
      const { data } = await caseListApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(selectedKeys: Array<string | number>, data: any) {
      this.form.caseType = data?.node?.dictValue;
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
    // 状态切换
    async handleIsRequiredChange(row: any) {
      await caseListApi.edit({
        caseListId: row.caseListId,
        isRequired: row.isRequired,
      });
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
        this.addEditRef.form.caseListId = row?.caseListId;
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
          await caseListApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: List) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await caseListApi.delete(record.caseListId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '结案目录';
      const response = await caseListApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
