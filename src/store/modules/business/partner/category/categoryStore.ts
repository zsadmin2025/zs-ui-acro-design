import { businessPartnerCategoryApi } from '@/api/business/partner/category/category';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import {
  CategoryState,
  Category,
} from '@/types/business/partner/category/categoryTypes';

export const useCategoryStore = defineStore('partnerCategory', {
  state: (): CategoryState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      businessPartnerCategoryId: '',
      partnerCategoryName: '',
      remark: '',
      current: 1,
      pageSize: 30,
      order: 'asc',
      orderField: 'createTime',
    },
    selectedKeys: [],

    partnerCategoryList: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await businessPartnerCategoryApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },

    async getPartnerCategoryList() {
      const data = await businessPartnerCategoryApi.getList({
        status: 1,
      });
      this.partnerCategoryList = data?.data || [];
    },
    handleNodeClick(data: any) {
      this.form.businessPartnerCategoryId = data.businessPartnerCategoryId;
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
        this.addEditRef.form.businessPartnerCategoryId =
          row?.businessPartnerCategoryId;
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
          await businessPartnerCategoryApi.batchDel(ids);
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
          await businessPartnerCategoryApi.delete(
            record.businessPartnerCategoryId,
          );
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '单位分类';
      const response = await businessPartnerCategoryApi.exportExcel({
        excelName,
      });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
