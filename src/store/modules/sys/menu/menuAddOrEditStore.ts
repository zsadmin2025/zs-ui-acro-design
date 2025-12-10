import { defineStore } from 'pinia';
import { sysMenuApi } from '@/api/sys/menu';
import { MenuAddOrEditState } from '@/types/sys/menu/menuTypes';

export const useMenuAddOrEditStore = defineStore('menuAddOrEdit', {
  state: (): MenuAddOrEditState => {
    return {
      dialogFormVisible: false,
      formRef: null,
      popoverRef: null,
      form: {
        sysMenuId: '',
        type: 1,
        pid: '',
        name: '',
        path: '',
        title: '',
        link: '',
        component: '',
        icon: '',
        permissions: '',
        sort: 0,
        visible: 1,
        status: 1,
        hideInMenu: 0,
        hideChildrenInMenu: 0,
        noAffix: false,
        ignoreCache: true,
      },
      list: [],
      loading: false,
    };
  },
  getters: {
    rules() {
      return {
        pid: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
        name: [{ required: true, message: '请输入路由名', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
        title: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
        component: [
          { required: true, message: '请输入vue组件路劲', trigger: 'blur' },
        ],
        icon: [{ required: true, message: '请选着图标', trigger: 'blur' }],
        permissions: [
          { required: true, message: '请输入权限字符', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    async init() {
      this.dialogFormVisible = true;
      await Promise.all([
        this.getTree(),
        this.form.sysMenuId ? this.getInfoById() : Promise.resolve(),
      ]);
    },
    async getTree() {
      const data = await sysMenuApi.getMenuList({});
      this.list = data?.data ?? [];
      this.list = [
        {
          title: '主菜单',
          sysMenuId: '0',
          children: data?.data ?? [],
          requiresAuth: false,
          icon: '',
          hideInMenu: false,
          hideChildrenInMenu: false,
          sort: 0,
          noAffix: false,
          ignoreCache: true,
        },
      ];
    },
    async getInfoById() {
      const data = await sysMenuApi.getById(this.form.sysMenuId ?? '');
      Object.assign(this.form, data?.data);
    },

    click(val: string) {
      this.form.icon = val;
      this.popoverRef.hide();
    },
    close() {
      this.formRef.resetFields();
      this.dialogFormVisible = false;
    },

    async submit(emits: (event: 'refresh') => void) {
      this.loading = true;
      if (!this.formRef) return;

      if (await this.formRef.validate()) {
        return;
      }
      // 统一处理 path 和 name 的逻辑
      this.handlePathAndName();

      const action = this.form.sysMenuId ? sysMenuApi.edit : sysMenuApi.save;
      await action(this.form);
      this.close();
      this.dialogFormVisible = false;
      this.loading = false;
      emits('refresh');
    },

    // 抽离的公共方法
    handlePathAndName() {
      const { type, path } = this.form;

      // 默认为空字符串
      this.form.path = path ?? '';

      let name = '';
      if (!this.form.path.startsWith('/')) {
        name = this.form.path;
        // this.form.path = `/${this.form.path}`;
      } else {
        name = this.form.path.slice(1);
      }

      this.form.name = name;

      if (type === 1) {
        this.form.component = 'Layout';
      }
    },
  },
});
