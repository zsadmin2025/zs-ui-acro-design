import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  TenantPackageState,
  TenantPackage,
} from '@/types/sys/tenant/tenantPackage/tenantPackageTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import { sysTenantPackageApi } from '@/api/sys/tenantPackage';

export const useTenantPackageStore = defineStore('tenantPackage', {
  state: (): TenantPackageState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      sysTenantPackageId: '',
      packageCode: '',
      packageName: '',
      maxUser: 1,
      maxStorage: 1,
      features: '',
      status: '',
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
      const { data } = await sysTenantPackageApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    handleNodeClick(data: any) {
      this.form.sysTenantPackageId = data.sysTenantPackageId;
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
        this.addEditRef.form.sysTenantPackageId = row?.sysTenantPackageId;
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
          await sysTenantPackageApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: TenantPackage) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await sysTenantPackageApi.delete(record.sysTenantPackageId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '租户套餐';
      const response = await sysTenantPackageApi.exportExcel({ excelName });
      download.excel(response.data, `${excelName}.xlsx`);
    },
  },
});
