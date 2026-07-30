<template>
  <a-card class="general-card">
    <template #title> 团队信息 </template>
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item label="承接律师" field="undertakeLawyer">
          <a-select
            v-model="form.caseTeam.undertakeLawyer"
            placeholder="请选择承接律师"
            allow-search
          >
            <a-option
              v-for="item in userList"
              :key="item.sysUserId"
              :value="item.sysUserId"
              >{{ item.realName }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="协接律师" field="coordinatingLawyer">
          <a-select
            v-model="form.caseTeam.coordinatingLawyer"
            placeholder="请选择协接律师"
            multiple
            allow-search
          >
            <a-option
              v-for="item in userList"
              :key="item.sysUserId"
              :value="item.sysUserId"
              >{{ item.realName }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="主办律师" field="leadLawyer">
          <a-select
            v-model="form.caseTeam.leadLawyer"
            placeholder="请选择主办律师"
            multiple
            allow-search
          >
            <a-option
              v-for="item in userList"
              :key="item.sysUserId"
              :value="item.sysUserId"
              >{{ item.realName }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="协办人员" field="coOrganizer">
          <a-select
            v-model="form.caseTeam.coOrganizer"
            placeholder="请选择协办人员"
            multiple
            allow-search
          >
            <a-option
              v-for="item in userList"
              :key="item.sysUserId"
              :value="item.sysUserId"
              >{{ item.realName }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="助理" field="assistant">
          <a-select
            v-model="form.caseTeam.assistant"
            placeholder="请选择助理"
            multiple
            allow-search
          >
            <a-option
              v-for="item in userList"
              :key="item.sysUserId"
              :value="item.sysUserId"
              >{{ item.realName }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="秘书" field="secretary">
          <a-select
            v-model="form.caseTeam.secretary"
            placeholder="请选择秘书"
            multiple
            allow-search
          >
            <a-option
              v-for="item in userList"
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
  import { useUserStore } from '@/store/modules/sys/user/userStore';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form } = storeToRefs(infoAddOrEditStore);

  const userList = computed(() => useUserStore().userList);
</script>
