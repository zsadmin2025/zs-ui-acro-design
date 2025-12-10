<template>
  <div class="sms-container">
    <a-card :bordered="false">
      <a-radio-group v-model="smsForm.type" direction="horizontal">
        <a-radio :value="1">阿里云</a-radio>
        <a-radio :value="2">腾讯云</a-radio>
      </a-radio-group>
      <a-form ref="smsRef" :rules="rules" :model="smsForm" auto-label-width>
        <div v-if="smsForm.type === 1" style="margin-top: 16px; color: #888">
          <a-form-item label="Access Key ID" field="aliyun.accessKeyId">
            <a-input
              v-model="smsForm.aliyun.accessKeyId"
              placeholder="请输入Access Key ID"
            />
          </a-form-item>
          <a-form-item label="Access Key Secret" field="aliyun.accessKeySecret">
            <a-input
              v-model="smsForm.aliyun.accessKeySecret"
              placeholder="请输入Access Key Secret"
            />
          </a-form-item>
          <a-form-item label="Endpoint" field="aliyun.endpoint">
            <a-input
              v-model="smsForm.aliyun.endpoint"
              placeholder="请输入EndPoint"
            />
          </a-form-item>
        </div>
      </a-form>
      <!-- 操作按钮 -->
      <div :style="{ marginTop: '24px' }">
        <a-button
          type="primary"
          style="margin-right: 8px"
          :loading="loading"
          @click="smsStore.submit()"
        >
          <template #icon>
            <icon-save />
          </template>
          保存
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useSmsStore } from '@/store/modules/sys/config/sms/smsStore';

  const smsStore = useSmsStore();
  const { smsForm, smsRef, loading } = storeToRefs(smsStore);

  const rules = {
    'type': [{ required: true, message: '请选择存储类型' }],
    'aliyun.accessKeyId': [{ required: true, message: '请输入Access Key ID' }],
    'aliyun.accessKeySecret': [
      { required: true, message: '请输入Access Key Secret' },
    ],
    'aliyun.endpoint': [{ required: true, message: '请输入EndPoint' }],
  };

  onMounted(async () => {
    await smsStore.init();
  });
</script>

<style scoped>
  .sms-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .sms-container > .arco-card {
    max-width: 100%;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .sms-container {
      max-width: 768px;
    }
  }

  @media (min-width: 1200px) {
    .sms-container {
      max-width: 900px;
    }
  }
</style>
