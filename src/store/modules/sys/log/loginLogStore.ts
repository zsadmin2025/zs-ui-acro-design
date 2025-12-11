import { sysLogLoginApi } from '@/api/sys/loginLog';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import download from '@/utils/fileDownload';
import { LoginLogState } from '@/types/sys/log/loginLogTypes';

export const useLoginLogStore = defineStore('logLogin', {
  state: (): LoginLogState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      sysLogLoginId: '',
      username: '',
      ipAddress: '',
      loginTime: null,
      city: '',
      userAgent: '',
      loginStatus: null,
      failureReason: '',
      loginMethod: 1,
      loginSource: '',
      browser: '',
      os: '',
      tenantId: '',
      current: 1,
      pageSize: 30,
      order: 'desc',
      orderField: 'loginTime',
    },
    selectedKeys: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await sysLogLoginApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    // 列表
    async fetchList() {
      this.loading = true;
      const { data } = await sysLogLoginApi.getTodayList({});
      this.list = data;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysLogLoginId = data.sysLogLoginId;
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
      const excelName = '登录日志';
      const response = await sysLogLoginApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
