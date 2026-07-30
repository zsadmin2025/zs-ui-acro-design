import { defineStore } from 'pinia';
import { caseInfoFilesApi } from '@/api/lawyer/cases/infoFiles';
import { InfoFilesAddOrEditState } from '@/types/lawyer/cases/infoFiles/infoFilesTypes';

export const useInfoFilesAddOrEditStore = defineStore(
  'caseInfoFilesAddOrEdit',
  {
    state: (): InfoFilesAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          caseInfoFilesId: '',
          caseInfoId: '',
          caseOtherId: '',
          fileSource: '',
          fileName: '',
          fileType: '',
          fileSize: '',
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
        if (this.form.caseInfoFilesId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await caseInfoFilesApi.getById(this.form.caseInfoFilesId);
        Object.assign(this.form, data?.data);
      },
      close() {
        this.formRef.resetFields();
        this.dialogFormVisible = false;
      },
      async submit(emits: (event: 'refreshDetails') => void) {
        await caseInfoFilesApi.save(this.form);
        emits('refreshDetails');
      },
    },
  },
);
