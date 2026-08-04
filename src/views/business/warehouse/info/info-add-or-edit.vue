<template>
  <a-drawer
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    :esc-to-close="false"
    @cancel="infoAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.warehouseInfoId ? '新增库房' : '修改库房' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <zs-section title="基本信息">
        <a-form-item label="库房编号" field="warehouseCode">
          <a-input
            v-model="form.warehouseCode"
            placeholder="请输入库房编号"
            :max-length="100"
          />
        </a-form-item>
        <a-form-item label="库房名称" field="warehouseName">
          <a-input
            v-model="form.warehouseName"
            placeholder="请输入库房名称"
            :max-length="100"
          />
        </a-form-item>
        <a-form-item label="库房地址" field="warehouseAddress">
          <a-input
            v-model="form.warehouseAddress"
            placeholder="请输入库房地址"
            :max-length="255"
          />
        </a-form-item>
        <a-form-item label="所属机构" field="institutionId">
          <a-tree-select
            v-model="form.institutionId"
            :data="deptTree"
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
        <a-form-item label="库房面积" field="warehouseArea">
          <a-input-number
            v-model="form.warehouseArea"
            placeholder="请输入库房面积"
            :min="0"
          />
        </a-form-item>
        <a-form-item label="库房类型" field="warehouseType">
          <a-select
            v-model="form.warehouseType"
            placeholder="请选择库房类型"
            allow-clear
          >
            <a-option
              v-for="item in warehouseType"
              :key="item.dictValue"
              :value="item.dictValue"
              >{{ item.dictLabel }}</a-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="货位数量" field="locationCount">
          <a-input-number
            v-model="form.locationCount"
            placeholder="请输入货位数量"
            :min="0"
          />
        </a-form-item>
        <a-form-item label="货架数量" field="shelfCount">
          <a-input-number
            v-model="form.shelfCount"
            :min="0"
            placeholder="请输入货架数量"
          />
        </a-form-item>
        <a-form-item label="管理员" field="managerUserId">
          <a-select
            v-model="form.managerUserId"
            placeholder="请选择管理员"
            allow-clear
          >
            <a-option
              v-for="item in userList"
              :key="item.sysUserId"
              :value="item.sysUserId"
            >
              {{ item.realName }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系方式" field="contactInfo">
          <a-input
            v-model="form.contactInfo"
            placeholder="请输入联系方式"
            :max-length="20"
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
        <a-form-item label="备注" field="remark">
          <a-textarea
            v-model="form.remark"
            placeholder="请输入备注"
            :max-length="255"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </zs-section>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="infoAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="infoAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useInfoAddOrEditStore } from '@/store/modules/business/warehouse/info/infoAddOrEditStore';
  import { useUserAddOrEditStore } from '@/store/modules/sys/user/userAddOrEditStore';
  import { useUserStore } from '@/store/modules/sys/user/userStore';
  import { useDicts } from '@/hooks/dict';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } =
    storeToRefs(infoAddOrEditStore);

  const { deptTree } = storeToRefs(useUserAddOrEditStore());

  const { userList } = storeToRefs(useUserStore());

  const { warehouseType } = useDicts('warehouseType');

  const emits = defineEmits(['refresh']);

  onMounted(async () => {
    await useUserAddOrEditStore().getDeptList();
    await useUserStore().loadUserList();
  });

  defineExpose({
    init: infoAddOrEditStore.init,
    form,
  });
</script>
