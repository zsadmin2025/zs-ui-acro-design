import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import { SmsRecordState } from '@/types/sys/sms/smsRecordTyoes';
import { sysSmsRecordApi } from '@/api/sys/sms';

export const useSmsRecordStore = defineStore('smsRecord', {
  state: (): SmsRecordState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      sysSmsRecordId: '',
      templateNumber: '',
      requestId: '',
      bizId: '',
      phoneNumbers: '',
      content: '',
      templateCode: '',
      templateParams: '',
      channel: '',
      status: '',
      sendTime: null,
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
      const { data } = await sysSmsRecordApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysSmsRecordId = data.sysSmsRecordId;
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
        templateNumber: this.form.templateNumber,
        current: 1,
        pageSize: 30,
        order: 'asc',
        orderField: 'createTime',
      };
      this.fetchData();
    },
    setSelectedKeys(keys: number[]) {
      this.selectedKeys = keys;
    },
    async handleDeleteSelected() {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行批量删除操作,是否继续?',
        onOk: async () => {
          const ids = this.selectedKeys.map((item: any) => item);
          await sysSmsRecordApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '短信记录';
      const response = await sysSmsRecordApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
