import { defineStore } from 'pinia';
import { sysMenuApi } from '@/api/sys/menu';
import { MenuBtnPermissionState } from '@/types/sys/menu/menuBtnPermissionTypes';
import { Modal } from '@arco-design/web-vue';

export const useMenuBtnPermissionStore = defineStore('menuBtnPermission', {
  state: (): MenuBtnPermissionState => {
    return {
      menuBtnPermissionAddRef: ref(null),
      sysMenuId: '',
      sysMenuTitle: '',
      menuBtnVisible: false,
      menuBtnPermissions: [],
    };
  },
  actions: {
    // 初始化菜单权限
    init() {
      this.menuBtnVisible = true;
      this.queryBtnPermissions();
    },
    // 获取按钮权限
    async queryBtnPermissions() {
      const data = await sysMenuApi.getBtnPermissions(this.sysMenuId);
      this.menuBtnPermissions = data?.data;
    },
    // 新增按钮权限
    handleAddOrEdit(row: any) {
      if (this.menuBtnPermissionAddRef) {
        this.menuBtnPermissionAddRef.form.sysMenuId = row?.sysMenuId;
        this.menuBtnPermissionAddRef.form.pid = this.sysMenuId;
        this.menuBtnPermissionAddRef.init();
      }
    },
    handleDelete(row: any) {
      if (row.sysMenuId) {
        Modal.confirm({
          title: '确认删除',
          titleAlign: 'start',
          content: `确定要删除[${row.title}]吗？`,
          onOk: async () => {
            await sysMenuApi.del(row.sysMenuId);
            await this.queryBtnPermissions();
          },
        });
      }
    },
    handleCancel() {
      this.menuBtnVisible = false;
    },
    handleOk() {
      this.menuBtnVisible = false;
    },
  },
});
