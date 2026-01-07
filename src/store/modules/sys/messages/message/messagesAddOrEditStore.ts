import { defineStore } from 'pinia';
import { sysMessagesApi } from '@/api/sys/message';
import { MessagesAddOrEditState } from '@/types/sys/messages/messagesTypes';

export const useMessagesAddOrEditStore = defineStore('sysMessagesAddOrEdit', {
  state: (): MessagesAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        sysMessageId: '',
        type: 1,
        senderId: '',
        receiverId: '',
        receiverName: '',
        title: '',
        content: '',
        readTime: null,
      },
    };
  },
  getters: {
    rules() {
      return {
        type: [
          {
            required: true,
            message: '请选择消息类型',
            trigger: 'change',
          },
        ],
        receiverId: [
          { required: true, message: '请选择接收用户', trigger: 'blur' },
        ],
        title: [{ required: true, message: '请输入主题', trigger: 'blur' }],
        content: [{ required: true, message: '请选择内容', trigger: 'blur' }],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.sysMessageId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await sysMessagesApi.getById(this.form.sysMessageId);
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
        const action = this.form.sysMessageId
          ? sysMessagesApi.edit
          : sysMessagesApi.save;
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
