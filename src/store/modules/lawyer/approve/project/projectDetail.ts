import { defineStore } from 'pinia';
import { caseInfoApi } from '@/api/lawyer/cases/info';
import { projectDetailState } from '@/types/lawyer/approve/project/projectTypes';
import { Message, Modal } from '@arco-design/web-vue';

export const useProjectDetailStore = defineStore('projectDetail', {
  state: (): projectDetailState => {
    return {
      loading: false,
      formRef: null,
      form: {
        caseCustomer: {
          caseCustomerId: '',
          caseInfoId: '',
          customerId: '',
          customerName: '',
          customerCode: '',
          customerType: '',
        },
        caseInfo: {
          caseInfoId: '',
          caseName: '',
          caseNo: '',
          caseType: '',
          proxyStage: [],
          nowStage: '',
          litigationStatus: '',
          applyDate: '',
          applicant: '',
          applicantName: '',
          caseIntroduction: '',
          entrustmentMatters: '',
          subjectAmount: 0,
          projectType: '',
          ourSide: [
            {
              caseRelatedPartiesId: '',
              caseInfoId: '',
              role: 'our_side',
              relationType: '',
              relatedName: '',
            },
          ],
          otherSide: [
            {
              caseRelatedPartiesId: '',
              caseInfoId: '',
              role: 'other_side',
              relationType: '',
              relatedName: '',
            },
          ],
          caseStatus: 1,
          isApprove: 0,
          approveStatus: 1,
        },
        caseHearingList: [],
        caseTeam: {
          caseTeamId: '',
          caseInfoId: '',
          undertakeLawyer: '',
          coordinatingLawyer: [],
          leadLawyer: [],
          coOrganizer: [],
          assistant: [],
          secretary: [],
        },
      },
    };
  },
  getters: {},
  actions: {
    init() {
      if (this.form.caseInfo.caseInfoId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await caseInfoApi.getById(this.form.caseInfo.caseInfoId);
      Object.assign(this.form, data?.data);
    },
    reset() {
      this.$reset();
    },
    // 通过
    async approve() {
      console.log('通过', this.form);
      // 防止重复提交
      if (this.loading) return;
      try {
        const dataForm = {
          caseInfoId: this.form.caseInfo.caseInfoId,
          approvalOpinion: this.form.caseInfo.approvalOpinion, // 审批意见
        };
        // 提交审批
        Modal.confirm({
          title: '温馨提示',
          titleAlign: 'start',
          content: '是否确认审批通过或否决吗?',
          onOk: async () => {
            await caseInfoApi.approvePass(dataForm);
            this.init(); // 刷新数据
          },
        });
        this.loading = true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '未知错误';
        Message.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    // 否决
    async reject() {
      if (this.loading) return;
      try {
        const dataForm = {
          caseInfoId: this.form.caseInfo.caseInfoId,
          approvalOpinion: this.form.caseInfo.approvalOpinion, // 审批意见
        };
        // 提交审批
        Modal.confirm({
          title: '温馨提示',
          titleAlign: 'start',
          content: '是否确认审批通过或否决吗?',
          onOk: async () => {
            await caseInfoApi.approveReject(dataForm);
            this.init(); // 刷新数据
          },
        });
        this.loading = true;
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
