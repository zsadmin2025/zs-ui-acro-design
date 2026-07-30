<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #main>
        <a-card class="general-card">
          <template #title> 审批配置 </template>
          <a-form ref="formRef" :model="form" auto-label-width>
            <a-form-item field="multiSelect" label="立案审批角色">
              <a-select
                v-model="form.registrationApprovalRoles"
                placeholder="请选择角色"
                :allow-clear="true"
                :multiple="true"
                :max-tag-count="2"
              >
                <a-option
                  v-for="item in roleData"
                  :key="item.sysRoleId"
                  :value="item.sysRoleId"
                  :label="item.roleName"
                >
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="multiSelect" label="结案审批角色">
              <a-select
                v-model="form.closingApprovalRoles"
                placeholder="请选择角色"
                :allow-clear="true"
                :multiple="true"
                :max-tag-count="2"
              >
                <a-option
                  v-for="item in roleData"
                  :key="item.sysRoleId"
                  :value="item.sysRoleId"
                  :label="item.roleName"
                >
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="multiSelect" label="用章审批角色">
              <a-select
                v-model="form.usingChapterApprovalRoles"
                placeholder="请选择角色"
                :allow-clear="true"
                :multiple="true"
                :max-tag-count="2"
              >
                <a-option
                  v-for="item in roleData"
                  :key="item.sysRoleId"
                  :value="item.sysRoleId"
                  :label="item.roleName"
                >
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="isApproval" label="案件审批">
              <a-switch
                :checked-value="true"
                :unchecked-value="false"
                type="round"
                :default-checked="form.isApproval === 1"
                @change="handleApprovalChange"
              >
                <template #checked> 开启</template>
                <template #unchecked> 关闭 </template>
              </a-switch>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button
                  type="primary"
                  :loading="loading"
                  @click="approvalStore.submit()"
                >
                  保存
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { onMounted } from 'vue';
  import { useApprovalStore } from '@/store/modules/lawyer/basic/approval/approvalStore';
  import { useRoleStore } from '@/store/modules/sys/role/roleStore';

  const approvalStore = useApprovalStore();
  const { form, loading } = storeToRefs(approvalStore);

  const roleStore = useRoleStore();
  const { roleData } = storeToRefs(roleStore);

  const handleApprovalChange = (value: any, ev: Event) => {
    form.value.isApproval = value ? 1 : 0;
  };
  onMounted(() => {
    roleStore.loadRoleList();
    approvalStore.loadInfo();
  });
</script>
