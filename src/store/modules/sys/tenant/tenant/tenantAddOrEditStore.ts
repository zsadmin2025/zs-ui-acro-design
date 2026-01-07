import { defineStore } from 'pinia';
import { sysTenantUserApi } from '@/api/sys/tenant';
import { TenantAddOrEditState } from '@/types/sys/tenant/tenant/tenantTypes';

export const useTenantAddOrEditStore = defineStore('sysTenantUserAddOrEdit', {
  state: (): TenantAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        sysTenantId: '',
        tenantName: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        status: 1,
        expireTime: '',
        remark: '',
        username: '',
        password: '',
        sysTenantPackageId: '',
      },
    };
  },
  getters: {
    rules() {
      return {
        tenantName: [
          {
            required: true,
            message: '请输入租户名称',
            trigger: 'blur',
          },
        ],
        contactPerson: [
          {
            required: true,
            message: '请输入联系人',
            trigger: 'blur',
          },
        ],
        contactPhone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur',
          },
        ],
        contactEmail: [
          {
            required: true,
            message: '请输入联系邮箱',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: ['blur', 'change'],
          },
        ],
        expireTime: [
          {
            required: true,
            message: '请选择过期时间',
            trigger: 'blur',
          },
        ],
        sysTenantPackageId: [
          {
            required: true,
            message: '请选择租户套餐',
            trigger: 'blur',
          },
        ],

        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.sysTenantId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await sysTenantUserApi.getById(this.form.sysTenantId);
      Object.assign(this.form, data?.data);
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

        const action = this.form.sysTenantId
          ? sysTenantUserApi.edit
          : sysTenantUserApi.save;

        // 如果是编辑，则删除username和password字段
        if (this.form.sysTenantId) {
          delete this.form.username;
          delete this.form.password;
        }
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
