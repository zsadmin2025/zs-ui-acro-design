<template>
  <a-drawer
    :visible="dialogFormVisible"
    :title="!form.sysDeptId ? '新增部门' : '修改部门'"
    width="30%"
    @cancel="deptAddOrEditStore.close"
    @ok="deptAddOrEditStore.submit(emits)"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="deptAddOrEditStore.rules"
      auto-label-width
    >
      <a-form-item label="父级菜单" field="pid">
        <a-tree-select
          v-model="form.pid"
          :data="treeData"
          :field-names="{
            key: 'sysDeptId',
            title: 'deptName',
            children: 'children',
          }"
          placeholder="请选择部门"
          :allow-search="true"
          :allow-clear="true"
        />
      </a-form-item>
      <a-form-item label="部门名称" field="deptName">
        <a-input v-model="form.deptName" placeholder="请输入部门名称" />
      </a-form-item>
      <a-form-item label="部门负责人" field="deptHeadId">
        <ZsSelectUser
          v-model="form.deptHeadId"
          :multiple="false"
          @on-select="handleSelect"
        />
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
      <a-form-item label="排序号" field="sort">
        <a-input-number v-model="form.sort" :min="0" mode="button" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-textarea v-model:value="form.remark" rows="2" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="deptAddOrEditStore.close">取消</a-button>
        <a-button type="primary" @click="deptAddOrEditStore.submit(emits)">
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { useDeptAddOrEditStore } from '@/store/modules/sys/dept/deptAddOrEditStore';
  import { storeToRefs } from 'pinia';

  const deptAddOrEditStore = useDeptAddOrEditStore();
  const { form, formRef, dialogFormVisible, treeData } =
    storeToRefs(deptAddOrEditStore);

  const handleSelect = (val: any) => {
    form.value.deptHeadName = val?.realName ?? '';
  };

  const emits = defineEmits(['refresh']);

  defineExpose({
    form,
    init: deptAddOrEditStore.init,
  });
</script>
