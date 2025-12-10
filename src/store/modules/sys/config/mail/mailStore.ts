import { defineStore } from 'pinia';
import { sysConfigApi } from '@/api/sys/config';

export const mailStore = defineStore('mail', {
  state: () => ({
    formRef: null,
    mail: {
      host: '',
      port: undefined,
      username: '',
      password: '',
    },
  }),
  getters: {
    rules() {
      return {
        host: [
          { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' },
        ],
        port: [
          { required: true, message: '请输入SMTP服务器端口', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入邮箱密码', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    setMail(mail: any) {
      this.mail = mail;
    },
    async init() {
      const data = await sysConfigApi.getMailConfig();
      Object.assign(this.mail, data?.data);
    },
    async save() {
      const dataForm = {
        configKey: 'sys_config_mail',
        configValue: JSON.stringify(this.mail),
      };
      await sysConfigApi.edit(dataForm);
    },
  },
});
