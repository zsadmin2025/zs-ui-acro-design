import { defineStore } from 'pinia';
import { caseInfoListApi } from '@/api/lawyer/cases/infoList';
import { InfoListAddOrEditState } from '@/types/lawyer/cases/infoList/infoListTypes';

export const useInfoListAddOrEditStore = defineStore('caseInfoListAddOrEdit', {
  state: (): InfoListAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        caseInfoListId: '',
        caseInfoId: '',
        caseListId: '',
        caseListFileName: '',
        caseListFileUrl: '',
        fileName: '',
        fileUrl: '',
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
      if (this.form.caseInfoListId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await caseInfoListApi.getById(this.form.caseInfoListId);
      Object.assign(this.form, data?.data);
    },
    close() {
      this.formRef.resetFields();
      this.dialogFormVisible = false;
    },
    async submit(emits: (event: 'refreshDetails') => void) {
      await caseInfoListApi.save(this.form);
      emits('refreshDetails');
    },
  },
});
