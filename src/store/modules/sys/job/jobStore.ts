import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import { sysJobApi } from '@/api/sys/job';
import { JobState, Job } from '@/types/sys/job/jobTypes';

export const useJobStore = defineStore('job', {
  state: (): JobState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    logRef: ref<HTMLFormElement | null>(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      sysJobId: '',
      jobName: '',
      jobGroup: '',
      cronExpression: '',
      status: null,
      jobClass: '',
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
      const { data } = await sysJobApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysJobId = data.sysJobId;
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
        this.addEditRef.form.sysJobId = row?.sysJobId;
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
          await sysJobApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: Job) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await sysJobApi.delete(record.sysJobId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '定时任务';
      const response = await sysJobApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
    async handlePause(record: any) {
      record.status = 0;
      await sysJobApi.pause(record);
      this.fetchData();
    },
    async handleResume(record: any) {
      record.status = 1;
      await sysJobApi.resume(record);
      this.fetchData();
    },
    async handleRun(record: any) {
      await sysJobApi.run(record);
      this.fetchData();
    },
    handleClick(record: any) {
      if (record.status === 1) {
        this.handlePause(record);
      } else {
        this.handleResume(record);
      }
    },
    handleLog(record: any) {
      if (this.logRef) {
        this.logRef.form.sysJobId = record?.sysJobId;
        this.logRef.init();
      }
    },
  },
});
