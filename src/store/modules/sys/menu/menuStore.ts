import { defineStore } from 'pinia';
import { sysMenuApi } from '@/api/sys/menu';
import { MenuState } from '@/types/sys/menu/menuTypes';
import { Modal } from '@arco-design/web-vue';

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    addEditRef: ref(null),
    btnPermissionsRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    refreshTable: false,
    expand: false,
    loading: false,
    form: {
      title: '',
    },
  }),
  getters: {},
  actions: {
    async loadMenuPage() {
      this.loading = true;
      const data = await sysMenuApi.getMenuList(this.form);
      this.list = data?.data ?? [];
      this.loading = false;
    },
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysMenuId = row.sysMenuId;
        this.addEditRef.init();
      }
    },
    handleDelete(row: any) {
      if (row.sysMenuId) {
        Modal.confirm({
          title: '确认删除',
          titleAlign: 'start',
          content: `确定要删除菜单[${row.title}]吗？`,
          onOk: async () => {
            await sysMenuApi.del(row.sysMenuId);
            await this.loadMenuPage();
          },
        });
      }
    },
    handleBtnPermissions(row: any) {
      if (this.btnPermissionsRef) {
        this.btnPermissionsRef.sysMenuId = row.sysMenuId;
        this.btnPermissionsRef.sysMenuTitle = row.title;
        this.btnPermissionsRef.init();
      }
    },
    // 状态切换
    async handleStatusChange(row: any) {
      await sysMenuApi.edit({
        sysMenuId: row.sysMenuId,
        visible: row.visible,
      });
      this.loadMenuPage();
    },
    resetForm() {
      this.loadMenuPage();
    },
    toggleExpand() {
      this.refreshTable = false;
      this.expand = !this.expand;
      nextTick(() => {
        this.refreshTable = true;
      });
    },
  },
});
