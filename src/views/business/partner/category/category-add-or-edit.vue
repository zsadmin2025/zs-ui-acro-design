<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="40%"
    title-align="start"
    :draggable="true"
    @cancel="categoryAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.businessPartnerCategoryId ? '新增单位分类' : '修改单位分类' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="类别名称" field="partnerCategoryName">
        <a-input
          v-model="form.partnerCategoryName"
          placeholder="请输入类别名称"
          :max-length="255"
        />
      </a-form-item>
      <a-form-item label="状态" field="status">
        <a-switch
          v-model="form.status"
          :checked-value="1"
          :unchecked-value="0"
          type="round"
        >
          <template #checked> 正常 </template>
          <template #unchecked> 停用 </template>
        </a-switch>
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-textarea
          v-model="form.remark"
          placeholder="请输入备注"
          :rows="4"
          allow-clear
          :max-length="255"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="categoryAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="categoryAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useCategoryAddOrEditStore } from '@/store/modules/business/partner/category/categoryAddOrEditStore';

  const categoryAddOrEditStore = useCategoryAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } = storeToRefs(
    categoryAddOrEditStore,
  );

  const emits = defineEmits(['refresh']);

  defineExpose({
    init: categoryAddOrEditStore.init,
    form,
  });
</script>
