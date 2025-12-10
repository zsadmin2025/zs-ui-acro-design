<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="dictDataAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysDictDataId ? '新增字典' : '编辑字典' }}
      </h4>
    </template>
    <a-form
      ref="formRef"
      :model="form"
      :rules="dictDataAddOrEditStore.rules"
      auto-label-width
    >
      <a-form-item label="字典分类" prop="sysDictDataId">
        <a-select
          v-model="form.sysDictTypeId"
          placeholder="请选择字典分类"
          style="width: 100%"
          @change="dictDataAddOrEditStore.handleDictTypeChange"
        >
          <a-option
            v-for="item in dictTypeList"
            :key="item.sysDictTypeId"
            :label="item.dictName"
            :value="item.sysDictTypeId"
          />
        </a-select>
      </a-form-item>
      <a-form-item label="字典类型" field="dictType">
        <a-input
          v-model="form.dictType"
          placeholder="请输入字典类型"
          readonly
        />
      </a-form-item>
      <a-form-item label="上级字典" field="pidName">
        <!-- <a-input v-model="form.pidName" placeholder="请输入上级字典" readonly /> -->
        <a-tree-select
          v-model="form.pid"
          :data="formattedList"
          placeholder="请选择上级菜单"
          :allow-search="true"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item label="字典标签" field="dictLabel">
        <a-input v-model="form.dictLabel" placeholder="请输入字典标签" />
      </a-form-item>
      <a-form-item label="字典键值" field="dictValue">
        <a-input v-model="form.dictValue" placeholder="请输入字典键值" />
      </a-form-item>
      <a-form-item label="排序号" field="sort">
        <a-input-number v-model="form.sort" :min="0" mode="button" />
      </a-form-item>
      <a-form-item label="状态" field="status">
        <a-switch
          v-model="form.status"
          :checked-value="1"
          :unchecked-value="0"
          type="round"
        >
          <template #checked> 启用 </template>
          <template #unchecked> 禁用 </template>
        </a-switch>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="dictDataAddOrEditStore.close">取消</a-button>
        <a-button type="primary" @click="dictDataAddOrEditStore.submit(emits)">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useDictDataAddOrEditStore } from '@/store/modules/sys/dict/dictDataAddOrEditStore';
  import { storeToRefs } from 'pinia';

  const dictDataAddOrEditStore = useDictDataAddOrEditStore();
  const { dialogFormVisible, formRef, form, dictTypeList, dictDataList } =
    storeToRefs(dictDataAddOrEditStore);

  const convertList = (treeData: any) => {
    return treeData.map((item: any) => ({
      key: item.sysDictDataId,
      title: item.dictLabel,
      children: item.children ? convertList(item.children) : null,
    }));
  };

  const formattedList = computed(() => convertList(dictDataList.value));

  const emits = defineEmits(['refresh']);

  defineExpose({
    form,
    init: dictDataAddOrEditStore.init,
    initAddChild: dictDataAddOrEditStore.initAddChild,
  });
</script>
