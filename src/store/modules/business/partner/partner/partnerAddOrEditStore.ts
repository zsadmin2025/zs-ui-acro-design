import { defineStore } from 'pinia';
import { businessPartnerApi } from '@/api/business/partner/partner/partner';
import { Message } from '@arco-design/web-vue';
import { PartnerAddOrEditState } from '@/types/business/partner/partner/partnerTypes';

export const usePartnerAddOrEditStore = defineStore(
  'businessPartnerAddOrEdit',
  {
    state: (): PartnerAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          partnerId: '',
          partnerCategoryId: '',
          companyName: '',
          partnerType: '',
          companyAddress: '',
          warehouseAddress: '',
          shortName: '',
          namePinyin: '',
          contactPerson: '',
          companyPhone: '',
          mobile: '',
          fax: '',
          email: '',
          fileNo: '',
          settlementStatus: undefined,
          settlementPeriod: undefined,
          status: 1,
          socialCreditCode: '',
          validUntil: null,
          bankName: '',
          bankAccount: '',
          companyPrincipal: '',
          principalPhone: '',
          companyManager: '',
          managerPhone: '',
          qualityPrincipal: '',
          qualityPhone: '',
          qualityManager: '',
          qualityManagerPhone: '',
          financePrincipal: '',
          financePhone: '',
          qualityOrgPrincipal: '',
          qualityOrgPhone: '',
        },
      };
    },
    getters: {
      rules(): Record<string, any[]> {
        // 手机号格式: 1 开头的 11 位数字
        const mobilePattern = /^1[3-9]\d{9}$/;
        // 座机/联系电话格式: 区号-号码 或 手机号
        const phonePattern = /^(\d{3,4}-?\d{7,8}|1[3-9]\d{9})$/;
        // 统一社会信用代码: 18位数字或大写字母
        const creditCodePattern =
          /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
        return {
          partnerCategoryId: [{ required: true, message: '请选择单位大类' }],
          companyName: [
            { required: true, message: '请输入企业名称' },
            { maxLength: 200, message: '企业名称不能超过200个字符' },
          ],
          partnerType: [{ required: true, message: '请选择单位类型' }],
          companyAddress: [
            { required: true, message: '请输入企业地址' },
            { maxLength: 500, message: '企业地址不能超过500个字符' },
          ],
          warehouseAddress: [
            { required: true, message: '请输入仓库地址' },
            { maxLength: 500, message: '仓库地址不能超过500个字符' },
          ],
          shortName: [{ maxLength: 100, message: '简称不能超过100个字符' }],
          namePinyin: [
            {
              match: /^[A-Z]*$/,
              message: '名称首拼只能输入大写字母',
            },
            { maxLength: 200, message: '名称首拼不能超过200个字符' },
          ],
          contactPerson: [
            { maxLength: 100, message: '联系人不能超过100个字符' },
          ],
          // ==================== 联系方式 ====================
          companyPhone: [
            {
              match: phonePattern,
              message: '请输入正确的企业电话格式',
            },
          ],
          mobile: [
            {
              match: mobilePattern,
              message: '请输入正确的11位手机号',
            },
          ],
          fax: [
            {
              match: phonePattern,
              message: '请输入正确的传真格式',
            },
          ],
          email: [{ type: 'email', message: '请输入正确的电子邮箱格式' }],
          // ==================== 结算与资质 ====================
          fileNo: [{ maxLength: 100, message: '档案号不能超过100个字符' }],
          // settlementStatus: [{ required: true, message: '请选择结算状态' }],
          settlementPeriod: [
            { type: 'number', min: 0, message: '结算账期请输入有效数字' },
          ],
          status: [{ required: true, message: '请选择单位状态' }],
          socialCreditCode: [
            {
              match: creditCodePattern,
              message: '请输入18位有效的统一社会信用代码',
            },
          ],
          bankName: [{ maxLength: 200, message: '开户银行不能超过200个字符' }],
          bankAccount: [
            {
              match: /^\d+$/,
              message: '银行账号只能输入数字',
            },
          ],
          // ==================== 人员信息 ====================
          companyPrincipal: [
            { maxLength: 100, message: '企业负责人不能超过100个字符' },
          ],
          principalPhone: [
            {
              match: phonePattern,
              message: '请输入正确的联系电话格式',
            },
          ],
          companyManager: [
            { maxLength: 100, message: '企业管理员不能超过100个字符' },
          ],
          managerPhone: [
            {
              match: phonePattern,
              message: '请输入正确的联系电话格式',
            },
          ],
          qualityPrincipal: [
            { maxLength: 100, message: '质量负责人不能超过100个字符' },
          ],
          qualityPhone: [
            {
              match: phonePattern,
              message: '请输入正确的联系电话格式',
            },
          ],
          qualityManager: [
            { maxLength: 100, message: '质量管理员不能超过100个字符' },
          ],
          qualityManagerPhone: [
            {
              match: phonePattern,
              message: '请输入正确的联系电话格式',
            },
          ],
          financePrincipal: [
            { maxLength: 100, message: '财务负责人不能超过100个字符' },
          ],
          financePhone: [
            {
              match: phonePattern,
              message: '请输入正确的联系电话格式',
            },
          ],
          qualityOrgPrincipal: [
            { maxLength: 100, message: '质量机构负责人不能超过100个字符' },
          ],
          qualityOrgPhone: [
            {
              match: phonePattern,
              message: '请输入正确的联系电话格式',
            },
          ],
        };
      },
    },
    actions: {
      init() {
        this.dialogFormVisible = true;
        if (this.form.partnerId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await businessPartnerApi.getById(this.form.partnerId);
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
          const action = this.form.partnerId
            ? businessPartnerApi.edit
            : businessPartnerApi.save;
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
