<template>
  <a-modal
    v-model:visible="smsSendVisible"
    title="发送短信"
    title-align="start"
    width="800px"
    :draggable="true"
  >
    <!-- 短信模板信息展示区 -->
    <a-alert :show-icon="false">
      <a-descriptions
        :column="1"
        :label-style="{ fontWeight: 600, width: '100px' }"
        :content-style="{ flex: 1 }"
      >
        <a-descriptions-item label="模板编号">
          {{ form.templateNumber || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="服务商通道">
          {{ form.channel || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="签名">
          {{ form.signName || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="模板CODE">
          {{ form.templateCode || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="模板内容">
          <div class="template-content">
            {{ form.templateContent || '暂无模板内容' }}
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-alert>
    <a-divider>发送信息</a-divider>
    <a-form
      ref="smsSendRef"
      :model="smsSendForm"
      :rules="rules"
      auto-label-width
    >
      <a-form-item label="手机号" name="phoneNumbers" field="phoneNumbers">
        <a-input-tag
          v-model="smsSendForm.phoneNumbers"
          placeholder="请输入手机号后按回车键Enter确认"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="参数" name="templateParam" field="templateParam">
        <a-textarea
          v-model="smsSendForm.templateParam"
          placeholder='请将上述短信内容中的${}参数更改为JSON格式参数，例如：{"name":"张三","code":"123456"}'
          :auto-size="{
            minRows: 2,
            maxRows: 5,
          }"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" :loading="loading" @click="send">发送</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useTemplateStore } from '@/store/modules/sys/messages/sms/smsTemplateStore';

  const loading = ref(false);
  const templateStore = useTemplateStore();

  const smsSendVisible = ref(false);

  const { smsSendRef } = storeToRefs(templateStore);
  const form = ref({
    phoneNumbers: [],
    templateNumber: '',
    channel: '',
    signName: '',
    templateCode: '',
    templateContent: '',
  });

  const smsSendForm = ref({
    phoneNumbers: [],
    templateNumber: '',
    templateParam: '',
  });

  const rules = {
    phoneNumbers: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
    ],
    templateParam: [{ required: true, message: '请输入参数', trigger: 'blur' }],
  };
  const open = (record: any) => {
    smsSendVisible.value = true;
    Object.assign(form.value, record);
    smsSendForm.value.templateNumber = record.templateNumber;
  };

  const close = () => {
    smsSendVisible.value = false;
    smsSendRef.value.resetFields();
  };

  const send = async () => {
    // 防止重复提交
    if (loading.value) return;

    try {
      if (!smsSendRef.value) return;
      if (await smsSendRef.value.validate()) {
        return;
      }

      templateStore.handleSend(smsSendForm.value);
    } catch (error) {
      // const errorMessage = error instanceof Error ? error.message : '未知错误';
      // Message.error(errorMessage);
    } finally {
      close();
      loading.value = false;
    }
  };

  defineExpose({
    open,
  });
</script>
