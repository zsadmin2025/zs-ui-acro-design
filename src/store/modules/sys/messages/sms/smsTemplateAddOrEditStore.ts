import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { sysSmsTemplateApi } from '@/api/sys/sms';
import { SmsTemplateAddOrEditState } from '@/types/sys/sms/smsTemplateTypes';

export const useTemplateAddOrEditStore = defineStore(
  'sysSmsTemplateAddOrEdit',
  {
    state: (): SmsTemplateAddOrEditState => {
      return {
        dialogFormVisible: false,
        loading: false,
        formRef: ref(null),
        form: {
          sysSmsTemplateId: '',
          templateNumber: '',
          channel: '',
          signName: '',
          templateCode: '',
          templateContent: '',
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
        return {
          templateNumber: [
            { required: true, message: '请选择模板编号', trigger: 'blur' },
          ],
          channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }],
          signName: [
            { required: true, message: '请输入签名名称', trigger: 'blur' },
          ],
          templateCode: [
            { required: true, message: '请输入模板编号', trigger: 'blur' },
          ],
          templateContent: [
            { required: true, message: '请输入模板内容', trigger: 'blur' },
          ],
        };
      },
    },
    actions: {
      init() {
        this.dialogFormVisible = true;
        if (this.form.sysSmsTemplateId) {
          nextTick(async () => {
            await this.getInfoById();
          });
        }
      },
      async getInfoById() {
        const data = await sysSmsTemplateApi.getById(
          this.form.sysSmsTemplateId,
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
          const action = this.form.sysSmsTemplateId
            ? sysSmsTemplateApi.edit
            : sysSmsTemplateApi.save;
          await action(this.form);
          this.close();
          this.dialogFormVisible = false;
          this.loading = false;
          emits('refresh');
        } finally {
          this.loading = false;
        }
      },
    },
  },
);
