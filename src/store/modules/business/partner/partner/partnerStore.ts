import { businessPartnerApi } from '@/api/business/partner/partner/partner';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import {
  PartnerState,
  Partner,
} from '@/types/business/partner/partner/partnerTypes';

export const usePartnerStore = defineStore('partner', {
  state: (): PartnerState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      partnerId: '',
      partnerCategoryId: '',
      companyName: '',
      partnerType: '',
      companyAddress: '',
      warehouseAddress: '',
      shortName: '',
      namePinyin: '',
      contactPerson: '',
      companyPhone: '',
      mobile: '',
      fax: '',
      email: '',
      fileNo: '',
      settlementStatus: undefined,
      settlementPeriod: undefined,
      status: undefined,
      socialCreditCode: '',
      validUntil: null,
      bankName: '',
      bankAccount: '',
      companyPrincipal: '',
      principalPhone: '',
      companyManager: '',
      managerPhone: '',
      qualityPrincipal: '',
      qualityPhone: '',
      qualityManager: '',
      qualityManagerPhone: '',
      financePrincipal: '',
      financePhone: '',
      qualityOrgPrincipal: '',
      qualityOrgPhone: '',
      current: 1,
      pageSize: 30,
      order: 'asc',
      orderField: 'createTime',
    },
    selectedKeys: [],
    partnerList: [], // 生产厂商
    supplierList: [], // 供应商
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await businessPartnerApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async getpartnerList() {
      const { data } = await businessPartnerApi.getList({
        partnerType: 1,
      });
      this.partnerList = data || [];
    },
    async getSupplierList() {
      const { data } = await businessPartnerApi.getList({
        partnerType: 2,
      });
      this.supplierList = data || [];
    },

    handleNodeClick(data: any) {
      this.form.businessPartnerId = data.businessPartnerId;
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
        this.addEditRef.form.partnerId = row?.partnerId;
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
          await businessPartnerApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: Partner) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await businessPartnerApi.delete(record.partnerId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '往来合作方信息表(供应商/客户)';
      const response = await businessPartnerApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
