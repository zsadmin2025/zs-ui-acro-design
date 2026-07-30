import { caseInfoApi } from '@/api/lawyer/cases/info';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { InfoState, Info } from '@/types/lawyer/cases/info/infoTypes';
import { Message, Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useInfoStore = defineStore('info', {
  state: (): InfoState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      caseName: '',
      caseNo: '',
      caseType: '',
      proxyStage: '',
      nowStage: '',
      litigationStatus: '',
      applicant: '',
      applicantName: '',
      caseIntroduction: '',
      entrustmentMatters: '',
      caseStatus: undefined,
      creator: '',
      updater: '',
      current: 1,
      pageSize: 30,
      order: 'asc',
      orderField: 'createTime',
    },
    selectedKeys: [],
  }),
  actions: {
    async fetchData() {
      try {
        this.loading = true;
        const { data } = await caseInfoApi.page(this.form);
        this.list = data?.list ?? [];
        this.total = data.total ?? 0;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    // 跟进获取分页数据
    async loadfollowPage() {
      try {
        this.loading = true;
        const { data } = await caseInfoApi.followPage(this.form);
        this.list = data?.list ?? [];
        this.total = data.total ?? 0;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    // 结案获取分页数据
    async loadclosedPage() {
      try {
        this.loading = true;
        const { data } = await caseInfoApi.closedPage(this.form);
        this.list = data?.list ?? [];
        this.total = data.total ?? 0;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    // 归档获取分页数据
    async loadfilingPage() {
      try {
        this.loading = true;
        const { data } = await caseInfoApi.filingPage(this.form);
        this.list = data?.list ?? [];
        this.total = data.total ?? 0;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    // 作废获取分页数据
    async loadcancelPage() {
      try {
        this.loading = true;
        const { data } = await caseInfoApi.cancelPage(this.form);
        this.list = data?.list ?? [];
        this.total = data.total ?? 0;
        this.loading = false;
      } finally {
        this.loading = false;
      }
    },
    handleNodeClick(data: any) {
      this.form.caseInfoId = data.caseInfoId;
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
        this.addEditRef.form.caseInfo.caseInfoId = row?.caseInfoId;
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
          await caseInfoApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    // 作废
    async handleCancel(record: Info) {
      Modal.confirm({
        title: '确认作废',
        titleAlign: 'start',
        content: `确定要作废吗？`,
        onOk: async () => {
          const dataForm = {
            caseInfoId: record?.caseInfoId,
          };
          await caseInfoApi.cancel(dataForm);
          await this.fetchData();
        },
      });
    },
    /// 恢复
    async handleRestore(record: Info) {
      Modal.confirm({
        title: '确认恢复',
        titleAlign: 'start',
        content: `确定要恢复吗？`,
        onOk: async () => {
          const dataForm = {
            caseInfoId: record?.caseInfoId,
          };
          await caseInfoApi.restore(dataForm);
          await this.loadcancelPage();
        },
      });
    },
    async handleDelete(record: Info) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await caseInfoApi.delete(record?.caseInfoId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '案件信息';
      const response = await caseInfoApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
    // 纸质合同
    async onSwitchIsPaperContractSubmittedChange(record: any, newValue: any) {
      const oldValue = record.caseInfo.isPaperContractSubmitted;
      // 返回一个 Promise 控制是否允许切换
      return new Promise((resolve) => {
        Modal.confirm({
          title: '温馨提示',
          content: '您将进行此操作，是否继续?',
          onOk: async () => {
            try {
              record.caseInfo.isPaperContractSubmitted = newValue;
              await caseInfoApi.edit(record);
              resolve(true);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              record.caseInfo.isPaperContractSubmitted = oldValue; // 回滚本地状态
              resolve(false); // 拒绝切换
            }
          },
          onCancel: () => {
            record.caseInfo.isPaperContractSubmitted = oldValue; // 回滚本地状态
            resolve(false); // 拒绝切换
          },
        });
      });
    },
    // 所函
    async onSwitchIsLetterIssuedChange(record: any, newValue: any) {
      const oldValue = record.caseInfo.isLetterIssued;
      // 返回一个 Promise 控制是否允许切换
      return new Promise((resolve) => {
        Modal.confirm({
          title: '温馨提示',
          content: '您将进行此操作，是否继续?',
          onOk: async () => {
            try {
              record.caseInfo.isLetterIssued = newValue;
              await caseInfoApi.edit(record);
              resolve(true);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              record.caseInfo.isLetterIssued = oldValue; // 回滚本地状态
              resolve(false); // 拒绝切换
            }
          },
          onCancel: () => {
            record.caseInfo.isLetterIssued = oldValue; // 回滚本地状态
            resolve(false); // 拒绝切换
          },
        });
      });
    },

    // 归档
    async filing(record: any) {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行归档操作,是否继续?',
        onOk: async () => {
          try {
            const dataForm = {
              caseInfoId: record.caseInfo.caseInfoId,
            };
            await caseInfoApi.filing(dataForm);
            Message.success('归档成功');

            this.fetchData();
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : '未知错误';
            Message.error(errorMessage);
          }
        },
      });
    },
  },
});
