<template>
  <a-card class="general-card">
    <template #title> 审批 </template>
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item label="审批人" field="approvalLawyerList">
          <a-select
            v-model="form.approvalLawyerList"
            placeholder="请选择审批人"
            multiple
            allow-search
          >
            <a-option
              v-for="item in approvalUsers"
              :key="item.sysUserId"
              :value="item.sysUserId"
              >{{ item.realName }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form, approvalUsers } = storeToRefs(infoAddOrEditStore);

  onMounted(() => {
    infoAddOrEditStore.loadApprovalUsers();
  });
</script>
