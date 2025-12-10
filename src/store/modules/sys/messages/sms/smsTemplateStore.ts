import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  SmsTemplateState,
  SmsTemplate,
} from '@/types/sys/sms/smsTemplateTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import { sysSmsTemplateApi } from '@/api/sys/sms';

export const useTemplateStore = defineStore('template', {
  state: (): SmsTemplateState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    smsSendRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      sysSmsTemplateId: '',
      templateNumber: '',
      channel: '',
      signName: '',
      templateCode: '',
      templateContent: '',
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
      const { data } = await sysSmsTemplateApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysSmsTemplateId = data.sysSmsTemplateId;
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
        this.addEditRef.form.sysSmsTemplateId = row?.sysSmsTemplateId;
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
          await sysSmsTemplateApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: SmsTemplate) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await sysSmsTemplateApi.delete(record.sysSmsTemplateId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '短信模板';
      const response = await sysSmsTemplateApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },

    // 发送短信
    async handleSend(row: any) {
      await sysSmsTemplateApi.send(row);
    },
  },
});
