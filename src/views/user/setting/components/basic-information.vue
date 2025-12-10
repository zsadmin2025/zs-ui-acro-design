<template>
  <a-form
    ref="formRef"
    :model="user"
    :rules="rules"
    class="form"
    label-width-auto
  >
    <a-form-item field="username" label="登录账号">
      <a-input v-model="user.username" placeholder="请输入账号" disabled />
    </a-form-item>
    <a-form-item field="realName" label="真实姓名">
      <a-input v-model="user.realName" placeholder="请输入真实姓名" />
    </a-form-item>
    <a-form-item field="phone" label="手机号">
      <a-input v-model="user.phone" placeholder="请输入手机号" />
    </a-form-item>
    <a-form-item field="email" label="邮箱">
      <a-input v-model="user.email" placeholder="请输入邮箱" />
    </a-form-item>
    <a-form-item field="age" label="年龄">
      <a-input-number
        v-model="user.age"
        placeholder="请输入年龄"
        :min="0"
        :max="200"
      />
    </a-form-item>
    <a-form-item label="性别" field="sex">
      <a-select v-model="user.sex">
        <a-option :value="0" label="男"></a-option>
        <a-option :value="1" label="女"></a-option>
      </a-select>
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          <template #default>保存</template>
          <template #icon>
            <icon-save />
          </template>
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { useUserStore } from '@/store';

  const formRef = ref<FormInstance>();

  const userStore = useUserStore();
  const { user } = userStore;

  const rules = {
    username: [
      {
        required: true,
        message: '请输入登录账号',
        trigger: ['blur', 'change'],
      },
    ],
    realName: [
      {
        required: true,
        message: '请输入真实姓名',
        trigger: ['blur', 'change'],
      },
    ],
    phone: [
      {
        required: true,
        message: '请输入手机号',
        trigger: ['blur', 'change'],
      },
      {
        validator: (value: any, callback: (error?: string) => void) => {
          // 手机号正则表达式：假设中国大陆手机号为11位数字且以1开头
          const phoneRegex = /^1[3456789]\d{9}$/;
          if (phoneRegex.test(value)) {
            callback();
          } else {
            callback('请输入正确的手机号');
          }
        },
      },
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        trigger: ['blur', 'change'],
      },
      {
        validator: (value: any, callback: (error?: string) => void) => {
          // 邮箱正则表达式
          const emailRegex =
            /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (emailRegex.test(value)) {
            callback();
          } else {
            callback('请输入正确的邮箱');
          }
        },
      },
    ],
    age: [
      {
        required: true,
        message: '请输入年龄',
        trigger: ['blur', 'change'],
      },
    ],
    sex: [
      {
        required: true,
        message: '请选择性别',
        trigger: ['blur', 'change'],
      },
    ],
  };

  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      // 验证通过，更新 store 或调用 API
      userStore.updateUserInfo(user);
      Message.success('更新成功');
    }
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
  }
</style>
