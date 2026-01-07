import { defineStore } from 'pinia';
import { ref } from 'vue';
import { sysDictTypeApi } from '@/api/sys/dict';
import { Modal, TreeNodeData } from '@arco-design/web-vue';
import { DictTypeState } from '@/types/sys/dict/DictTypes';
import { useDictDataStore } from './dictDataStore';

export const useDictTypeStore = defineStore('dictType', {
  state: (): DictTypeState => ({
    dictTypeRef: ref(null),
    dictTypeTreeData: [],
    expandedKeys: [],
    dictTypeFormRef: ref(null),
    addEditRef: ref(null),
    loading: false,
    tableData: [],
    total: 0,
    form: {
      dictType: '',
      dictName: '',
      status: 1,
    },
  }),
  actions: {
    /**
     * 获取字典类型列表并构建树形结构
     */
    async loadDictTypePage() {
      this.loading = true;

      const data = await sysDictTypeApi.getDictTypeList();
      this.dictTypeTreeData = [
        {
          sysDictTypeId: '',
          dictName: '全部字典',
          children: data?.data ?? [],
        },
      ];
      this.expandedKeys.push('');

      this.loading = false;
    },

    /**
     * 获取字典类型列表
     */
    async loadDictTypeList() {
      const data = await sysDictTypeApi.getDictTypeList();
      this.tableData = data?.data ?? [];
    },

    /**
     * 打开新增或编辑弹窗
     * @param row 当前行数据
     */
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysDictTypeId = row?.sysDictTypeId || '';
        this.addEditRef.init();
      }
    },

    /**
     * 删除字典类型
     * @param row 当前行数据
     */
    handleDelete(row: any) {
      if (row.sysDictTypeId) {
        Modal.confirm({
          title: '确认删除',
          titleAlign: 'start',
          content: `确定要删除用户[${row.dictName}]吗？`,
          onOk: async () => {
            await sysDictTypeApi.deleteDictTypeApi(row.sysDictTypeId);
            await this.loadDictTypePage();
          },
        });
      }
    },

    /**
     * 点击树节点时触发
     * @param data 节点数据
     */
    handleNodeClick(
      selectedKeys: Array<string | number>,
      data: {
        selected?: boolean;
        selectedNodes: TreeNodeData[];
        node?: TreeNodeData;
        e?: Event;
      },
    ) {
      const dictDataStore = useDictDataStore();
      dictDataStore.form.sysDictTypeId = data?.node?.sysDictTypeId;
      dictDataStore.loadDictDataPage();
    },
  },
});
