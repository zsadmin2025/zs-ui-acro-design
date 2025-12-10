<template>
  <a-modal
    v-model:visible="dataScopeVisible"
    width="30%"
    title-align="start"
    :draggable="true"
  >
    <template #title>
      <h4>
        {{ '数据权限' }}
      </h4>
    </template>
    <a-form
      ref="dataScopeFormRef"
      :model="form"
      :rules="rules"
      auto-label-width
    >
      <a-form-item label="角色名称" field="roleName">
        <a-input
          v-model="form.roleName"
          placeholder="请输入角色名称"
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="角色编码" field="roleCode">
        <a-input
          v-model="form.roleCode"
          placeholder="请输入角色编码"
          :disabled="true"
        />
      </a-form-item>
      <a-form-item label="数据范围" field="dataScope">
        <a-select v-model="form.dataScope">
          <a-option label="全部数据权限" :value="1"></a-option>
          <a-option label="自定义数据权限" :value="2"></a-option>
          <a-option label="本部门数据权限" :value="3"></a-option>
          <a-option label="本部门及以下数据权限" :value="4"></a-option>
          <a-option label="仅本人数据权限" :value="5"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="form.dataScope == 2" label="数据权限" prop="deptList">
        <a-tree-select
          ref="deptRef"
          v-model="form.deptList"
          :data="deptTree"
          :field-names="{
            key: 'id',
            title: 'deptName',
            children: 'children',
          }"
          placeholder="请选择部门"
          :max-tag-count="5"
          :tree-checkable="true"
          :allow-search="true"
          :allow-clear="true"
        />
        <!-- <el-tree-select
          ref="deptRef"
          v-model="form.deptList"
          :data="deptTree"
          multiple
          show-checkbox
          collapse-tags
          node-key="sysDeptId"
          :props="defaultProps"
          style="width: 100%"
          placeholder="请选择所属部门"
        /> -->
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="roleAddOrEditStore.closeDataScope">取消</a-button>
        <a-button
          type="primary"
          @click="roleAddOrEditStore.submitDataScope(dataScopeFormRef)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useRoleAddOrEditStore } from '@/store/modules/sys/role/roleAddOrEditStore';

  const roleAddOrEditStore = useRoleAddOrEditStore();
  const { dataScopeVisible, form, deptTree, deptRef, dataScopeFormRef } =
    storeToRefs(roleAddOrEditStore);

  const rules = {
    deptList: [
      { required: true, message: '请选择数据权限', trigger: 'change' },
    ],
  };

  defineExpose({
    initDataScope: roleAddOrEditStore.initDataScope,
    form,
  });
</script>
