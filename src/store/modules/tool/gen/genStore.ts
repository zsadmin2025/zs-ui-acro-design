import { defineStore } from 'pinia';
import { genApi } from '@/api/tool/gen';
import { GenState, GenTable } from '@/types/tool/gen/genTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useGenStore = defineStore('genStore', {
  state: (): GenState => ({
    addEditRef: ref(null),
    genEditRef: ref(null),
    genPreviewRef: ref(null),
    list: [],
    total: 0,
    loading: false,
    selectedKeys: [],
    form: {
      tableId: '',
      tableName: '',
      current: 1,
      pageSize: 30,
      order: 'desc',
      orderField: 'createTime',
    },
  }),
  getters: {},
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await genApi.page(this.form);
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
        pageSize: 30,
        order: 'desc',
        orderField: 'createTime',
      };
      this.fetchData();
    },
    handleImport() {
      if (this.addEditRef) {
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
          await genApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: GenTable) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除[${record.tableName}]吗？`,
        onOk: async () => {
          await genApi.batchDel([record.tableId]);
          await this.fetchData();
        },
      });
    },
    async handlePreview(record: GenTable) {
      if (this.genPreviewRef) {
        this.genPreviewRef.genTable.tableId = record.tableId;
        this.genPreviewRef.init();
        // await genApi.previewCode(record.tableId);
      }
    },
    handleEdit(record: GenTable) {
      if (this.genEditRef) {
        this.genEditRef.genTable.tableId = record.tableId;
        this.genEditRef.init();
      }
    },
    // 生成代码
    // 生成代码
    async handleGenCode(record: GenTable) {
      const res = await genApi.downloadCode(record.tableId);
      download.zip(res.data, `${record.className}.zip`);
    },
  },
});
