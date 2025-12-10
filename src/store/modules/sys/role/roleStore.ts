import { sysRoleApi } from '@/api/sys/role';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';
import { RoleState, Role } from '@/types/sys/role/roleTypes';

export const useRoleStore = defineStore('role', {
  state: (): RoleState => ({
    addEditRef: ref(null),
    dataScopeRef: ref(null),
    menuPermissionRef: ref(null),
    list: [],
    total: 0,
    loading: false,
    selectedKeys: [],
    form: {
      sysRoleId: '',
      roleName: '',
      current: 1,
      pageSize: 20,
      order: 'asc',
      orderField: 'roleName',
    },
    roleData: [],
  }),
  actions: {
    async loadRolePage() {
      this.loading = true;
      const { data } = await sysRoleApi.rolePage(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async loadRoleList() {
      const data = await sysRoleApi.getList();
      this.roleData = data?.data ?? [];
    },
    handleCurrentChange(current: number) {
      this.form.current = current;
      this.loadRolePage();
    },
    handleSizeChange(pageSize: number) {
      this.form.pageSize = pageSize;
      this.loadRolePage();
    },
    resetSearch() {
      this.form = {
        sysRoleId: '',
        roleName: '',
        current: 1,
        pageSize: 20,
        order: 'asc',
        orderField: 'roleName',
      };
      this.loadRolePage();
    },
    setSelectedKeys(keys: number[]) {
      this.selectedKeys = keys;
    },
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysRoleId = row?.sysRoleId;
        this.addEditRef.init();
      }
    },
    handleDataScope(row: any) {
      if (this.dataScopeRef) {
        this.dataScopeRef.form.sysRoleId = row?.sysRoleId;
        this.dataScopeRef.initDataScope();
      }
    },
    handleMenuPermission(row: any) {
      if (this.menuPermissionRef) {
        this.menuPermissionRef.form.sysRoleId = row?.sysRoleId;
        this.menuPermissionRef.initMenuPermission();
      }
    },
    async handleDeleteSelected() {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行批量删除操作,是否继续?',
        onOk: async () => {
          const ids = this.selectedKeys.map((item: any) => item);
          await sysRoleApi.batchDel(ids);
          await this.loadRolePage();
        },
      });
    },
    async handleDelete(record: Role) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除角色[${record.roleName}]吗？`,
        onOk: async () => {
          await sysRoleApi.deleteRoleApi(record.sysRoleId);
          await this.loadRolePage();
        },
      });
    },
    // 导出
    async handleExport() {
      const excelName = '角色信息';
      const response = await sysRoleApi.exportExcel({ excelName });
      download.excel(response.data, `${excelName}.xlsx`);
    },
  },
});
