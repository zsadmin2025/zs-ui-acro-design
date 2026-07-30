import { customerApi } from '@/api/lawyer/customer/customer';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { CustomerState, Customer } from '@/types/lawyer/customer/customerTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import dayjs from 'dayjs';

export const useCustomerStore = defineStore('customer', {
  state: (): CustomerState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    loading: false,
    total: 0,
    form: {
      customerCategory: '',
      customerNature: '',
      customerName: '',
      maintainingPeople: '',
      sharer: '',
      customerGrade: '',
      isConsultant: 1,
      inputPerson: '',
      inputTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      industryCategory: '',
      current: 1,
      pageSize: 30,
      order: 'asc',
      orderField: 'createTime',
    },
    selectedKeys: [],
    customerList: [],
  }),
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await customerApi.page(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async loadlist() {
      const { data } = await customerApi.getList(this.form);
      this.customerList = data ?? [];
    },
    handleNodeClick(data: any) {
      this.form.customerId = data.customerId;
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
        this.addEditRef.form.customerId = row?.customerId;
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
          await customerApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    async handleDelete(record: Customer) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除吗？`,
        onOk: async () => {
          await customerApi.delete(record.customerId);
          await this.fetchData();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '客户管理';
      const response = await customerApi.exportExcel({ excelName });
      const data = response.data as Blob;
      download.excel(data, `${excelName}.xlsx`);
    },
  },
});
