import { defineStore } from 'pinia';
import { sysConfigApi } from '@/api/sys/config';
import { FormInstance, Message } from '@arco-design/web-vue';

export const uploadFileStore = defineStore('uploadFile', {
  state: () => ({
    uploadFileRef: ref<FormInstance | null>(null), // 显式声明类型并初始化为 null
    loading: false,
    uploadFileForm: {
      type: 1,
      local: {
        domain: '',
        prefix: '',
        path: '',
      },
      aliyun: {
        domain: '',
        endpoint: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucketName: '',
      },
      tencent: {
        domain: '',
        secretId: '',
        secretKey: '',
        region: '',
        bucketName: '',
      },
      huawei: {
        domain: '',
        endPoint: '',
        accessKey: '',
        secretAccessKey: '',
        bucketName: '',
      },
    },
  }),
  getters: {
    rules() {
      return {
        type: [
          { required: true, message: '请选择存储类型', trigger: 'change' },
        ],
        local: {
          domain: [
            { required: true, message: '请输入访问域名', trigger: 'blur' },
          ],
          prefix: [
            { required: true, message: '请输入路径前缀', trigger: 'blur' },
          ],
          path: [
            { required: true, message: '请输入存储路径', trigger: 'blur' },
          ],
        },
        aliyun: {
          domain: [
            { required: true, message: '请输入访问域名', trigger: 'blur' },
          ],
          prefix: [
            { required: true, message: '请输入路径前缀', trigger: 'blur' },
          ],
          endpoint: [
            { required: true, message: '请输入EndPoint', trigger: 'blur' },
          ],
          accessKeyId: [
            { required: true, message: '请输入AccessKeyId', trigger: 'blur' },
          ],
          accessKeySecret: [
            {
              required: true,
              message: '请输入AccessKeySecret',
              trigger: 'blur',
            },
          ],
          bucketName: [
            { required: true, message: '请输入BucketName', trigger: 'blur' },
          ],
        },
        tencent: {},
      };
    },
  },
  actions: {
    async init() {
      const data = await sysConfigApi.getUploadConfig();
      Object.assign(this.uploadFileForm, data?.data);
    },
    async submit() {
      // 防止重复提交
      if (this.loading) return;
      try {
        if (!this.uploadFileRef) return;

        if (await this.uploadFileRef.validate()) {
          return;
        }

        this.loading = true;

        const dataForm = {
          configKey: 'sys_config_file',
          configValue: JSON.stringify(this.uploadFileForm),
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
