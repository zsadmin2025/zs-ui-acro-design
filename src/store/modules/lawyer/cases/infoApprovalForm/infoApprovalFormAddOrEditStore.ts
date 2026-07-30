import { defineStore } from 'pinia';
import { caseInfoApprovalFormApi } from '@/api/lawyer/cases/infoApprovalForm';
import { InfoApprovalFormAddOrEditState } from '@/types/lawyer/cases/infoApprovalForm/infoApprovalFormTypes';
import { Message, Modal } from '@arco-design/web-vue';

export const useInfoApprovalFormAddOrEditStore = defineStore(
  'caseInfoApprovalFormAddOrEdit',
  {
    state: (): InfoApprovalFormAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          caseInfoApprovalFormId: '',
          caseInfoId: '',
          caseNo: '',
          caseType: '',
          customerName: '',
          litigationStatus: '',
          causeAction: '',
          otherSide: '',
          otherLitigationStatus: '',
          thirdParty: '',
          conflictInterest: 1,
          indicateLawyer: '',
          indicateLawyerName: '',
          appointLawyer: '',
          appointLawyerName: '',
          acceptingCourt: '',
          entrustRequire: '',
          entrustedMattersAbstract: '',
          undertakeLawyerOpinion: '',
          approvalOpinion: '',
          applicant: '',
          applicantName: '',
          approvalStatus: 1,
          subjectAmount: 0,
          feeAmount: 0,
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
        if (this.form.caseInfoApprovalFormId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await caseInfoApprovalFormApi.getById(
          this.form.caseInfoApprovalFormId,
        );
        Object.assign(this.form, data?.data);
      },
      reset() {
        console.log('2222');
        this.$reset();
      },
      close() {
        this.formRef.resetFields();
        this.dialogFormVisible = false;
      },
      handleCancel() {
        this.dialogFormVisible = false;
      },
      // 审批
      async handleApprove(emits: (event: 'refresh') => void) {
        // 防止重复提交
        if (this.loading) return;
        try {
          this.loading = true;
          const dataFom = {
            caseInfoApprovalFormId: this.form.caseInfoApprovalFormId,
            approvalOpinion: this.form.approvalOpinion,
          };
          await caseInfoApprovalFormApi.passApprove(dataFom);
          this.dialogFormVisible = false;
          this.loading = false;
          Message.success('保存成功');

          emits('refresh');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '未知错误';
          Message.error(errorMessage);
        } finally {
          this.loading = false;
        }
      },
      // 提交表单
      async submit(emits: (event: 'refresh-details') => void) {
        // 防止重复提交
        if (this.loading) return;

        try {
          this.loading = true;
          const action = this.form.caseInfoApprovalFormId
            ? caseInfoApprovalFormApi.edit
            : caseInfoApprovalFormApi.save;
          await action(this.form);
          // this.close();
          // this.dialogFormVisible = false;
          this.loading = false;
          Message.success('保存成功');

          emits('refresh-details');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '未知错误';
          Message.error(errorMessage);
        } finally {
          this.loading = false;
        }
      },
      //
      async submitApprovalForm(emits: (event: 'refresh-details') => void) {
        Modal.confirm({
          title: '温馨提示',
          titleAlign: 'start',
          content: '是否继续进行提交签批操作?',
          onOk: async () => {
            await caseInfoApprovalFormApi.submitApprovalForm(this.form);
            Message.success('提交成功');
            emits('refresh-details');
          },
        });
      },
    },
  },
);
