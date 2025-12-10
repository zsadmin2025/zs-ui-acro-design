import { defineStore } from 'pinia';
import { sysDictTypeApi, sysDictDataApi } from '@/api/sys/dict';
import { DictDataAddOrEditState } from '@/types/sys/dict/DictData';

export const useDictDataAddOrEditStore = defineStore('dictDataAddOrEdit', {
  state: (): DictDataAddOrEditState => {
    return {
      dialogFormVisible: false,
      loading: false,
      formRef: ref(null),
      dictTypeList: [] as any[],
      dictDataList: [],
      form: {
        sysDictDataId: '',
        sysDictTypeId: '',
        pid: '',
        pidName: '',
        dictType: '',
        dictLabel: '',
        dictValue: '',
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
        // pidName: [
        //   { required: true, message: '请输入上级字典名称', trigger: 'blur' },
        // ],
        dictLabel: [
          { required: true, message: '请输入字典标签', trigger: 'blur' },
        ],
        dictValue: [
          { required: true, message: '请输入字典键值', trigger: 'blur' },
        ],
      };
    },
  },
  actions: {
    init() {
      this.dialogFormVisible = true;
      this.queryDictTypeList();
      // this.loadDictDataList('');
      if (this.form.sysDictDataId) {
        nextTick(async () => {
          await this.loadDictDataList(this.form.dictType);
          await this.getInfoById();
        });
      }
    },
    initAddChild() {
      this.dialogFormVisible = true;

      nextTick(async () => {
        await this.loadDictDataList(this.form.dictType);
        await this.queryDictTypeList();
      });
    },
    async getInfoById() {
      const data = await sysDictDataApi.getDictDataById(
        this.form.sysDictDataId,
      );
      Object.assign(this.form, data?.data);
    },
    async queryDictTypeList() {
      const data = await sysDictTypeApi.getDictTypeList();
      this.dictTypeList = data?.data ?? [];
    },
    handleDictTypeChange(val: string) {
      this.form.dictType = this.dictTypeList.find(
        (item) => item.sysDictTypeId === val,
      )?.dictType;

      this.loadDictDataList(this.form.dictType);
    },
    async loadDictDataList(dictType: string) {
      // 查询分类下的字典数据
      const res = await sysDictDataApi.getDictDataList({
        dictType,
      });
      this.dictDataList = [
        {
          sysDictDataId: '0',
          sysDictTypeId: '',
          pid: '0',
          pidName: '一级',
          dictType: '',
          dictLabel: '一级',
          dictValue: '',
          sort: 0,
          status: 1,
          children: res?.data ?? [],
        },
      ];
      // this.dictDataList = res?.data ?? [];
    },
    close() {
      this.formRef.resetFields();
      this.form.sysDictTypeId = '';
      this.form = {
        sysDictDataId: '',
        sysDictTypeId: '',
        pid: '',
        pidName: '',
        dictType: '',
        dictLabel: '',
        dictValue: '',
        sort: 0,
        status: 1,
      };
      this.dialogFormVisible = false;
    },
    async submit(emits: (event: 'refresh') => void) {
      this.loading = true;
      if (!this.formRef) return;

      if (await this.formRef.validate()) {
        return;
      }
      const action = this.form.sysDictDataId
        ? sysDictDataApi.dictDataEdit
        : sysDictDataApi.dictDataSave;
      await action(this.form);
      this.close();
      this.dialogFormVisible = false;
      this.loading = false;
      emits('refresh');
    },
  },
});
