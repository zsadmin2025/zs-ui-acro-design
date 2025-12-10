import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import { MailTasksState, MailTasks } from '@/types/sys/mail/mailTasksTypes';
import { sysMailTasksApi } from '@/api/sys/mail';

export const useMailTasksStore = defineStore('mailTasks', {
  state: (): MailTasksState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      subject: '',
      sender: '',
      senderName: '',
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
      const { data } = await sysMailTasksApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysMailTasksId = data.sysMailTasksId;
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
        this.addEditRef.form.sysMailTasksId = row?.sysMailTasksId;
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
          await sysMailTasksApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: MailTasks) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await sysMailTasksApi.delete(record.sysMailTasksId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '邮件任务';
      const response = await sysMailTasksApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
    // 发送
    handleSend(record: any) {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行发送邮件操作,是否继续?',
        onOk: async () => {
          await sysMailTasksApi.sendMailTask(record);
          await this.fetchData();
        },
      });
    },
  },
});
