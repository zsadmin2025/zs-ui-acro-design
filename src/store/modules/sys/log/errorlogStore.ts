import { ref } from 'vue';
import { defineStore } from 'pinia';
import download from '@/utils/fileDownload';
import { ErrorLogState } from '@/types/sys/log/errorLogTypes';
import { sysLogErrorApi } from '@/api/sys/errorLog';

export const useErrorLogStore = defineStore('errorLog', {
  state: (): ErrorLogState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      username: '',
      module: '',
      ipAddress: '',
      exceptionType: '',
      exceptionMessage: '',
      requestMethod: '',
      requestPath: '',
      requestParams: '',
      current: 1,
      pageSize: 30,
      order: 'desc',
      orderField: 'createTime',
    },
    selectedKeys: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await sysLogErrorApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysLogErrorId = data.sysLogErrorId;
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
    handleDetails(data: any) {
      if (this.addEditRef) {
        this.addEditRef.open(data);
      }
    },
    // 导出
    async handleExport() {
      const excelName = '异常日志';
      const response = await sysLogErrorApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
