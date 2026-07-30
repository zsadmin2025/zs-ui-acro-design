import { defineStore } from 'pinia';
import { contactCategoryApi } from '@/api/lawyer/contact/contactCategory';
import { ContactCategoryAddOrEditState } from '@/types/lawyer/contact/contactCategory/contactCategoryTypes';
import { Message } from '@arco-design/web-vue';

export const useContactCategoryAddOrEditStore = defineStore(
  'contactCategoryAddOrEdit',
  {
    state: (): ContactCategoryAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          contactCategoryId: '',
          pid: '',
          pids: '',
          categoryName: '',
          isPublic: '',
          remark: '',
          creator: '',
          createTime: new Date(),
          updater: '',
          updateTime: new Date(),
          creatorDept: '',
          tenantId: '',
        },
      };
    },
    getters: {
      rules() {
        return {};
      },
    },
    actions: {
      init() {
        this.dialogFormVisible = true;
        if (this.form.contactCategoryId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await contactCategoryApi.getById(
          this.form.contactCategoryId,
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
          const action = this.form.contactCategoryId
            ? contactCategoryApi.edit
            : contactCategoryApi.save;
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
