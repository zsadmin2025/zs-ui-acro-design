import { defineStore } from 'pinia';
import { caseInfoApi } from '@/api/lawyer/cases/info';
import { InfoAddOrEditState } from '@/types/lawyer/cases/info/infoTypes';
import { basicApprovalConfigurationApi } from '@/api/lawyer/basic/approval';
import { Message, Modal } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import { useTabBarStore } from '@/store';
import { useRoute } from 'vue-router';

export const useInfoAddOrEditStore = defineStore('caseInfoAddOrEdit', {
  state: (): InfoAddOrEditState => {
    return {
      resultShow: false,
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      approvalUsers: [],
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
          powerAttorney: '',
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
        caseContract: {
          caseContractId: '',
          caseInfoId: '',
          startDate: dayjs().format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
          contractAmount: 0,
          paymentMethod: '',
          paymentMethodDetails: '',
          contractNodeList: [],
          contractFileList: [],
        },
        caseInfoList: [],
        caseInfoFilesList: [],
        approvalLawyerList: [],
        caseInfoApprovalForm: {} as any, // 初始化为空对象，用于保存审批表单数据
      },
    };
  },
  getters: {
    rules() {
      return {
        'caseCustomer.customerId': [
          { required: true, message: '请选择客户', trigger: 'change' },
        ],
        'caseCustomer.customerType': [
          { required: true, message: '请选择客户状态', trigger: 'change' },
        ],
        'caseInfo.caseName': [
          { required: true, message: '请输入案件名称', trigger: 'blur' },
        ],
        'caseInfo.caseNo': [
          { required: true, message: '请输入案件编号', trigger: 'blur' },
        ],
        'caseInfo.caseType': [
          { required: true, message: '请选择案件类型', trigger: 'change' },
        ],
        'caseContract.contractNodeList': [
          {
            required: true,
            message: '至少添加一个付款节点',
            trigger: 'change',
          },
        ],
        'approvalLawyerList': [
          { required: true, message: '请选择审批人', trigger: 'change' },
        ],
      };
    },
  },
  actions: {
    init() {
      console.log('init');
      this.dialogFormVisible = true;
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
    close() {
      this.formRef.resetFields();
      this.$reset();
      this.dialogFormVisible = false;
    },
    reset() {
      this.$reset();
    },
    // 结案
    async closed() {
      if (this.loading) return;

      try {
        this.loading = true;
        const dataForm = {
          caseInfoId: this.form.caseInfo.caseInfoId,
        };
        await caseInfoApi.closed(dataForm);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '未知错误';
        Message.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    // 作废
    async cancel() {
      if (this.loading) return;

      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行作废操作,是否继续?',
        onOk: async () => {
          try {
            this.loading = true;
            const dataForm = {
              caseInfoId: this.form.caseInfo.caseInfoId,
            };
            await caseInfoApi.cancel(dataForm);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : '未知错误';
            Message.error(errorMessage);
          } finally {
            this.loading = false;
          }
        },
      });
    },
    // 加载审批人
    async loadApprovalUsers() {
      const data =
        await basicApprovalConfigurationApi.getApprovalRoleUserList();
      this.approvalUsers = data?.data ?? [];
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

        const action = this.form.caseInfo.caseInfoId
          ? caseInfoApi.edit
          : caseInfoApi.save;
        await action(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.loading = false;
        this.$reset();
        emits('refresh');
        const tabBarStore = useTabBarStore();
        const route = useRoute();
        // 关闭当前页面
        tabBarStore.deleteTagByName(route.name as string);
        // this.resultShow = true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '未知错误';
        Message.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async savePowerAttorney(
      data: any,
      emits: (event: 'refreshDetails') => void,
    ) {
      try {
        await caseInfoApi.savePowerAttorney(data);
        Message.success('保存成功');
        emits('refreshDetails');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '未知错误';
        Message.error(errorMessage);
      }
    },
  },
});
