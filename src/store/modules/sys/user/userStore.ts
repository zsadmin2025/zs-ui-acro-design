import { defineStore } from 'pinia';
import { UserState } from '@/types/sys/user/userTypes';
import { sysUserApi } from '@/api/sys/user';
import { sysDeptApi } from '@/api/sys/dept';
import download from '@/utils/fileDownload';
import { sm4Encrypt } from '@/utils/cryptoUtils';
import { Modal } from '@arco-design/web-vue';

export const useUserStore = defineStore('sysuser', {
  state: (): UserState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    expandedKeys: [],
    list: [],
    total: 0,
    deptTreeData: [],
    loading: false,
    form: {
      sysDeptId: '',
      username: '',
      realName: '',
      sex: '',
      phone: '',
      current: 1,
      pageSize: 30,
      status: null,
      order: 'asc',
      orderField: 'username',
    },
    resetPasswordVisible: false,
    passwordFormRef: ref(null),
    passwordForm: {
      sysUserId: '',
      password: '',
      confirmPassword: '',
    },
    selectedKeys: [],
    userList: [],
  }),
  getters: {
    passwordRules() {
      return {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern:
              '/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@#!%^*?&+-])[A-Za-zd$@#!%^*?&+-]{8,}/',
            message: '密码应当至少8位且含有数字、大小写字母及特殊字符',
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            validator: (value: any, callback: any) => {
              if (value && value !== this.passwordForm.password) {
                callback('两次输入密码不一致!');
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
          {
            pattern:
              '/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@#!%^*?&+-])[A-Za-zd$@#!%^*?&+-]{8,}/',
            message: '密码应当至少8位且含有数字、大小写字母及特殊字符',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  actions: {
    async fetchData() {
      this.loading = true;
      const { data } = await sysUserApi.userPage(this.form);
      // const decryptData = sm4Decrypt(data?.encrypt);
      // this.list = decryptData?.list ?? [];
      // this.total = decryptData.total ?? 0;
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async loadUserList() {
      const { data } = await sysUserApi.getUserList({});
      this.userList = data;
    },
    reset() {
      this.form = {
        sysDeptId: '',
        username: '',
        realName: '',
        sex: '',
        phone: '',
        current: 1,
        pageSize: 30,
        status: null,
        order: 'asc',
        orderField: 'username',
      };
      this.fetchData();
    },
    handleCurrentChange(current: number) {
      this.form.current = current;
      this.fetchData();
    },
    handleSizeChange(pageSize: number) {
      this.form.pageSize = pageSize;
      this.fetchData();
    },

    // 删除
    handleDelete(row: any) {
      if (row.sysUserId) {
        Modal.confirm({
          title: '确认删除',
          titleAlign: 'start',
          content: `确定要删除用户[${row.username}]吗？`,
          onOk: async () => {
            await sysUserApi.deleteUserApi(row.sysUserId);
            await this.fetchData();
          },
        });
      }
    },
    // 选中事件
    setSelectedKeys(keys: number[]) {
      this.selectedKeys = keys;
    },
    // 批量删除
    handleDeleteSelected() {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行批量删除操作,是否继续?',
        onOk: async () => {
          const ids = this.selectedKeys.map((item: any) => item.sysUserId);
          await sysUserApi.batchDel(ids);
          await this.fetchData();
        },
      });
    },
    handleAddOrEdit(type: string, row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysUserId = row?.sysUserId;
        this.addEditRef.init();
        this.addEditRef.changeTitle(type);
      }
    },
    // 重置表单
    resetForm() {
      this.form = {
        sysDeptId: '',
        username: '',
        realName: '',
        sex: '',
        phone: '',
        current: 1,
        pageSize: 30,
        order: 'asc',
        orderField: 'username',
      };
      this.fetchData();
    },
    // 获取部门树
    async getDeptList() {
      const data = await sysDeptApi.getDeptTree({});
      const treeData = data?.data ?? [];
      treeData.forEach((element: any) => {
        this.expandedKeys.push(element.sysDeptId);
      });
      Object.assign(this.deptTreeData, treeData);
    },
    // 树节点点击
    handleNodeClick(data: any) {
      this.form.sysDeptId = data.sysDeptId;
      this.fetchData();
    },
    // 重置密码
    handleResetPassword(row: any) {
      this.resetPasswordVisible = true;
      this.passwordForm.sysUserId = row.sysUserId;
    },
    // 确认重置密码
    async resetPassword() {
      if (!this.passwordFormRef) return;

      if (await this.passwordFormRef.validate()) {
        return;
      }

      await sysUserApi.resetPassword(this.passwordForm);
      this.resetPasswordVisible = false;
      this.passwordFormRef.resetFields();
    },
    // 取消
    resetPasswordCancel() {
      this.resetPasswordVisible = false;
      this.passwordFormRef.resetFields();
    },
    // 导出
    async handleExport() {
      const excelName = '用户信息';
      const response = await sysUserApi.exportExcel({ excelName });
      download.excel(response.data, `${excelName}.xlsx`);
    },
    // 排序
    handleSortChange(data: { column: any; prop: string; order: any }) {
      if (data.order === 'ascending') {
        this.form.order = 'asc';
        this.form.orderField = data.prop;
      } else if (data.order === 'descending') {
        this.form.order = 'desc';
        this.form.orderField = data.prop;
      } else {
        this.form.order = 'asc';
        this.form.orderField = 'username';
      }
      this.fetchData();
    },
    // 状态切换
    async handleStatusChange(row: any) {
      await sysUserApi.edit(
        sm4Encrypt(
          JSON.stringify({
            sysUserId: row.sysUserId,
            status: row.status,
          }),
        ),
      );
      this.fetchData();
    },
  },
});
