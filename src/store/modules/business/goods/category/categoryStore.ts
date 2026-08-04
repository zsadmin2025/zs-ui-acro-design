import { businessDrugGoodsCategoryApi } from '@/api/business/goods/category/category';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  CategoryState,
  Category,
} from '@/types/business/goods/category/categoryTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const useCategoryStore = defineStore('goodsCategory', {
  state: (): CategoryState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      categoryId: '',
      categoryName: '',
      status: undefined,
      remark: '',
      current: 1,
      pageSize: 30,
      order: 'asc',
      orderField: 'createTime',
    },
    selectedKeys: [],
    goodsCategoryList: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await businessDrugGoodsCategoryApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async fetchGoodsCategoryList() {
      const { data } = await businessDrugGoodsCategoryApi.getList({
        status: 1,
      });
      this.goodsCategoryList = data ?? [];
    },

    handleNodeClick(data: any) {
      this.form.categoryId = data.categoryId;
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
        this.addEditRef.form.categoryId = row?.categoryId;
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
          await businessDrugGoodsCategoryApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: Category) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await businessDrugGoodsCategoryApi.delete(record.categoryId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '药品商品分类表';
      const response = await businessDrugGoodsCategoryApi.exportExcel({
        excelName,
      });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
