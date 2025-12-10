/* eslint-disable no-console */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { sysRoleApi } from '@/api/sys/role';
import { sysMenuApi } from '@/api/sys/menu';
import { sysDeptApi } from '@/api/sys/dept';
import { RoleAddOrEditState } from '@/types/sys/role/roleTypes';

export const useRoleAddOrEditStore = defineStore('roleAddOrEdit', {
  state: (): RoleAddOrEditState => {
    return {
      dialogFormVisible: false,
      dataScopeVisible: false,
      menuPermission: false,
      treeRef: ref(null),
      deptRef: ref(null),
      formRef: ref(),
      menuPermissionRef: ref(null),
      dataScopeFormRef: ref(null),
      menuData: [],
      deptTree: [],
      form: {
        sysRoleId: '',
        roleName: '',
        roleCode: '',
        sort: 999,
        status: 1,
        remark: '',
        menuList: [],
        dataScope: 1,
        deptList: [],
      },
    };
  },
  getters: {
    rules() {
      return {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleCode: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
        ],
        sort: [{ required: true, message: '请选择排序', trigger: 'blur' }],
      };
    },
  },
  actions: {
    async init() {
      this.dialogFormVisible = true;
      await Promise.all([
        this.getMenuTree(),
        this.form.sysRoleId ? this.getInfoById() : Promise.resolve(),
      ]);
    },
    async initDataScope() {
      this.dataScopeVisible = true;
      await Promise.all([
        this.getDeptList(),
        this.form.sysRoleId ? this.getInfoById() : Promise.resolve(),
      ]);
    },
    async initMenuPermission() {
      this.menuPermission = true;
      await Promise.all([
        this.getMenuTree(),
        this.getDeptList(),
        this.form.sysRoleId ? this.getInfoById() : Promise.resolve(),
      ]);
    },
    async getInfoById() {
      const data = await sysRoleApi.getById(this.form.sysRoleId);
      Object.assign(this.form, data.data);
      if (this.treeRef) {
        this.treeRef.selectNode(this.form.menuList ?? [], false);
      }
    },
    async getMenuTree() {
      const data = await sysMenuApi.listPermission();
      this.menuData = this.convertList(data?.data ?? []);
    },
    convertList(treeData: any) {
      return treeData.map((item: any) => ({
        key: item.sysMenuId,
        title: item.title,
        type: item.type,
        sort: item.sort,
        pid: item.pid,
        children: item.children ? this.convertList(item.children) : null,
      }));
    },
    async getDeptList() {
      const data = await sysDeptApi.getDeptTree({});
      this.deptTree = data?.data ?? [];
    },
    handleCheck() {
      if (this.treeRef) {
        this.form.menuList = this.treeRef.getCheckedKeys(false);
      }
    },
    close() {
      if (this.formRef) {
        this.formRef.resetFields();
      }
      this.dialogFormVisible = false;
    },
    async submit(emits: (event: 'refresh') => void) {
      if (!this.formRef) return;

      if (await this.formRef.validate()) {
        return;
      }
      const action = this.form.sysRoleId ? sysRoleApi.edit : sysRoleApi.save;
      await action(this.form);
      this.close();
      this.dialogFormVisible = false;
      emits('refresh');
    },
    closeDataScope() {
      this.dataScopeVisible = false;
    },
    async submitDataScope(dataScopeFormRef: any) {
      if (!dataScopeFormRef) return;
      if (await this.dataScopeFormRef.validate()) {
        return;
      }
      await sysRoleApi.edit(this.form);
      this.dataScopeVisible = false;
    },

    closeMenuPermission() {
      if (this.formRef) {
        this.formRef.resetFields();
      }
      this.menuPermission = false;
    },
    async submitMenuPermission() {
      if (!this.dataScopeFormRef) return;
      if (await this.dataScopeFormRef.validate()) {
        return;
      }
      console.log('dataScopeFormRef', this.dataScopeFormRef);
      console.log('Submitting menu permissions...', this.form);
    },
  },
});
