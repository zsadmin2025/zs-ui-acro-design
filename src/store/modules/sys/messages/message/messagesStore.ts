import { ref } from 'vue';
import { defineStore } from 'pinia';
import { MessagesState, Messages } from '@/types/sys/messages/messagesTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import { sysMessagesApi } from '@/api/sys/message';

export const useMessagesStore = defineStore('messages', {
  state: (): MessagesState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    unReadCount: 0,
    form: {
      sysMessageId: '',
      type: null,
      senderId: '',
      receiverId: '',
      title: '',
      content: '',
      isRead: null,
      readTime: null,
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
      const { data } = await sysMessagesApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async queryUnReadCount() {
      const { data } = await sysMessagesApi.getList({});
      const unReadData = data?.filter((item: Messages) => item.isRead === 0);
      this.unReadCount = unReadData?.length ?? 0;
    },
    handleNodeClick(data: any) {
      this.form.sysMessageId = data.sysMessageId;
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
        this.addEditRef.form.sysMessageId = row?.sysMessageId;
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
          await sysMessagesApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: Messages) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await sysMessagesApi.delete(record.sysMessageId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '消息';
      const response = await sysMessagesApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
