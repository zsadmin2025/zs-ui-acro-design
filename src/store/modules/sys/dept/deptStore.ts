import { ref, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { sysDeptApi } from '@/api/sys/dept';
import { Modal } from '@arco-design/web-vue';
import { DeptState } from '@/types/sys/dept/deptTypes';

export const useDeptStore = defineStore('dept', {
  state: (): DeptState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    deptTreeData: [],
    refreshTable: true,
    expand: true,
    loading: false,
    expandedKeys: [],
    total: 0,
    list: [],
    dataForm: {
      sysDeptId: '',
      deptName: '',
      current: 1,
      pageSize: 30,
    },
    form: {
      sysDeptId: '',
      deptName: null,
    },
    deptPostTreeData: [],
  }),
  actions: {
    async loadDeptTreeData() {
      this.expandedKeys = [];
      const data = await sysDeptApi.getDeptTree(this.form);
      this.deptTreeData = data?.data ?? [];
      this.deptTreeData.forEach((element: any) => {
        this.expandedKeys.push(element.sysDeptId as never);
      });
    },
    async loadDeptPage() {
      this.loading = true;
      const { data } = await sysDeptApi.getPage(this.dataForm);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async loadDeptPostTree() {
      const data = await sysDeptApi.getDeptPostTree();
      this.deptPostTreeData = data?.data ?? [];
    },

    handleCurrentChange(current: number) {
      this.dataForm.current = current;
      this.loadDeptPage();
    },
    handleSizeChange(pageSize: number) {
      this.dataForm.pageSize = pageSize;
      this.loadDeptPage();
    },
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysDeptId = row.sysDeptId;
        this.addEditRef.init();
      }
    },
    handleDelete(record: any) {
      if (record.sysDeptId) {
        Modal.confirm({
          title: '确认删除',
          titleAlign: 'start',
          content: `确定要删除[${record.deptName}]部门吗？`,
          onOk: async () => {
            await sysDeptApi.deletePostApi(record.sysDeptId);
            await this.loadDeptTreeData();
          },
        });
      }
    },
    // 树节点点击
    handleNodeClick(data: any) {
      this.dataForm.sysDeptId = data.sysDeptId;
      this.loadDeptPage();
    },
    resetForm() {
      this.dataForm = {
        sysDeptId: '',
        deptName: '',
        current: 1,
        pageSize: 30,
      };
      this.loadDeptTreeData();
      this.loadDeptPage();
    },
    toggleExpand() {
      this.refreshTable = false;
      nextTick(() => {
        this.expand = !this.expand;
        this.refreshTable = true;
      });
    },
  },
});
