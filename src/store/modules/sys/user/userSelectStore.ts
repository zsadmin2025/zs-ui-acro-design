import { defineStore } from 'pinia';
import { userPage, getUserListByIds } from '@/api/sys/user';
import { UserSelectState } from '@/types/sys/user/userSelectTypes';
import { Modal } from '@arco-design/web-vue';

export const userSelectStore = defineStore('userSelectStore', {
  state: (): UserSelectState => {
    return {
      total: 0,
      form: {
        sysDeptId: '',
        username: '',
        realName: '',
        sex: '',
        phone: '',
        current: 1,
        pageSize: 10,
        order: 'asc',
        orderField: 'username',
        sysPostId: '',
        sysRoleId: '',
      },
      tableData: [],
      // 选择用户中已选用户列表
      tableAddUserData: [],
      // 已添加的用户列表
      selectedUser: [],
    };
  },
  actions: {
    async queryData() {
      const { data } = await userPage(this.form);
      const userList = data?.list ?? [];
      const total = data?.total;

      // 过滤掉已选中的用户
      const filteredData = userList.filter(
        (user: any) =>
          !this.tableAddUserData.some(
            (selectedUser) => selectedUser.sysUserId === user.sysUserId,
          ),
      );

      this.tableData = filteredData;
      this.total = total;
    },
    handleSizeChange(val: number) {
      this.form.size = val;
      this.queryData();
    },
    handleCurrentChange(val: number) {
      this.form.page = val;
      this.queryData();
    },
    handleNodeClick(data: any) {
      this.form.sysPostId = '';
      this.form.sysRoleId = '';
      this.form.sysDeptId = data.sysDeptId;
      this.queryData();
    },
    handlePostNodeClick(data: any) {
      this.form.sysDeptId = '';
      this.form.sysRoleId = '';
      this.form.sysPostId = data.sysPostId;
      this.queryData();
    },
    handleRoleNodeClick(data: any) {
      this.form.sysDeptId = '';
      this.form.sysPostId = '';
      this.form.sysRoleId = data.sysRoleId;
      this.queryData();
    },
    resetData() {
      this.$reset();
      this.queryData();
    },
    addSelectedUser(record: any) {
      if (
        this.tableAddUserData.some(
          (item) => item.sysUserId === record.sysUserId,
        )
      ) {
        Modal.warning({
          title: '温馨提示',
          content: '该用户已存在,请勿重复添加！',
        });
        return;
      }
      this.tableAddUserData.push(record);
    },
    addAllSelectedUser() {
      this.tableAddUserData.push(...this.tableData);
    },
    removeSelectedUser(record: any) {
      this.tableAddUserData = this.tableAddUserData.filter(
        (item) => item.sysUserId !== record.sysUserId,
      );
    },
    removeAllSelectedUser() {
      this.tableAddUserData = [];
    },
    async initSelectedData(val: any) {
      const array = val instanceof Array ? val : [val];
      const data = await getUserListByIds(array ?? []);
      this.tableAddUserData = data?.data ?? [];
      this.selectedUser = [...this.tableAddUserData];
    },
    handleRemove(val: any) {
      // 移除
      if (this.selectedUser.length > 0) {
        this.selectedUser = this.selectedUser.filter(
          (item) => item.sysUserId !== val.sysUserId,
        );
      }
      // 同时移除已选择列表
      if (this.tableAddUserData.length > 0) {
        this.tableAddUserData = this.tableAddUserData.filter(
          (item) => item.sysUserId !== val.sysUserId,
        );
      }
    },
  },
});
