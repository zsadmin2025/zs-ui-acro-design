<template>
  <a-modal
    v-model:visible="resetPasswordVisible"
    width="30%"
    title-align="start"
    :draggable="true"
    :mask-closable="false"
    @cancel="useUserResetPasswordStore.resetPasswordCancel"
  >
    <template #title>
      <h4> 密码重置 </h4>
    </template>
    <a-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="useUserResetPasswordStore.passwordRules"
      auto-label-width
    >
      <a-form-item label="新密码" field="password">
        <a-input
          v-model="passwordForm.password"
          placeholder="请输入新密码"
          type="password"
        ></a-input>
      </a-form-item>
      <a-form-item label="确认密码" field="confirmPassword">
        <a-input
          v-model="passwordForm.confirmPassword"
          placeholder="请再次输入新密码"
          type="password"
        ></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="useUserResetPasswordStore.resetPasswordCancel"
          >取消</a-button
        >
        <a-button
          type="primary"
          :loading="loading"
          @click="useUserResetPasswordStore.resetPassword"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/sys/user/userStore';

  const useUserResetPasswordStore = useUserStore();
  const { resetPasswordVisible, passwordForm, passwordFormRef, loading } =
    storeToRefs(useUserResetPasswordStore);
</script>
