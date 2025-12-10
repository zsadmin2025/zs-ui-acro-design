import { defineStore } from 'pinia';
import { sysDictTypeApi } from '@/api/sys/dict';
import { DictTypeAddOrEditState } from '@/types/sys/dict/DictTypes';

export const useDictTypeAddOrEditStore = defineStore('dictTypeAddOrEdit', {
  state: (): DictTypeAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      form: {
        sysDictTypeId: '',
        dictType: '',
        dictName: '',
        sort: 0,
        status: 1,
      },
    };
  },
  getters: {
    rules() {
      return {
        dictType: [
          { required: true, message: '请输入字典类型', trigger: 'blur' },
        ],
        dictName: [
          { required: true, message: '请输入字典描述', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      if (this.form.sysDictTypeId) {
        nextTick(async () => {
          await this.getInfoById();
        });
      }
    },
    async getInfoById() {
      const data = await sysDictTypeApi.getDictTypeById(
        this.form.sysDictTypeId,
      );
      Object.assign(this.form, data?.data);
    },
    close() {
      this.formRef.resetFields();
      this.dialogFormVisible = false;
    },
    async submit(emits: (event: 'refresh') => void) {
      this.loading = true;
      if (!this.formRef) return;

      if (await this.formRef.validate()) {
        return;
      }
      const action = !this.form.sysDictTypeId
        ? sysDictTypeApi.dictTypeSave
        : sysDictTypeApi.dictTypeEdit;
      await action(this.form);
      this.close();
      this.dialogFormVisible = false;
      this.loading = false;
      emits('refresh');
    },
  },
});
