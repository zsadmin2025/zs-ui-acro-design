import { defineStore } from 'pinia';
import { sysJobApi } from '@/api/sys/job';
import { JobAddOrEditState } from '@/types/sys/job/jobTypes';

export const useJobAddOrEditStore = defineStore('sysJobAddOrEdit', {
  state: (): JobAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        sysJobId: '',
        jobName: '',
        jobGroup: '',
        cronExpression: '',
        status: 1,
        remark: '',
        jobClass: '',
      },
    };
  },
  getters: {
    rules() {
      return {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        jobGroup: [
          { required: true, message: '请输入任务组名称', trigger: 'blur' },
        ],
        cronExpression: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' },
        ],
        jobClass: [
          { required: true, message: '请输入任务类名', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.sysJobId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await sysJobApi.getById(this.form.sysJobId);
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
        const action = this.form.sysJobId ? sysJobApi.edit : sysJobApi.save;
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
});
