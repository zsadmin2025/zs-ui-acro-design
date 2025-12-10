import { FormInstance, Message } from '@arco-design/web-vue';
import { defineStore } from 'pinia';

import { sysConfigApi } from '@/api/sys/config';

export const useSmsStore = defineStore('sms', {
  state: () => ({
    smsRef: ref<FormInstance | null>(null),
    loading: false,
    smsForm: {
      type: 1,
      aliyun: {
        accessKeyId: '',
        accessKeySecret: '',
        endpoint: '',
      },
    },
  }),
  getters: {},
  actions: {
    async init() {
      const data = await sysConfigApi.getSmsConfig();
      Object.assign(this.smsForm, data?.data);
    },
    async submit() {
      // 防止重复提交
      if (this.loading) return;
      try {
        if (!this.smsRef) return;

        if (await this.smsRef.validate()) {
          return;
        }

        this.loading = true;

        const dataForm = {
          configKey: 'sys_config_sms',
          configValue: JSON.stringify(this.smsForm),
        };

        await sysConfigApi.edit(dataForm);

        Message.success('保存成功');
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
