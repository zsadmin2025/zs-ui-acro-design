import { defineStore } from 'pinia';
import { sysDictDataApi } from '@/api/sys/dict';
import download from '@/utils/fileDownload';
import { Modal } from '@arco-design/web-vue';
import { DictDataState } from '@/types/sys/dict/DictData';

export const useDictDataStore = defineStore('dictData', {
  state: (): DictDataState => {
    return {
      dictDataFormRef: ref(null),
      addEditRef: ref<HTMLFormElement | null>(null),
      loading: false,
      list: [],
      total: 0,
      form: {
        sysDictTypeId: '',
        pid: '',
        dictType: '',
        dictLabel: '',
        dictValue: '',
        status: 1,
        current: 1,
        pageSize: 30,
        order: 'asc',
        orderField: 'sort',
      },
      selectedKeys: [],
      dictDataMap: {},
    };
  },
  persist: {
    key: 'dictDataMap',
    storage: localStorage,
    pick: ['dictDataMap'],
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
  },
  actions: {
    async loadDictDataPage() {
      this.loading = true;
      const { data } = await sysDictDataApi.dictDataPage(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    // 根据字典类型获取字典数据列表
    async loadDictDataList() {
      const data = await sysDictDataApi.getDictMapList();
      this.dictDataMap = data?.data ?? {};
    },
    handleSizeChange(val: number) {
      this.form.pageSize = val;
      this.loadDictDataPage();
    },
    handleCurrentChange(val: number) {
      this.form.current = val;
      this.loadDictDataPage();
    },
    handleAddChild(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysDictTypeId = row?.sysDictTypeId;
        this.addEditRef.form.dictType = row?.dictType;
        this.addEditRef.form.pid = row?.sysDictDataId;
        this.addEditRef.form.pidName = row?.dictLabel;
        this.addEditRef.initAddChild();
      }
    },
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysDictDataId = row?.sysDictDataId;
        this.addEditRef.form.dictType = row?.dictType;
        this.addEditRef.init();
      }
    },
    handleDelete(record: any) {
      if (record.sysDictDataId) {
        Modal.confirm({
          title: '确认删除',
          titleAlign: 'start',
          content: `确定要删除字典数据[${record.dictLabel}]吗？`,
          onOk: async () => {
            await sysDictDataApi.dictDataDelete(record.sysDictDataId);
            await this.loadDictDataPage();
          },
        });
      }
    },
    // 选中事件
    handleSelectionChange(keys: number[]) {
      this.selectedKeys = keys;
    },
    // 批量删除
    handleDeleteSelected() {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行批量删除操作,是否继续?',
        onOk: async () => {
          const ids = this.selectedKeys.map((item: any) => item);
          await sysDictDataApi.batchDel(ids);
          await this.loadDictDataPage();
        },
      });
    },
    resetSearch() {
      this.form = {
        sysDictTypeId: '',
        pid: '',
        dictType: '',
        dictLabel: '',
        dictValue: '',
        status: 1,
        current: 1,
        pageSize: 30,
        order: 'asc',
        orderField: 'sort',
      };
      this.loadDictDataPage();
    },
    async handleExport() {
      const excelName = '字典信息';
      const response = await sysDictDataApi.exportExcel({ excelName });
      download.excel(response.data, `${excelName}.xlsx`);
    },
  },
});
