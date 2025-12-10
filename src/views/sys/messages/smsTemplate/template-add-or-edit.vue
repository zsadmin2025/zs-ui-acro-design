<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="templateAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.sysSmsTemplateId ? '新增短信模板' : '修改短信模板' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="模板编号" field="templateNumber">
        <a-input v-model="form.templateNumber" placeholder="请输入模板编号" />
      </a-form-item>
      <a-form-item label="服务商" field="channel">
        <a-select v-model="form.channel" placeholder="请选择短信通道/服务商">
          <a-option
            v-for="item in smsCarrier"
            :key="item.dictValue"
            :value="item.dictValue"
          >
            {{ item.dictLabel }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item label="短信签名" field="signName">
        <a-input v-model="form.signName" placeholder="请输入短信签名" />
      </a-form-item>
      <a-form-item label="短信模板code" field="templateCode">
        <a-input v-model="form.templateCode" placeholder="请输入短信模板code" />
      </a-form-item>
      <a-form-item label="短信模板内容" field="templateContent">
        <a-textarea
          v-model="form.templateContent"
          placeholder="请输入短信模板内容"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="templateAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="templateAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useTemplateAddOrEditStore } from '@/store/modules/sys/messages/sms/smsTemplateAddOrEditStore';
  import useDict from '@/hooks/dict';
  import { DictData } from '@/types/sys/dict/DictData';

  // 短信服务商
  const smsCarrier = ref<DictData[]>([]);

  const templateAddOrEditStore = useTemplateAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } = storeToRefs(
    templateAddOrEditStore,
  );

  const emits = defineEmits(['refresh']);

  async function loadDicts() {
    smsCarrier.value = await useDict('smsCarrier');
  }

  onMounted(() => {
    loadDicts();
  });

  defineExpose({
    init: templateAddOrEditStore.init,
    form,
  });
</script>
