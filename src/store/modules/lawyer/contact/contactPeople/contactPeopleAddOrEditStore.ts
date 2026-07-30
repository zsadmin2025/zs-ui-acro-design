import { defineStore } from 'pinia';
import { contactPeopleApi } from '@/api/lawyer/contact/contactPeople';
import { ContactPeopleAddOrEditState } from '@/types/lawyer/contact/contactPeople/contactPeopleTypes';
import { Message } from '@arco-design/web-vue';

export const useContactPeopleAddOrEditStore = defineStore(
  'contactPeopleAddOrEdit',
  {
    state: (): ContactPeopleAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          contactPeopleId: '',
          name: '',
          phone: '',
          sex: '',
          contactCategoryId: '',
          remark: '',
          placeWork: '',
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
        if (this.form.contactPeopleId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await contactPeopleApi.getById(this.form.contactPeopleId);
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
          const action = this.form.contactPeopleId
            ? contactPeopleApi.edit
            : contactPeopleApi.save;
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
