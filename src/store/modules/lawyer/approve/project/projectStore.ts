import { defineStore } from 'pinia';
import { projectApi } from '@/api/lawyer/approve/project';
import { InfoState } from '@/types/lawyer/approve/project/projectTypes';

export const useProjectStore = defineStore('approveProject', {
  state: (): InfoState => {
    return {
      addEditRef: null,
      ruleFormRef: null,
      list: [],
      total: 0,
      loading: false,
      selectedKeys: [],
      form: {
        approveStatus: '',
        current: 1,
        pageSize: 10,
      },
    };
  },
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await projectApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
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
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.caseInfo.caseInfoId = row?.caseInfoId;
        this.addEditRef.init();
      }
    },
  },
});
