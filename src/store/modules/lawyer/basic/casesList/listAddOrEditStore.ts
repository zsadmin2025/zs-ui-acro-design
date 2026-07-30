import { defineStore } from 'pinia';
import { caseListApi } from '@/api/lawyer/basic/casesList';
import { ListAddOrEditState } from '@/types/lawyer/basic/list/listTypes';
import { Message } from '@arco-design/web-vue';

export const useListAddOrEditStore = defineStore('caseListAddOrEdit', {
  state: (): ListAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        caseListId: '',
        caseType: '',
        fileName: '',
        fileOriginalName: '',
        fileSize: 0,
        fileType: '',
        fileUrl: '',
        isRequired: 1,
      },
      filesList: [],
    };
  },
  getters: {
    rules() {
      return {
        caseType: [
          { required: true, message: '请选择案件类型', trigger: 'change' },
        ],
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
        ],
        // fileUrl: [
        //   { required: true, message: '请上传模板文档', trigger: 'blur' },
        // ],
        isRequired: [
          { required: true, message: '请选择是否必填', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.caseListId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await caseListApi.getById(this.form.caseListId);
      Object.assign(this.form, data?.data);
      if (this.form.fileUrl) {
        this.filesList = [
          {
            fileName: this.form.fileOriginalName,
            fileUrl: this.form.fileUrl,
          },
        ];
      }
    },
    close() {
      this.formRef.resetFields();
      this.filesList = [];
      this.form = {
        caseListId: '',
        caseType: '',
        fileName: '',
        fileOriginalName: '',
        fileSize: 0,
        fileType: '',
        fileUrl: '',
        isRequired: 1,
      };
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
        const action = this.form.caseListId
          ? caseListApi.edit
          : caseListApi.save;
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
});
