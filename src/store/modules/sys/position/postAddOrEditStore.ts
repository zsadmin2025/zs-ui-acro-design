import { defineStore } from 'pinia';
import { sysPostApi } from '@/api/sys/post';
import { sysDeptApi } from '@/api/sys/dept';
import { PostAddOrEditState } from '@/types/sys/post/postTypes';

export const useDostAddOrEditStore = defineStore('postAddOrEdit', {
  state: (): PostAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      deptTreeData: [],
      form: {
        sysPostId: '',
        postName: '',
        sysDeptId: '',
        sort: 0,
        status: 1,
        remark: '',
      },
    };
  },
  getters: {
    rules() {
      return {
        sysDeptId: [
          { required: true, message: '请选择所属部门', trigger: 'change' },
        ],
        postName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' },
        ],
        sort: [{ required: true, message: '请选择排序', trigger: 'blur' }],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.sysPostId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await sysPostApi.getById(this.form.sysPostId);
      Object.assign(this.form, data?.data);
    },
    async selectDeptTree() {
      const data = await sysDeptApi.getDeptTree({});
      Object.assign(this.deptTreeData, data?.data);
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
        const action = this.form.sysPostId ? sysPostApi.edit : sysPostApi.save;
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
