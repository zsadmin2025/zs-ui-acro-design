import { defineStore } from 'pinia';
import { genApi } from '@/api/tool/gen';
import { GenTableEditState } from '@/types/tool/gen/genTypes';
import { Message } from '@arco-design/web-vue';

export const useGenEditStore = defineStore('genEdditStore', {
  state: (): GenTableEditState => ({
    visible: false,
    formRef: ref(null),
    genTable: {
      tableId: '',
      tableName: '',
      tableComment: '',
      className: '',
      packageName: '',
      moduleName: '',
      businessName: '',
      functionName: '',
      functionAuthor: '',
      parentMenuId: '',
      parentMenuName: '',
      columns: [],
    },
    total: 0,
    loading: false,
  }),
  getters: {},
  actions: {
    async init() {
      this.visible = true;
      await Promise.all([this.getInfo()]);
    },

    async getInfo() {
      const { data } = await genApi.getById(this.genTable.tableId);
      // 假设 data 是接口返回的原始数组
      const list = data.columns.map((item: any) => ({
        ...item,
        isInsert: item.isInsert === '1',
        isEdit: item.isEdit === '1',
        isList: item.isList === '1',
        isQuery: item.isQuery === '1',
        isRequired: item.isRequired === '1',
      }));
      data.columns = list;
      Object.assign(this.genTable, data);
    },
    close() {
      this.genTable = {
        tableId: '',
        tableName: '',
        tableComment: '',
        className: '',
        packageName: '',
        moduleName: '',
        businessName: '',
        functionName: '',
        functionAuthor: '',
        parentMenuId: '',
        parentMenuName: '',
        columns: [],
      };
      this.visible = false;
    },
    async submit() {
      // 防止重复提交
      if (this.loading) return;

      try {
        if (!this.formRef) return;

        if (await this.formRef.validate()) {
          return;
        }
        this.loading = true;
        // 创建深拷贝用于提交
        const data = JSON.parse(JSON.stringify(this.genTable));
        const submitData = JSON.parse(JSON.stringify(this.genTable.columns));

        // 只在这个副本上进行转换
        submitData.forEach((item: any) => {
          item.isRequired = item.isRequired ? '1' : '0';
          item.isInsert = item.isInsert ? '1' : '0';
          item.isEdit = item.isEdit ? '1' : '0';
          item.isList = item.isList ? '1' : '0';
          item.isQuery = item.isQuery ? '1' : '0';
        });

        data.columns = submitData;
        await genApi.edit(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '未知错误';
        Message.error(errorMessage);
      } finally {
        this.loading = false;
      }

      this.close();
    },
  },
});
