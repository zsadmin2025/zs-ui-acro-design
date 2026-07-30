<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="listAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.caseListId ? '新增结案目录' : '修改结案目录' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="案件类型" field="caseType">
        <a-cascader
          v-model="form.caseType"
          :options="caseType"
          :field-names="{ value: 'dictValue', label: 'dictLabel' }"
          placeholder="请选择案件类型"
          :alllow-clear="true"
        />
      </a-form-item>
      <a-form-item label="文件名称" field="fileName">
        <a-input v-model="form.fileName" placeholder="请输入文件名" />
      </a-form-item>
      <a-form-item label="文件地址" field="fileUrl">
        <zs-upload-files
          v-model="filesList"
          :limit="1"
          style="width: 100%"
          @add="handleAddFile"
          @remove="handleRemoveFile"
        />
      </a-form-item>
      <a-form-item label="结案是否必填" field="isRequired">
        <a-switch
          :checked-value="true"
          :unchecked-value="false"
          type="round"
          :default-checked="form.isRequired === 1"
          @change="handleRequiredChange"
        >
          <template #checked> 是</template>
          <template #unchecked> 否</template>
        </a-switch>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="listAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="listAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useListAddOrEditStore } from '@/store/modules/lawyer/basic/casesList/listAddOrEditStore';
  import { storeToRefs } from 'pinia';
  import { useDicts } from '@/hooks/dict';

  const listAddOrEditStore = useListAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules, filesList } =
    storeToRefs(listAddOrEditStore);

  const { caseType } = useDicts('caseType');

  const emits = defineEmits(['refresh']);

  const handleRequiredChange = (value: any, ev: Event) => {
    form.value.isRequired = value ? 1 : 0;
  };

  const handleAddFile = (fileItem: any) => {
    form.value.fileUrl = fileItem.fileUrl;
    form.value.fileOriginalName = fileItem.fileOriginalName;
    form.value.fileSize = fileItem.fileSize;
    form.value.fileType = fileItem.fileType;
  };

  const handleRemoveFile = (fileItem: any) => {
    form.value.fileUrl = '';
    form.value.fileOriginalName = '';
    form.value.fileSize = undefined;
    form.value.fileType = '';
  };
  onMounted(() => {});
  defineExpose({
    init: listAddOrEditStore.init,
    form,
  });
</script>
