<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="messagesAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysMessageId ? '新增消息' : '修改消息' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="消息类型" field="type">
        <a-select v-model="form.type" placeholder="请选择消息类型">
          <a-option :value="1">站内信</a-option>
          <a-option :value="2">通知</a-option>
          <a-option :value="3">待办</a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="接收用户" field="receiverId">
        <ZsSelectUser
          v-model="form.receiverId"
          :multiple="false"
          @on-select="handleSelect"
        />
      </a-form-item>
      <a-form-item label="主题" field="title">
        <a-input v-model="form.title" placeholder="请输入主题" />
      </a-form-item>
      <a-form-item label="内容" field="content">
        <ZsEditor v-model="form.content" @change="handleEditorChange" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="messagesAddOrEditStore.close">取消</a-button>
        <a-button type="primary" :loading="loading" @click="send">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useMessagesAddOrEditStore } from '@/store/modules/sys/messages/message/messagesAddOrEditStore';
  import { useWebsocketStore } from '@/store/modules/common/websocketStore';

  const messagesAddOrEditStore = useMessagesAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } = storeToRefs(
    messagesAddOrEditStore,
  );

  const emits = defineEmits(['refresh']);

  const handleSelect = (val: any) => {
    form.value.receiverName = val?.realName ?? '';
  };

  const handleEditorChange = (val: string) => {
    form.value.content = val;
  };

  const send = async () => {
    const { receiverId } = form.value;
    const { content } = form.value;
    await messagesAddOrEditStore.submit(emits);

    if (receiverId) {
      useWebsocketStore().sendUser(receiverId, content);
    }
  };

  defineExpose({
    init: messagesAddOrEditStore.init,
    form,
  });
</script>
