import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { sysNoticeApi } from '@/api/sys/notice';
import { NoticeAddOrEditState } from '@/types/sys/notice/noticeTypes';

export const useNoticeAddOrEditStore = defineStore('sysNoticeAddOrEdit', {
  state: (): NoticeAddOrEditState => {
    return {
      dialogFormVisible: false,
      noticeInfoVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        sysNoticeId: '',
        title: '',
        content: '',
        type: 1,
        level: 1,
        status: 1,
        receivingType: 1,
        receiverIds: [],
        releaseTime: null,
        files: [],
        sysNoticeDetailsVOs: [],
        createTime: null,
        updateTime: null,
      },
    };
  },
  getters: {
    rules() {
      return {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur',
          },
        ],
        content: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.sysNoticeId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    initInfo() {
      this.noticeInfoVisible = true;
      if (this.form.sysNoticeId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await sysNoticeApi.getById(this.form.sysNoticeId);
      Object.assign(this.form, data?.data);
    },
    close() {
      this.formRef.resetFields();
      this.dialogFormVisible = false;
    },
    closeInfo() {
      this.noticeInfoVisible = false;
    },
    async handleSaveDraft(emits: (event: 'refresh') => void) {
      // 防止重复提交
      if (this.loading) return;
      try {
        if (!this.formRef) return;
        if (await this.formRef.validate()) {
          return;
        }
        this.loading = true;
        // 草稿状态为1
        this.form.status = 1;
        const action = this.form.sysNoticeId
          ? sysNoticeApi.edit
          : sysNoticeApi.save;
        await action(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.loading = false;
        emits('refresh');
      } finally {
        this.loading = false;
      }
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
        // 发布状态为2
        this.form.status = 2;
        await sysNoticeApi.releaseImmediately(this.form);
        this.close();
        this.dialogFormVisible = false;
        this.loading = false;
        emits('refresh');
      } finally {
        this.loading = false;
      }
    },

    handleReceivingTypeChange(value: any) {
      switch (value) {
        case 1:
          // 全部用户
          this.form.receiverIds = [];
          break;
        case 2:
          // 指定用户
          this.form.receiverIds = [];
          break;
        case 3:
          // 指定角色
          this.form.receiverIds = [];
          break;
        case 4:
          // 指定部门
          this.form.receiverIds = [];
          break;
        case 5:
          // 指定岗位
          this.form.receiverIds = [];
          break;
        default:
      }
    },
  },
});
