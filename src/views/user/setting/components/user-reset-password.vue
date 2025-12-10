<template>
  <a-modal
    :visible="props.visible"
    title="重置密码"
    @ok="resetPasswordSave"
    @cancel="resetPasswordCancel"
  >
    <a-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      auto-label-width
    >
      <a-form-item label="新密码" field="password" validate-trigger="blur">
        <a-input
          v-model="passwordForm.password"
          placeholder="请输入新密码"
          type="password"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        field="confirmPassword"
        validate-trigger="blur"
      >
        <a-input
          v-model="passwordForm.confirmPassword"
          placeholder="请输入确认密码"
          type="password"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="resetPasswordCancel">取消</a-button>
      <a-button type="primary" @click="resetPasswordSave">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { FormInstance } from '@arco-design/web-vue';
  import { reactive, ref } from 'vue';
  import { sysUserApi } from '@/api/sys/user';
  import { useUserStore } from '@/store';

  const userStore = useUserStore();

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });

  // 定义 emits 来触发关闭事件
  const emit = defineEmits(['update:visible']);
  const passwordFormRef = ref<FormInstance | null>(null);
  const passwordForm = reactive({
    sysUserId: userStore.user.sysUserId,
    password: '',
    confirmPassword: '',
  });

  const passwordRules = {
    password: [
      { required: true, message: '请输入密码' },
      {
        validator: (value: any, callback: (error?: string) => void) => {
          // 手机号正则表达式：假设中国大陆手机号为11位数字且以1开头
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#!%^*?&+-])[A-Za-z\d$@#!%^*?&+-]{8,}/;
          if (regex.test(value)) {
            callback();
          } else {
            callback('密码应当至少8位且含有数字、大小写字母及特殊字符');
          }
        },
      },
    ],
    confirmPassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      {
        validator: (value: string, callback: any) => {
          if (value && value !== passwordForm.password) {
            callback('两次输入密码不一致!');
          } else {
            callback();
          }
        },
      },
      {
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#!%^*?&+-])[A-Za-z\d$@#!%^*?&+-]{8,}/,
        message: '密码应当至少8位且含有数字、大小写字母及特殊字符',
        trigger: 'blur',
      },
    ],
  };

  const resetPasswordVisible = ref(false);

  const resetPasswordSave = async () => {
    if (!passwordFormRef.value) return;
    if (await passwordFormRef.value.validate()) {
      return;
    }
    // 发送请求
    await sysUserApi.resetPassword(passwordForm);
    emit('update:visible', false); // 正确方式：通知父组件更新 visible
  };

  const resetPasswordCancel = () => {
    emit('update:visible', false); // 正确方式：通知父组件更新 visible
  };

  defineExpose({
    passwordForm,
    resetPasswordVisible,
  });
</script>
