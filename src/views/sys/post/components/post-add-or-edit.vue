<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="postAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysPostId ? '新增岗位' : '修改岗位' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="岗位名称" field="postName">
        <a-input v-model="form.postName" placeholder="请输入岗位名称" />
      </a-form-item>
      <a-form-item label="所属部门" field="sysDeptId">
        <a-tree-select
          v-model="form.sysDeptId"
          :data="deptTreeData"
          :field-names="{
            key: 'id',
            title: 'deptName',
            children: 'children',
          }"
          placeholder="请选择部门"
          :allow-search="true"
          :allow-clear="true"
        />
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
        <a-button @click="postAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="postAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useDostAddOrEditStore } from '@/store/modules/sys/position/postAddOrEditStore';
  import { storeToRefs } from 'pinia';

  const postAddOrEditStore = useDostAddOrEditStore();
  const { form, dialogFormVisible, loading, deptTreeData, formRef, rules } =
    storeToRefs(postAddOrEditStore);

  const emits = defineEmits(['refresh']);
  onMounted(() => {
    postAddOrEditStore.selectDeptTree();
  });

  defineExpose({
    init: postAddOrEditStore.init,
    form,
  });
</script>
