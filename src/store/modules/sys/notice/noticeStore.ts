import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Modal } from '@arco-design/web-vue';
import { NoticeState, Notice } from '@/types/sys/notice/noticeTypes';
import { sysNoticeApi } from '@/api/sys/notice';

export const useNoticeStore = defineStore('notice', {
  state: (): NoticeState => ({
    addEditRef: ref(null),
    infoRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      title: '',
      content: '',
      type: null,
      level: null,
      status: null,
      current: 1,
      pageSize: 30,
      order: 'desc',
      orderField: 'releaseTime',
    },
    selectedKeys: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await sysNoticeApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysNoticeId = data.sysNoticeId;
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
    handleAddOrEdit(record: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysNoticeId = record?.sysNoticeId;
        this.addEditRef.init();
      }
    },
    // 详情
    handleInfo(record: any) {
      if (this.infoRef) {
        this.infoRef.form.sysNoticeId = record.sysNoticeId;
        this.infoRef.initInfo();
      }
    },
    // 发布
    handleRelease(record: any) {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行发布操作,是否继续?',
        onOk: async () => {
          await sysNoticeApi.release(record);
          await this.fetchData();
        },
      });
    },
    handleRevoke(record: any) {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行撤销操作,是否继续?',
        onOk: async () => {
          await sysNoticeApi.revoke(record);
          await this.fetchData();
        },
      });
    },
    async handleDeleteSelected() {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行批量删除操作,是否继续?',
        onOk: async () => {
          const ids = this.selectedKeys.map((item: any) => item);
          await sysNoticeApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: Notice) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await sysNoticeApi.del(record.sysNoticeId);
          await this.fetchData();
        },
      });
    },

    // // 导出
    // async handleExport() {
    //   const excelName = '通知公告';
    //   const response = await sysNoticeApi.exportExcel({ excelName });
    //   const data = response.data as Blob;
    //   download.excel(data, `${excelName}.xlsx`);
    // },
  },
});
