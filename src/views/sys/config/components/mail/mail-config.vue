<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    :mask-closable="false"
    :esc-to-close="false"
  >
    <template #title>
      <h4> 邮件配置</h4>
    </template>
    <a-form ref="formRef" :model="mail" :rules="rules" auto-label-width>
      <a-form-item label="SMTP地址" field="host">
        <a-input v-model="mail.host" placeholder="请输入SMTP地址" />
      </a-form-item>
      <a-form-item label="端口" field="port">
        <a-input v-model="mail.port" placeholder="请输入端口" />
      </a-form-item>
      <a-form-item label="发件人" field="username">
        <a-input v-model="mail.username" placeholder="请输入发件人" />
      </a-form-item>
      <a-form-item label="授权码" field="password">
        <a-input v-model="mail.password" placeholder="请输入授权码" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button type="primary" @click="onSave()">
          <template #icon>
            <icon-save />
          </template>
          保存
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { mailStore } from '@/store/modules/sys/config/mail/mailStore';
  import { Message } from '@arco-design/web-vue';

  const useMailStore = mailStore();
  const { mail, formRef, rules } = storeToRefs(useMailStore);

  const dialogFormVisible = ref(false);
  const onSave = async () => {
    dialogFormVisible.value = false;
    await useMailStore.save();

    // 弹窗提示
    Message.success({
      content: '保存成功',
      duration: 2000,
    });
  };

  const init = () => {
    dialogFormVisible.value = true;
    useMailStore.init();
  };

  defineExpose({
    init,
  });
</script>

<style scoped>
  .mail-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .mail-container > .arco-card {
    max-width: 100%;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .mail-container {
      max-width: 768px;
    }
  }

  @media (min-width: 1200px) {
    .mail-container {
      max-width: 900px;
    }
  }
</style>
