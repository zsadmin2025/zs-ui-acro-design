import { defineStore } from 'pinia';
import { sysJobApi } from '@/api/sys/job';
import { JobLogState } from '@/types/sys/job/jobLogTypes';
import download from '@/utils/fileDownload';

export const jobLogStore = defineStore('jobLog', {
  state: (): JobLogState => ({
    dialogFormVisible: false,
    jobLogList: [],
    loading: false,
    total: 0,
    form: {
      sysJobId: '',
      jobName: '',
      jobGroup: '',
      status: '',
      current: 1,
      pageSize: 30,
      order: 'desc',
      orderField: 'startTime',
    },
  }),
  getters: {},
  actions: {
    init() {
      this.dialogFormVisible = true;
      nextTick(async () => {
        if (this.form.sysJobId) {
          await this.pageLogList();
        }
      });
    },
    async pageLogList() {
      this.loading = true;
      const data = await sysJobApi.jobLogPage(this.form);
      this.jobLogList = data?.data?.list ?? [];
      this.total = data?.data?.total;
      this.loading = false;
    },
    handleSizeChange(val: number) {
      this.form.size = val;
      this.pageLogList();
    },
    handleCurrentChange(val: number) {
      this.form.page = val;
      this.pageLogList();
    },
    close() {
      this.$reset();
      this.dialogFormVisible = false;
    },
    handleStatusChange(value: any) {
      this.form.status = value;
      this.pageLogList();
    },
    reset() {
      this.form = {
        sysJobId: this.form.sysJobId,
        current: 1,
        pageSize: 30,
      };
      this.pageLogList();
    },
    // 导出
    async handleExport() {
      const excelName = '执行日志';
      const response = await sysJobApi.exportJobLogExcel({
        excelName,
        sysJobId: this.form.sysJobId,
      });
      download.excel(response.data, `${excelName}.xlsx`);
    },
  },
});
