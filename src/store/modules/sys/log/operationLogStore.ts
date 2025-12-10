import { ref } from 'vue';
import { defineStore } from 'pinia';
import download from '@/utils/fileDownload';
import { sysLogOperationApi } from '@/api/sys/operationLog';
import { LogOperationState } from '@/types/sys/log/operationLogTypes';

export const useLogOperationStore = defineStore('logOperation', {
  state: (): LogOperationState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      sysLogOperationId: '',
      username: '',
      module: '',
      ipAddress: '',
      operationType: '',
      operationDescription: '',
      requestMethod: '',
      requestPath: '',
      requestParams: '',
      responseStatusCode: null,
      responseMessage: '',
      operationDuration: 1,
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
      const { data } = await sysLogOperationApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysLogOperationId = data.sysLogOperationId;
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
    handleDetails(data: any) {
      if (this.addEditRef) {
        this.addEditRef.open(data);
      }
    },
    // 导出
    async handleExport() {
      const excelName = '操作日志';
      const response = await sysLogOperationApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
