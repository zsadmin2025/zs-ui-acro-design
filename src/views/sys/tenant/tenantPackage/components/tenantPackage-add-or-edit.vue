<template>
  <a-drawer
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="false"
    @cancel="tenantPackageAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysTenantPackageId ? '新增租户套餐' : '修改租户套餐' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="套餐编码" field="packageCode">
        <a-input v-model="form.packageCode" placeholder="请输入套餐编码" />
      </a-form-item>
      <a-form-item label="套餐名称" field="packageName">
        <a-input v-model="form.packageName" placeholder="请输入套餐名称" />
      </a-form-item>
      <a-form-item label="套餐价格" field="price">
        <a-input-number
          v-model="form.price"
          :min="0"
          :max="999999.0"
          :precision="2"
          placeholder="请输入套餐价格"
        />
      </a-form-item>
      <a-form-item label="用户数" field="maxUser">
        <a-input-number v-model="form.maxUser" :min="1" :max="999" />
      </a-form-item>
      <a-form-item label="存储空间(GB)" field="maxStorage">
        <a-input-number v-model="form.maxStorage" :min="1" :max="9999" />
      </a-form-item>
      <a-form-item label="包含功能" field="menuIdList">
        <a-tree-select
          v-model="form.menuIdList"
          :max-tag-count="5"
          :allow-search="true"
          :allow-clear="true"
          :tree-checkable="true"
          :tree-check-strictly="treeCheckStrictly"
          :data="menuData"
          :tree-props="{ 'show-line': true, 'default-expand-all': false }"
          placeholder="请选择套餐功能"
        ></a-tree-select>
      </a-form-item>
      <a-form-item label="状态" field="status">
        <a-switch
          :checked-value="true"
          :unchecked-value="false"
          type="round"
          :default-checked="form.status === 1"
          @change="handleStatusChange"
        >
          <template #checked> 正常 </template>
          <template #unchecked> 下架 </template>
        </a-switch>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="tenantPackageAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="tenantPackageAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { useTenantPackageAddOrEditStore } from '@/store/modules/sys/tenant/tenantPackage/tenantPackageAddOrEditStore';
  import { storeToRefs } from 'pinia';
  import { sysMenuApi } from '@/api/sys/menu';

  const tenantPackageAddOrEditStore = useTenantPackageAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } = storeToRefs(
    tenantPackageAddOrEditStore,
  );

  const menuData = ref<any[]>([]);

  const treeCheckStrictly = ref(false);

  const emits = defineEmits(['refresh']);

  const handleStatusChange = (value: any, ev: Event) => {
    form.value.status = value ? 1 : 0;
  };
  const convertList = (treeData: any) => {
    return treeData.map((item: any) => ({
      key: item.sysMenuId,
      title: item.title,
      children: item.children ? convertList(item.children) : null,
    }));
  };
  const fetchMenuData = async () => {
    const res = await sysMenuApi.listPermission();
    menuData.value = convertList(res.data || []);
  };

  onBeforeMount(() => {
    fetchMenuData();
  });

  defineExpose({
    init: tenantPackageAddOrEditStore.init,
    form,
  });
</script>
