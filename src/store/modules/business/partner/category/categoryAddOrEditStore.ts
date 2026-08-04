import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { businessPartnerCategoryApi } from '@/api/business/partner/category/category';
import { CategoryAddOrEditState } from '@/types/business/partner/category/categoryTypes';

export const useCategoryAddOrEditStore = defineStore(
  'businessPartnerCategoryAddOrEdit',
  {
    state: (): CategoryAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          businessPartnerCategoryId: '',
          partnerCategoryName: '',
          status: 1,
          remark: '',
        },
      };
    },
    getters: {
      rules() {
        return {
          categoryName: [
            { required: true, message: '请选择类别名称', trigger: 'blur' },
          ],
          status: [
            {
              required: true,
              message: '请选择状态 1-正常 0 -停用',
              trigger: 'blur',
            },
          ],
        };
      },
    },
    actions: {
      init() {
        this.dialogFormVisible = true;
        if (this.form.businessPartnerCategoryId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await businessPartnerCategoryApi.getById(
          this.form.businessPartnerCategoryId,
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
          const action = this.form.businessPartnerCategoryId
            ? businessPartnerCategoryApi.edit
            : businessPartnerCategoryApi.save;
          await action(this.form);
          this.close();
          this.dialogFormVisible = false;
          this.loading = false;
          emits('refresh');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '未知错误';
          Message.error(errorMessage);
        } finally {
          this.loading = false;
        }
      },
    },
  },
);
