<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="roleAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysRoleId ? '新增角色' : '编辑角色' }}
      </h4>
    </template>

    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="角色名称" field="roleName">
        <a-input v-model="form.roleName" placeholder="请输入角色名称" />
      </a-form-item>
      <a-form-item label="角色编码" field="roleCode">
        <a-input v-model="form.roleCode" placeholder="请输入角色编码" />
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
      <a-form-item label="备注" field="remark">
        <a-textarea v-model:value="form.remark" rows="2" />
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="roleAddOrEditStore.close">取消</a-button>
        <a-button type="primary" @click="roleAddOrEditStore.submit(emits)">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useRoleAddOrEditStore } from '@/store/modules/sys/role/roleAddOrEditStore';
  import { storeToRefs } from 'pinia';

  const roleAddOrEditStore = useRoleAddOrEditStore();
  const { dialogFormVisible, formRef, form, rules } =
    storeToRefs(roleAddOrEditStore);

  const emits = defineEmits(['refresh']);

  defineExpose({
    init: roleAddOrEditStore.init,
    form,
  });
</script>

<style scoped>
  .arco-btn-group {
    display: flex;
    justify-content: flex-end;
  }
</style>
