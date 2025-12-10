<template>
  <a-modal
    v-model:visible="visible"
    width="40%"
    title-align="start"
    :draggable="true"
    :mask-closable="false"
    @cancel="menuBtnPermissionAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.pid ? '新增' : '修改' }}
      </h4>
    </template>
    <a-form
      ref="formRef"
      :model="form"
      :rules="menuBtnPermissionAddOrEditStore.rules"
      auto-label-width
    >
      <a-form-item label="按钮名称" field="title">
        <a-input v-model="form.title" placeholder="请输入按钮名称"></a-input>
      </a-form-item>
      <a-form-item label="权限标识" field="permissions">
        <a-input
          v-model="form.permissions"
          placeholder="多个用逗号隔开，如: sys:menu:save,sys:menu:list"
        ></a-input>
      </a-form-item>
      <a-form-item label="排序号" field="sort">
        <a-input-number v-model="form.sort" placeholder="请输入排序" />
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
        <a-button @click="menuBtnPermissionAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="menuBtnPermissionAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useMenuBtnPermissionAddOrEditStore } from '@/store/modules/sys/menu/menuBtnPermissionAddOrEditStore';

  const menuBtnPermissionAddOrEditStore = useMenuBtnPermissionAddOrEditStore();

  const { visible, formRef, form, loading } = storeToRefs(
    menuBtnPermissionAddOrEditStore,
  );

  const emits = defineEmits(['refresh']);
  defineExpose({
    form,
    init: menuBtnPermissionAddOrEditStore.init,
  });
</script>
