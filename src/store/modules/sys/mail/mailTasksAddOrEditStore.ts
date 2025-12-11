import { defineStore } from 'pinia';
import { sysMailTasksApi } from '@/api/sys/mail';
import { MailTasksAddOrEditState } from '@/types/sys/mail/mailTasksTypes';
import { Message } from '@arco-design/web-vue';

export const useMailTasksAddOrEditStore = defineStore('sysMailTasksAddOrEdit', {
  state: (): MailTasksAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      sendLoading: false,
      formRef: ref(null),
      form: {
        sysMailTasksId: '',
        subject: '',
        content: '',
        recipients: [],
        cc: [],
        bcc: [],
        templateId: '',
        status: null,
      },
    };
  },
  getters: {
    rules() {
      return {
        sysMailTasksId: [
          { required: true, message: '请选择邮件任务表ID', trigger: 'blur' },
        ],
        subject: [
          { required: true, message: '请选择邮件主题', trigger: 'blur' },
        ],
        content: [
          {
            required: true,
            message: '请选择邮件正文（HTML或者纯文本）',
            trigger: 'blur',
          },
        ],
        sender: [
          { required: true, message: '请选择发件人邮箱地址', trigger: 'blur' },
        ],
        recipients: [
          {
            required: true,
            message: '请选择收件人列表',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.sysMailTasksId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await sysMailTasksApi.getById(this.form.sysMailTasksId);
      Object.assign(this.form, data?.data);
    },
    close() {
      this.formRef.resetFields();
      this.form = {
        sysMailTasksId: '',
        subject: '',
        content: '',
        recipients: [],
        cc: [],
        bcc: [],
        templateId: '',
        status: null,
      };
      this.dialogFormVisible = false;
    },
    // 保存草稿
    async submit(emits: (event: 'refresh') => void) {
      // 防止重复提交
      if (this.loading) return;

      try {
        if (!this.formRef) return;

        if (await this.formRef.validate()) {
          return;
        }
        this.loading = true;
        const action = this.form.sysMailTasksId
          ? sysMailTasksApi.edit
          : sysMailTasksApi.save;
        await action(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.loading = false;
        emits('refresh');
      } finally {
        this.loading = false;
      }
    },
    async sendNow(emits: (event: 'refresh') => void) {
      // 防止重复提交
      if (this.sendLoading) return;

      try {
        if (!this.formRef) return;

        if (await this.formRef.validate()) {
          return;
        }
        this.sendLoading = true;
        await sysMailTasksApi.sendNow(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.sendLoading = false;
        emits('refresh');
      } finally {
        this.sendLoading = false;
      }
    },
  },
});
