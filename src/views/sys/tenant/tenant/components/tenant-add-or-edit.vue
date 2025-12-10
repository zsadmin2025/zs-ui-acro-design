<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="tenantAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysTenantId ? '新增租户' : '修改租户' }}
      </h4>
    </template>

    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="租户名称" field="tenantName">
        <a-input v-model="form.tenantName" placeholder="请输入租户名称" />
      </a-form-item>
      <a-form-item label="联系人" field="contactPerson">
        <a-input v-model="form.contactPerson" placeholder="请输入联系人" />
      </a-form-item>
      <a-form-item label="联系电话" field="contactPhone">
        <a-input v-model="form.contactPhone" placeholder="请输入联系电话" />
      </a-form-item>
      <a-form-item label="联系邮箱" field="contactEmail">
        <a-input v-model="form.contactEmail" placeholder="请输入联系邮箱" />
      </a-form-item>
      <a-form-item label="过期时间" field="expireTime">
        <a-date-picker
          v-model="form.expireTime"
          style="width: 100%"
          value-format="YYYY-MM-DD hh:mm:ss"
        />
      </a-form-item>
      <a-form-item label="租户套餐" field="sysTenantPackageId">
        <a-select
          v-model="form.sysTenantPackageId"
          placeholder="请选择租户套餐"
        >
          <a-option
            v-for="item in tenantPackageList"
            :key="item"
            :value="item.sysTenantPackageId"
          >
            {{ item.packageName }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="!form.sysTenantId" label="用户名" field="username">
        <a-input v-model="form.username" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item v-if="!form.sysTenantId" label="密码" field="password">
        <a-input-password
          v-model="form.password"
          placeholder="请输入密码"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="备注" field="remark">
        <a-textarea v-model="form.remark" placeholder="请输入备注信息" />
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
          <template #unchecked> 禁用 </template>
        </a-switch>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="tenantAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="tenantAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useTenantAddOrEditStore } from '@/store/modules/sys/tenant/tenant/tenantAddOrEditStore';
  import { sysTenantPackageApi } from '@/api/sys/tenantPackage';

  const tenantAddOrEditStore = useTenantAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } =
    storeToRefs(tenantAddOrEditStore);

  const tenantPackageList = ref<any[]>([]);

  const emits = defineEmits(['refresh']);

  const handleStatusChange = (value: any, ev: Event) => {
    form.value.status = value ? 1 : 0;
  };

  const listTenantPackege = async () => {
    const res = await sysTenantPackageApi.getList({});
    tenantPackageList.value = res.data || [];
  };

  onMounted(() => {
    listTenantPackege();
  });

  defineExpose({
    init: tenantAddOrEditStore.init,
    form,
  });
</script>

<style lang="less" scoped>
  .custom-radio-card {
    padding: 10px 16px;
    border: 1px solid var(--color-border-2);
    border-radius: 4px;
    width: 250px;
    box-sizing: border-box;
  }

  .custom-radio-card-mask {
    height: 14px;
    width: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 1px solid var(--color-border-2);
    box-sizing: border-box;
  }

  .custom-radio-card-mask-dot {
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }

  .custom-radio-card-title {
    color: var(--color-text-1);
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .custom-radio-card:hover,
  .custom-radio-card-checked,
  .custom-radio-card:hover .custom-radio-card-mask,
  .custom-radio-card-checked .custom-radio-card-mask {
    border-color: rgb(var(--primary-6));
  }

  .custom-radio-card-checked {
    background-color: var(--color-primary-light-1);
  }

  .custom-radio-card:hover .custom-radio-card-title,
  .custom-radio-card-checked .custom-radio-card-title {
    color: rgb(var(--primary-6));
  }

  .custom-radio-card-checked .custom-radio-card-mask-dot {
    background-color: rgb(var(--primary-6));
  }
</style>
