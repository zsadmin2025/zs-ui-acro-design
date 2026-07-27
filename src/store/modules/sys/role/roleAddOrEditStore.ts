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
      loading: false,
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
    resetForm() {
      this.form = {
        sysRoleId: '',
        roleName: '',
        roleCode: '',
        sort: 999,
        status: 1,
        remark: '',
        menuList: [],
        dataScope: 1,
        deptList: [],
      };
    },
    async init() {
      this.dialogFormVisible = true;
      // 新增时先重置表单数据
      if (!this.form.sysRoleId) {
        this.resetForm();
      }
      await Promise.all([
        this.getMenuTree(),
        this.form.sysRoleId ? this.getInfoById() : Promise.resolve(),
      ]);
    },
    async initDataScope() {
      this.dataScopeVisible = true;
      if (!this.form.sysRoleId) {
        this.resetForm();
      }
      await Promise.all([
        this.getDeptList(),
        this.form.sysRoleId ? this.getInfoById() : Promise.resolve(),
      ]);
    },
    async initMenuPermission() {
      this.menuPermission = true;
      if (!this.form.sysRoleId) {
        this.resetForm();
      }
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
      this.loading = false;
    },
    async submit(emits: (event: 'refresh') => void) {
      if (!this.formRef || this.loading) return;

      if (await this.formRef.validate()) {
        return;
      }
      this.loading = true;
      try {
        const action = this.form.sysRoleId ? sysRoleApi.edit : sysRoleApi.save;
        await action(this.form);
        this.close();
        this.dialogFormVisible = false;
        emits('refresh');
      } finally {
        this.loading = false;
      }
    },
    closeDataScope() {
      this.dataScopeVisible = false;
      this.loading = false;
    },
    async submitDataScope() {
      if (!this.dataScopeFormRef || this.loading) return;
      if (await this.dataScopeFormRef.validate()) {
        return;
      }
      this.loading = true;
      try {
        await sysRoleApi.edit(this.form);
        this.dataScopeVisible = false;
      } finally {
        this.loading = false;
      }
    },

    closeMenuPermission() {
      if (this.formRef) {
        this.formRef.resetFields();
      }
      this.menuPermission = false;
      this.loading = false;
    },
    async submitMenuPermission() {
      if (!this.dataScopeFormRef || this.loading) return;
      if (await this.dataScopeFormRef.validate()) {
        return;
      }
      this.loading = true;
      try {
        await sysRoleApi.edit(this.form);
        this.menuPermission = false;
      } finally {
        this.loading = false;
      }
    },
  },
});
