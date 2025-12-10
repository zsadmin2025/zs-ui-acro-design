<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="dictTypeAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysDictTypeId ? '新增字典类型' : '编辑字典类型' }}
      </h4>
    </template>
    <a-form
      ref="formRef"
      :model="form"
      :rules="dictTypeAddOrEditStore.rules"
      auto-label-width
    >
      <a-form-item label="字典类型" field="dictType">
        <a-input v-model="form.dictType" placeholder="请输入字典类型" />
      </a-form-item>
      <a-form-item label="字典名称" field="dictName">
        <a-input v-model="form.dictName" placeholder="请输入字典名称" />
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
        <a-button @click="dictTypeAddOrEditStore.close">取消</a-button>
        <a-button type="primary" @click="dictTypeAddOrEditStore.submit(emits)">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useDictTypeAddOrEditStore } from '@/store/modules/sys/dict/dictTypeAddOrEditStore';

  const dictTypeAddOrEditStore = useDictTypeAddOrEditStore();
  const { dialogFormVisible, formRef, form } = storeToRefs(
    dictTypeAddOrEditStore,
  );
  const emits = defineEmits(['refresh']);

  defineExpose({
    form,
    init: dictTypeAddOrEditStore.init,
  });
</script>
