<template>
  <div class="scrollbar-container">
    <a-input-search
      v-model="form.deptName"
      class="search-input"
      placeholder="请输入关键字进行过滤"
      allow-clear
      @keyup.enter="detpStore.loadDeptTreeData"
      @input="detpStore.loadDeptTreeData"
      @click="detpStore.loadDeptTreeData"
    />
    <div class="tree-container">
      <a-tree
        ref="deptRef"
        v-model:expanded-keys="expandedKeys"
        :data="deptTreeData"
        :field-names="fieldNames"
        :show-line="true"
        @select="handleNodeClick"
      >
      </a-tree>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TreeNodeData } from '@arco-design/web-vue';
  import { onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useDeptStore } from '@/store/modules/sys/dept/deptStore';

  const detpStore = useDeptStore();

  const { deptTreeData, expandedKeys, form } = storeToRefs(detpStore);

  const fieldNames = {
    children: 'children',
    title: 'deptName',
    key: 'sysDeptId',
  };

  const emits = defineEmits(['nodeClick']);
  const handleNodeClick = (
    selectedKeys: Array<string | number>,
    data: {
      selected?: boolean;
      selectedNodes: TreeNodeData[];
      node?: TreeNodeData;
      e?: Event;
    },
  ) => {
    emits('nodeClick', data?.node);
  };

  onMounted(() => {
    detpStore.loadDeptTreeData();
  });
</script>

<style lang="less" scoped>
  .scrollbar-container {
    height: 100%;
    width: 100%;

    .search-input {
      height: 32px;
      margin-bottom: 8px;
    }
    .tree-container {
      height: calc(100% - 32px);
      overflow: auto;
    }
  }
</style>
