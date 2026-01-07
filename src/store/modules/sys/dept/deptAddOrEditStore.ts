import { defineStore } from 'pinia';
import { sysDeptApi } from '@/api/sys/dept';
import { DeptAddOrEditState } from '@/types/sys/dept/deptTypes';

export const useDeptAddOrEditStore = defineStore('deptAddOrEdit', {
  state: (): DeptAddOrEditState => ({
    dialogFormVisible: false,
    formRef: ref(null),
    deptHeadRef: ref(null),
    treeData: [],
    loading: false,
    form: {
      sysDeptId: '',
      pid: '',
      deptName: '',
      deptHeadId: '',
      deptHeadName: '',
      status: 1,
      remark: '',
      sort: 0,
    },
  }),
  getters: {
    rules() {
      return {
        pid: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
        deptName: [{ required: true, message: '请输入部门名称' }],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      nextTick(async () => {
        await this.getTree();
        if (this.form.sysDeptId) {
          await this.getInfoById();
        }
      });
    },
    async getInfoById() {
      const data = await sysDeptApi.getById(this.form.sysDeptId);
      Object.assign(this.form, data?.data);
    },
    async getTree() {
      const data = await sysDeptApi.getDeptTree({});
      const deptData = data?.data ?? [];
      if (deptData.length === 0) {
        // 添加一个顶级节点
        this.treeData = [
          {
            sysDeptId: '0',
            deptName: '主类目',
            pid: 0,
            children: data?.data ?? [],
          },
        ];
      } else {
        this.treeData = data?.data ?? [];
      }
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
        const action = this.form.sysDeptId ? sysDeptApi.edit : sysDeptApi.save;
        await action(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.loading = false;
        emits('refresh');
      } finally {
        this.loading = false;
      }
    },
  },
});
