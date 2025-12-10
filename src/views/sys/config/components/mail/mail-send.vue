<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    :mask-closable="false"
    :esc-to-close="false"
    @cancel="mailTasksAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysMailTasksId ? '新增邮件任务' : '修改邮件任务' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="收件人" field="recipients">
        <a-input-tag
          v-model="form.recipients"
          placeholder="请输入收件人列表"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="抄送" field="cc">
        <a-input-tag
          v-model="form.cc"
          placeholder="请输入抄送列表"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="密送" field="bcc">
        <a-input-tag
          v-model="form.bcc"
          placeholder="请输入密送列表"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="主题" field="subject">
        <a-input v-model="form.subject" placeholder="请输入主题" />
      </a-form-item>
      <a-form-item label="正文" field="content">
        <ZsEditor v-model="form.content" @change="handleEditorChange" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="mailTasksAddOrEditStore.close">
          <template #icon>
            <icon-close />
          </template>

          取消</a-button
        >
        <a-button
          type="primary"
          :loading="loading"
          status="warning"
          @click="mailTasksAddOrEditStore.submit(emits)"
        >
          <template #icon>
            <icon-save />
          </template>
          保存草稿
        </a-button>
        <a-button
          v-if="form.status === null"
          type="primary"
          :loading="sendLoading"
          @click="mailTasksAddOrEditStore.sendNow(emits)"
        >
          <template #icon>
            <icon-send />
          </template>
          立即发送
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useMailTasksAddOrEditStore } from '@/store/modules/sys/mail/mailTasksAddOrEditStore';

  const mailTasksAddOrEditStore = useMailTasksAddOrEditStore();
  const { form, dialogFormVisible, loading, sendLoading, formRef, rules } =
    storeToRefs(mailTasksAddOrEditStore);

  const emits = defineEmits(['refresh']);

  const handleEditorChange = (val: string) => {
    form.value.content = val;
  };

  defineExpose({
    init: mailTasksAddOrEditStore.init,
    form,
  });
</script>
