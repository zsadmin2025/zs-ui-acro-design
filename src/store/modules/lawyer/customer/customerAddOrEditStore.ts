import { defineStore } from 'pinia';
import { sysUserApi } from '@/api/sys/user';
import { Message } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import { customerApi } from '@/api/lawyer/customer/customer';
import { CustomerAddOrEditState } from '@/types/lawyer/customer/customerTypes';

export const useCustomerAddOrEditStore = defineStore('customerAddOrEdit', {
  state: (): CustomerAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      userList: [],
      form: {
        customerId: '',
        customerCategory: '',
        customerNature: '',
        customerName: '',
        customerAbbreviation: '',
        maintainingPeople: [],
        maintainingPeopleName: '',
        sharer: [],
        sharerName: '',
        legalPerson: '',
        credit: '',
        customerSource: '',
        customerGrade: '',
        contactNumber: '',
        wechatNumber: '',
        email: '',
        isConsultant: undefined,
        bankDeposit: '',
        bankAccount: '',
        customerAddress: '',
        inputPerson: undefined,
        inputPersonName: '',
        inputTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        industryCategory: '',
        industryCategoryName: '',
        establishedTime: dayjs().format('YYYY-MM-DD'),
        postalCode: '',
        faxNumber: '',
        registeredCapital: '',
        shareholding: '',
        companyManagement: '',
        businessScope: '',
      },
    };
  },
  getters: {
    rules() {
      return {
        customerCategory: [
          { required: true, message: '请选择客户类别', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
        maintainingPeople: [
          { required: true, message: '请选择维系人', trigger: 'blur' },
        ],
        contactNumber: [
          { required: true, message: '请选择联系电话', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      this.loadUserList();
      if (this.form.customerId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async loadUserList() {
      const { data } = await sysUserApi.getUserList({});
      this.userList = data;
    },
    async getInfoById() {
      const data = await customerApi.getById(this.form.customerId);
      Object.assign(this.form, data?.data);
    },
    handleInputPersonChange(value: any) {
      const selectedUser = this.userList.find(
        (user) => user?.sysUserId === value,
      );
      if (selectedUser) {
        this.form.inputPersonName = selectedUser?.realName ?? '';
      }
    },
    handleSharerChange(value: any) {
      const selectedUser = this.userList.find(
        (user) => user?.sysUserId === value,
      );
      if (selectedUser) {
        this.form.sharerName = selectedUser?.realName ?? '';
      }
    },
    handleMaintainingPeopleChange(value: any) {
      // value  是一个数组
      const selectedUser = this.userList.filter((user) =>
        value.includes(user?.sysUserId),
      );
      this.form.maintainingPeopleName = selectedUser
        .map((user) => user?.realName)
        .join(',');
    },
    close() {
      this.formRef.resetFields();
      this.dialogFormVisible = false;
    },
    async submit(emits: (event: 'refresh') => void) {
      // 防止重复提交
      if (this.loading) return;

      try {
        if (!this.formRef) return;

        if (await this.formRef.validate()) {
          return;
        }
        this.loading = true;
        const action = this.form.customerId
          ? customerApi.edit
          : customerApi.save;
        await action(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.loading = false;
        emits('refresh');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '未知错误';
        Message.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
  },
});
