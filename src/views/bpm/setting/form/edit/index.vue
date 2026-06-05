<template>
  <div class="form-edit">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-page-header
          :title="isEdit ? '编辑表单' : '新建表单'"
          @back="router.back()"
        >
          <template #subtitle>
            <a-tag v-if="isEdit" color="arcoblue">ID: {{ formId }}</a-tag>
          </template>
        </a-page-header>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12">
            <a-space>
              <a-button @click="handleSave">
                <template #icon><icon-save /></template>
                保存
              </a-button>
              <a-button
                v-if="isEdit"
                type="primary"
                status="success"
                @click="handlePublish"
              >
                <template #icon><icon-send /></template>
                发布
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-spin :loading="pageLoading" style="width: 100%">
          <a-form ref="formRef" :model="form" auto-label-width>
            <a-card title="基本信息" style="margin-bottom: 16px">
              <a-form-item
                label="表单名称"
                field="formName"
                :rules="[{ required: true, message: '请输入表单名称' }]"
              >
                <a-input v-model="form.formName" placeholder="请输入表单名称" />
              </a-form-item>
              <a-form-item
                label="表单Key"
                field="formKey"
                :rules="[{ required: true, message: '请输入表单Key' }]"
              >
                <a-input
                  v-model="form.formKey"
                  placeholder="请输入表单Key"
                  :disabled="isEdit"
                />
              </a-form-item>
              <a-form-item label="描述" field="description">
                <a-textarea
                  v-model="form.description"
                  placeholder="请输入描述"
                  :auto-size="{ minRows: 2 }"
                />
              </a-form-item>
            </a-card>

            <a-card title="表单设计" style="margin-bottom: 16px">
              <template #extra>
                <a-space>
                  <a-button size="small" @click="addTextField">
                    <template #icon><icon-font-size /></template>
                    文本
                  </a-button>
                  <a-button size="small" @click="addSelectField">
                    <template #icon><icon-list /></template>
                    下拉
                  </a-button>
                  <a-button size="small" @click="addDateField">
                    <template #icon><icon-calendar /></template>
                    日期
                  </a-button>
                  <a-button size="small" @click="addTextareaField">
                    <template #icon><icon-text /></template>
                    多行文本
                  </a-button>
                  <a-button size="small" @click="addNumberField">
                    <template #icon><icon-number /></template>
                    数字
                  </a-button>
                </a-space>
              </template>

              <div v-if="formFields.length === 0" class="designer-empty">
                <a-empty description="点击上方按钮添加表单字段" />
              </div>

              <div v-else class="designer-fields">
                <a-table
                  :data="formFields"
                  :columns="fieldColumns"
                  :pagination="false"
                  :bordered="true"
                  size="small"
                >
                  <template #operations="{ rowIndex }">
                    <a-space size="mini">
                      <a-button
                        size="mini"
                        :disabled="rowIndex === 0"
                        @click="moveFieldUp(rowIndex)"
                      >
                        <template #icon><icon-up /></template>
                      </a-button>
                      <a-button
                        size="mini"
                        :disabled="rowIndex === formFields.length - 1"
                        @click="moveFieldDown(rowIndex)"
                      >
                        <template #icon><icon-down /></template>
                      </a-button>
                      <a-button
                        size="mini"
                        status="danger"
                        @click="removeField(rowIndex)"
                      >
                        <template #icon><icon-delete /></template>
                      </a-button>
                    </a-space>
                  </template>
                </a-table>
              </div>
            </a-card>
          </a-form>
        </a-spin>
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { bpmSettingApi } from '@/api/bpm/setting';
  import type { FormField } from '@/types/bpm/bpmTypes';

  const router = useRouter();
  const route = useRoute();

  const formId = ref<string>('');
  const isEdit = computed(() => !!formId.value);
  const pageLoading = ref(false);
  const formRef = ref();

  const form = reactive({
    formName: '',
    formKey: '',
    description: '',
  });

  const formFields = ref<FormField[]>([]);
  const fieldIdCounter = ref(0);

  const fieldColumns = [
    { title: '字段名称', dataIndex: 'label', width: 150, ellipsis: true },
    { title: '字段标识', dataIndex: 'name', width: 150, ellipsis: true },
    { title: '字段类型', dataIndex: 'type', width: 100 },
    {
      title: '必填',
      dataIndex: 'required',
      width: 60,
      render: ({ record }: any) => (record.required ? '是' : '否'),
    },
    { title: '默认值', dataIndex: 'defaultValue', width: 100 },
    { title: '操作', slotName: 'operations', width: 160, align: 'center' },
  ];

  const loadFormDetail = async () => {
    pageLoading.value = true;
    try {
      const { data } = await bpmSettingApi.getFormById(formId.value);
      const detail = data?.data ?? data;
      form.formName = detail.formName ?? '';
      form.formKey = detail.formKey ?? '';
      form.description = detail.description ?? '';
      formFields.value = detail.formSchema?.fields ?? [];
    } finally {
      pageLoading.value = false;
    }
  };

  // 初始化
  onMounted(async () => {
    if (route.query.id) {
      formId.value = route.query.id as string;
      await loadFormDetail();
    }
  });

  const addTextField = () => {
    fieldIdCounter.value += 1;
    const name = `field_${Date.now()}`;
    formFields.value.push({
      name,
      label: `文本字段${fieldIdCounter.value}`,
      type: 'INPUT_TEXT',
      required: false,
      placeholder: '请输入',
      props: { colSpan: 24 },
    });
  };

  const addSelectField = () => {
    fieldIdCounter.value += 1;
    const name = `field_${Date.now()}`;
    formFields.value.push({
      name,
      label: `下拉字段${fieldIdCounter.value}`,
      type: 'SELECT_SINGLE',
      required: false,
      placeholder: '请选择',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
      props: { colSpan: 24 },
    });
  };

  const addDateField = () => {
    fieldIdCounter.value += 1;
    const name = `field_${Date.now()}`;
    formFields.value.push({
      name,
      label: `日期字段${fieldIdCounter.value}`,
      type: 'DATE_PICKER',
      required: false,
      props: { colSpan: 24 },
    });
  };

  const addTextareaField = () => {
    fieldIdCounter.value += 1;
    const name = `field_${Date.now()}`;
    formFields.value.push({
      name,
      label: `多行文本${fieldIdCounter.value}`,
      type: 'INPUT_TEXTAREA',
      required: false,
      placeholder: '请输入',
      props: { colSpan: 24 },
    });
  };

  const addNumberField = () => {
    fieldIdCounter.value += 1;
    const name = `field_${Date.now()}`;
    formFields.value.push({
      name,
      label: `数字字段${fieldIdCounter.value}`,
      type: 'INPUT_NUMBER',
      required: false,
      placeholder: '请输入数字',
      props: { colSpan: 24 },
    });
  };

  const moveFieldUp = (index: number) => {
    if (index <= 0) return;
    const temp = formFields.value[index];
    formFields.value[index] = formFields.value[index - 1];
    formFields.value[index - 1] = temp;
  };

  const moveFieldDown = (index: number) => {
    if (index >= formFields.value.length - 1) return;
    const temp = formFields.value[index];
    formFields.value[index] = formFields.value[index + 1];
    formFields.value[index + 1] = temp;
  };

  const removeField = (index: number) => {
    formFields.value.splice(index, 1);
  };

  const handleSave = async () => {
    const errors = await formRef.value?.validate();
    if (errors) return;

    const payload = {
      formName: form.formName,
      formKey: form.formKey,
      description: form.description,
      formSchema: {
        fields: formFields.value,
        fieldGroups: [],
        formConfig: { labelWidth: 100 },
      },
    };

    try {
      if (isEdit.value) {
        await bpmSettingApi.updateForm({ id: formId.value, ...payload });
        Message.success('保存成功');
      } else {
        await bpmSettingApi.saveForm(payload);
        Message.success('创建成功');
        router.back();
      }
    } catch {
      // handled by interceptor
    }
  };

  const handlePublish = async () => {
    try {
      await bpmSettingApi.publishForm(formId.value);
      Message.success('发布成功');
    } catch {
      // handled by interceptor
    }
  };
</script>

<style lang="less" scoped>
  .form-edit {
    height: 100%;

    .designer-empty {
      padding: 60px 0;
    }

    .designer-fields {
      :deep(.arco-table-th) {
        background-color: var(--color-fill-2);
      }
    }
  }
</style>
