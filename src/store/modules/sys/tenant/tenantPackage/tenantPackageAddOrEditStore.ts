import { defineStore } from 'pinia';
import { TenantPackageAddOrEditState } from '@/types/sys/tenant/tenantPackage/tenantPackageTypes';
import { Message } from '@arco-design/web-vue';
import { sysTenantPackageApi } from '@/api/sys/tenantPackage';

export const useTenantPackageAddOrEditStore = defineStore(
  'sysTenantPackageAddOrEdit',
  {
    state: (): TenantPackageAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          sysTenantPackageId: '',
          packageCode: '',
          packageName: '',
          price: 0.0,
          maxUser: 1,
          maxStorage: 1,
          menuIdList: [],
          status: 1,
        },
      };
    },
    getters: {
      rules() {
        return {
          packageCode: [
            { required: true, message: '请选择套餐编码', trigger: 'blur' },
          ],
          packageName: [
            { required: true, message: '请选择套餐名称', trigger: 'blur' },
          ],
          price: [
            { required: true, message: '请选择套餐价格', trigger: 'blur' },
          ],
          maxUser: [
            {
              required: true,
              message: '请选择最大用户数（-1表示无限制）',
              trigger: 'blur',
            },
          ],
          maxStorage: [
            {
              required: true,
              message: '请选择最大存储空间(GB，-1表示无限制)',
              trigger: 'blur',
            },
          ],
          status: [
            {
              required: true,
              message: '请选择状态（0-下架，1-正常）',
              trigger: 'blur',
            },
          ],
        };
      },
    },
    actions: {
      init() {
        this.dialogFormVisible = true;
        if (this.form.sysTenantPackageId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await sysTenantPackageApi.getById(
          this.form.sysTenantPackageId,
        );
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
          const action = this.form.sysTenantPackageId
            ? sysTenantPackageApi.edit
            : sysTenantPackageApi.save;
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
  },
);
