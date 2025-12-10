import { defineStore } from 'pinia';
import { genApi } from '@/api/tool/gen';
import { GenTableState } from '@/types/tool/gen/genTypes';

export const useGenTableStore = defineStore('genTableStore', {
  state: (): GenTableState => ({
    dialogFormVisible: false,
    list: [],
    total: 0,
    loading: false,
    selectedKeys: [],
    form: {
      tableId: '',
      tableName: '',
      current: 1,
      pageSize: 10,
      order: 'desc',
      orderField: 'createTime',
    },
  }),
  getters: {},
  actions: {
    async init() {
      this.dialogFormVisible = true;
      await Promise.all([this.fetchData()]);
    },
    async fetchData() {
      this.loading = true;
      const { data } = await genApi.dbPage(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleCurrentChange(current: number) {
      this.form.current = current;
      this.fetchData();
    },
    handleSizeChange(pageSize: number) {
      this.form.pageSize = pageSize;
      this.fetchData();
    },
    resetSearch() {
      this.form = {
        tableId: '',
        tableName: '',
        current: 1,
        pageSize: 10,
        order: 'desc',
        orderField: 'createTime',
      };
      this.fetchData();
    },
    close() {
      this.form.tableName = '';
      this.dialogFormVisible = false;
    },
    async submit(emits: (event: 'refresh') => void) {
      await genApi.importTable({ tables: this.selectedKeys });
      this.close();
      this.selectedKeys = [];
      this.dialogFormVisible = false;
      emits('refresh');
    },
  },
});
