import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { caseHearingApi } from '@/api/lawyer/cases/hearing';
import { HearingAddOrEditState } from '@/types/lawyer/cases/hearing/hearing';
import { InfoFiles } from '@/types/lawyer/cases/infoFiles/infoFilesTypes';

export const useHearingAddOrEditStore = defineStore('caseHearingAddOrEdit', {
  state: (): HearingAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        caseHearingId: '',
        caseInfoId: '',
        courtAcceptDate: '',
        hearingProcedure: '',
        courtTime: '',
        courtLawyer: '',
        court: '',
        courtCaseNumber: '',
        judge: '',
        judgePhone: '',
        courtClerk: '',
        courtClerkPhone: '',
        judgmentResult: '',
        serviceByPublicationDate: '',
        judgmentIssuedDate: '',
        judgmentSignDate: '',
        judgmentTakesEffect: '',
        judgmentContent: '',
        followUpSituation: '',
        caseHearingFilesList: [] as InfoFiles[],
      },
    };
  },
  getters: {
    rules() {
      return {
        courtTime: [
          { required: true, message: '请选择开庭时间', trigger: 'change' },
        ],
        courtAcceptDate: [
          { required: true, message: '请选择法院受理日期', trigger: 'change' },
        ],
        hearingProcedure: [
          { required: true, message: '请选择审理程序', trigger: 'change' },
        ],
        court: [
          { required: true, message: '请输入法院/仲裁委员会', trigger: 'blur' },
        ],
        courtLawyer: [
          { required: true, message: '请选择开庭律师', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.caseHearingId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await caseHearingApi.getById(this.form.caseHearingId);
      Object.assign(this.form, data?.data);
    },
    close() {
      this.formRef.resetFields();
      // 根据需要重置整个表单为默认值
      Object.assign(this.form, {
        caseHearingId: '',
        caseInfoId: '',
        courtAcceptDate: '',
        hearingProcedure: '',
        courtTime: '',
        courtLawyer: '',
        court: '',
        courtCaseNumber: '',
        judge: '',
        judgePhone: '',
        courtClerk: '',
        courtClerkPhone: '',
        judgmentResult: '',
        serviceByPublicationDate: '',
        judgmentIssuedDate: '',
        judgmentSignDate: '',
        judgmentTakesEffect: '',
        judgmentContent: '',
        followUpSituation: '',
        caseHearingFilesList: [] as InfoFiles[],
      });
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
        const action = this.form.caseHearingId
          ? caseHearingApi.edit
          : caseHearingApi.save;
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
});
