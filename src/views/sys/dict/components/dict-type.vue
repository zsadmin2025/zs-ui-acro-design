<template>
  <div class="scrollbar-container">
    <a-space style="margin-bottom: 16px">
      <a-input-search
        v-model="form.dictName"
        placeholder="请输入关键字进行过滤"
        @keyup.enter="dictTypeStore.loadDictTypePage"
        @input="dictTypeStore.loadDictTypePage"
        @click="dictTypeStore.loadDictTypePage"
      />
      <a-button type="primary" @click="dictTypeStore.handleAddOrEdit($event)">
        <template #icon>
          <icon-plus />
        </template>
      </a-button>
    </a-space>
    <div class="tree-container">
      <a-tree
        ref="dictTypeRef"
        v-model:expanded-keys="expandedKeys"
        :data="dictTypeTreeData"
        :field-names="{
          key: 'sysDictTypeId',
          title: 'dictName',
        }"
        :show-line="true"
        @select="dictTypeStore.handleNodeClick"
        ><template #extra="nodeData">
          <IconEdit
            style="
              position: absolute;
              right: 32px;
              font-size: 12px;
              top: 10px;
              color: #3370ff;
            "
            @click="dictTypeStore.handleAddOrEdit(nodeData)"
          />
          <IconDelete
            style="
              position: absolute;
              right: 8px;
              font-size: 12px;
              top: 10px;
              color: #ff4d4f;
            "
            @click="dictTypeStore.handleDelete(nodeData)"
          />
        </template>
      </a-tree>
    </div>
    <dict-type-add-or-edit
      ref="addEditRef"
      @refresh="dictTypeStore.loadDictTypePage()"
    />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useDictTypeStore } from '@/store/modules/sys/dict/dictTypeStore';
  import dictTypeAddOrEdit from './dict-type-add-or-edit.vue';

  const dictTypeStore = useDictTypeStore();
  const { dictTypeTreeData, addEditRef, expandedKeys, form } =
    storeToRefs(dictTypeStore);

  onMounted(() => {
    dictTypeStore.loadDictTypePage();
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
      height: calc(100% - 48px);
      overflow: auto;
    }
  }
</style>
