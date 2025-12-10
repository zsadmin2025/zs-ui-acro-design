import { sysPostApi } from '@/api/sys/post';
import { sysDeptApi } from '@/api/sys/dept';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { PostState, Post } from '@/types/sys/post/postTypes';
import { Modal } from '@arco-design/web-vue';
import download from '@/utils/fileDownload';

export const usePostStore = defineStore('post', {
  state: (): PostState => ({
    addEditRef: ref(null),
    ruleFormRef: ref(null),
    list: [],
    deptTreeData: [],
    expandedKeys: [],
    loading: false,
    total: 0,
    form: {
      sysDeptId: '',
      postName: '',
      status: '',
      current: 1,
      pageSize: 30,
      order: 'asc',
      orderField: 'sort',
    },
    postList: [],
    selectedKeys: [],
  }),
  actions: {
    async loadPostPage() {
      this.loading = true;
      const { data } = await sysPostApi.postPage(this.form);
      this.list = data?.list ?? [];
      this.total = data.total ?? 0;
      this.loading = false;
    },
    async loadPostList() {
      const data = await sysPostApi.getList({});
      this.postList = data?.data ?? [];
    },
    /**
     * 获取部门树型结构
     */
    async getDeptList() {
      const data = await sysDeptApi.getDeptTree({});
      const treeData = data?.data ?? [];
      treeData.forEach((element: any) => {
        this.expandedKeys.push(element.sysDeptId as never);
      });
      Object.assign(this.deptTreeData, treeData);
    },
    handleNodeClick(data: any) {
      this.form.sysDeptId = data.sysDeptId;
      this.loadPostPage();
    },
    handleSizeChange(val: number) {
      this.form.pageSize = val;
      this.loadPostPage();
    },
    handleCurrentChange(val: number) {
      this.form.current = val;
      this.loadPostPage();
    },
    resetSearch() {
      this.form = {
        sysDeptId: '',
        postName: '',
        status: '',
        current: 1,
        pageSize: 30,
        order: 'asc',
        orderField: 'sort',
      };
      this.loadPostPage();
    },
    setSelectedKeys(keys: number[]) {
      this.selectedKeys = keys;
    },
    handleAddOrEdit(row: any) {
      if (this.addEditRef) {
        this.addEditRef.form.sysPostId = row?.sysPostId;
        this.addEditRef.init();
      }
    },
    async handleDeleteSelected() {
      Modal.confirm({
        title: '温馨提示',
        titleAlign: 'start',
        content: '您将进行批量删除操作,是否继续?',
        onOk: async () => {
          const ids = this.selectedKeys.map((item: any) => item);
          await sysPostApi.batchDel(ids);
          await this.loadPostPage();
        },
      });
    },
    async handleDelete(record: Post) {
      Modal.confirm({
        title: '确认删除',
        titleAlign: 'start',
        content: `确定要删除角色[${record.postName}]吗？`,
        onOk: async () => {
          await sysPostApi.deletePostApi(record.sysPostId);
          await this.loadPostPage();
        },
      });
    },

    // 导出
    async handleExport() {
      const excelName = '岗位信息';
      const response = await sysPostApi.exportExcel({ excelName });
      download.excel(response.data, `${excelName}.xlsx`);
    },
  },
});
