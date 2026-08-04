import { defineStore } from 'pinia';
import { businessDrugGoodsCategoryApi } from '@/api/business/goods/category/category';
import { CategoryAddOrEditState } from '@/types/business/goods/category/categoryTypes';
import { Message } from '@arco-design/web-vue';

export const useCategoryAddOrEditStore = defineStore(
  'businessDrugGoodsCategoryAddOrEdit',
  {
    state: (): CategoryAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          categoryId: '',
          categoryName: '',
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
        if (this.form.categoryId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await businessDrugGoodsCategoryApi.getById(
          this.form.categoryId,
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
          const action = this.form.categoryId
            ? businessDrugGoodsCategoryApi.edit
            : businessDrugGoodsCategoryApi.save;
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
