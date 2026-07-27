<template>
  <div class="dynamic-form-renderer">
    <template v-if="hasFieldGroups">
      <a-tabs v-model:active-key="activeGroup" type="card-gutter">
        <a-tab-pane
          v-for="group in schema.fieldGroups"
          :key="group.key"
          :title="group.title"
        >
          <div class="form-group-body">
            <a-form
              ref="formRef"
              :model="localFormData"
              :rules="formRules"
              :label-col-props="{ span: labelColSpan }"
              :wrapper-col-props="{ span: wrapperColSpan }"
            >
              <a-row :gutter="[16, 16]">
                <template
                  v-for="field in getGroupFields(group.key)"
                  :key="field.name"
                >
                  <a-col
                    v-if="getFieldPermission(field) !== 'HIDDEN'"
                    :span="field.props?.colSpan || 24"
                    :xs="field.props?.colXs || 24"
                    :sm="field.props?.colSm || 24"
                    :md="field.props?.colMd || 12"
                    :lg="field.props?.colLg || 8"
                    :xl="field.props?.colXl || 6"
                  >
                    <a-form-item :label="field.label" :field="field.name">
                      <component
                        :is="getFieldComponent(field.type)"
                        v-model="localFormData[field.name]"
                        v-bind="getFieldProps(field)"
                        :disabled="getFieldPermission(field) === 'READONLY'"
                      />
                    </a-form-item>
                  </a-col>
                </template>
              </a-row>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </template>
    <template v-else>
      <a-form
        ref="formRef"
        :model="localFormData"
        :rules="formRules"
        :label-col-props="{ span: labelColSpan }"
        :wrapper-col-props="{ span: wrapperColSpan }"
      >
        <a-row :gutter="[16, 16]">
          <template v-for="field in allFields" :key="field.name">
            <a-col
              v-if="getFieldPermission(field) !== 'HIDDEN'"
              :span="field.props?.colSpan || 24"
              :xs="field.props?.colXs || 24"
              :sm="field.props?.colSm || 24"
              :md="field.props?.colMd || 12"
              :lg="field.props?.colLg || 8"
              :xl="field.props?.colXl || 6"
            >
              <a-form-item :label="field.label" :field="field.name">
                <component
                  :is="getFieldComponent(field.type)"
                  v-model="localFormData[field.name]"
                  v-bind="getFieldProps(field)"
                  :disabled="getFieldPermission(field) === 'READONLY'"
                />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import type {
    FormSchema,
    FormField,
    FieldPermission,
  } from '@/types/bpm/bpmTypes';

  const props = withDefaults(
    defineProps<{
      schema: FormSchema;
      modelValue: Record<string, any>;
      fieldPermissions?: FieldPermission[];
      labelWidth?: number;
      layout?: string;
    }>(),
    {
      fieldPermissions: () => [],
      labelWidth: 100,
      layout: 'horizontal',
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Record<string, any>): void;
  }>();

  const formRef = ref();
  const localFormData = ref<Record<string, any>>({});
  const activeGroup = ref('');

  // 初始化表单数据
  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        localFormData.value = { ...val };
      }
    },
    { immediate: true, deep: true },
  );

  // 同步数据回父组件
  watch(
    localFormData,
    (val) => {
      emit('update:modelValue', { ...val });
    },
    { deep: true },
  );

  // 所有字段
  const allFields = computed<FormField[]>(() => {
    return props.schema?.fields ?? [];
  });

  // 是否有分组
  const hasFieldGroups = computed(() => {
    return !!(props.schema?.fieldGroups && props.schema.fieldGroups.length > 0);
  });

  // 初始化默认选中的分组
  watch(
    () => props.schema?.fieldGroups,
    (groups) => {
      if (groups && groups.length > 0) {
        activeGroup.value = groups[0].key;
      }
    },
    { immediate: true },
  );

  // 获取分组字段
  const getGroupFields = (groupKey: string): FormField[] => {
    return allFields.value.filter((f) => f.groupKey === groupKey);
  };

  // Label span
  const labelColSpan = computed(() => {
    return props.schema?.formConfig?.labelWidth ?? props.labelWidth
      ? undefined
      : 6;
  });

  const wrapperColSpan = computed(() => {
    return undefined;
  });

  // 根据字段类型返回组件名
  const getFieldComponent = (fieldType: string): string => {
    const componentMap: Record<string, string> = {
      INPUT_TEXT: 'a-input',
      INPUT_NUMBER: 'a-input-number',
      INPUT_TEXTAREA: 'a-textarea',
      SELECT_SINGLE: 'a-select',
      SELECT_MULTI: 'a-select',
      DATE_PICKER: 'a-date-picker',
      DATE_RANGE: 'a-range-picker',
      TIME_PICKER: 'a-time-picker',
      SWITCH: 'a-switch',
      RADIO: 'a-radio-group',
      CHECKBOX: 'a-checkbox-group',
      RATE: 'a-rate',
      SLIDER: 'a-slider',
      UPLOAD_FILE: 'a-upload',
      UPLOAD_IMAGE: 'a-upload',
    };
    return componentMap[fieldType] || 'a-input';
  };

  // 获取字段属性
  const getFieldProps = (field: FormField): Record<string, any> => {
    const fieldProps: Record<string, any> = {
      placeholder: field.placeholder || `请输入${field.label}`,
      allowClear: true,
      ...field.props,
    };

    // 根据类型设置默认属性
    switch (field.type) {
      case 'SELECT_SINGLE':
        fieldProps.options = field.options || [];
        break;
      case 'SELECT_MULTI':
        fieldProps.multiple = true;
        fieldProps.options = field.options || [];
        break;
      case 'INPUT_NUMBER':
        if (field.props?.min !== undefined) fieldProps.min = field.props.min;
        if (field.props?.max !== undefined) fieldProps.max = field.props.max;
        break;
      case 'RADIO':
      case 'CHECKBOX':
        fieldProps.options = field.options || [];
        break;
      case 'SWITCH':
        fieldProps.checkedValue = field.props?.checkedValue ?? 1;
        fieldProps.uncheckedValue = field.props?.uncheckedValue ?? 0;
        fieldProps.type = field.props?.switchType || 'round';
        break;
      default:
        break;
    }

    return fieldProps;
  };

  // 获取字段权限
  const getFieldPermission = (field: FormField): string => {
    if (!props.fieldPermissions || props.fieldPermissions.length === 0) {
      return 'EDITABLE';
    }
    const permission = props.fieldPermissions.find(
      (p) => p.fieldName === field.name,
    );
    return permission?.permission || 'EDITABLE';
  };

  // 构建校验规则
  const formRules = computed(() => {
    const rules: Record<string, any[]> = {};
    allFields.value.forEach((field) => {
      if (field.validateRules && field.validateRules.length > 0) {
        rules[field.name] = field.validateRules.map((rule) => ({
          required: rule.required,
          message:
            rule.message ||
            `${field.label}${rule.required ? '不能为空' : '格式不正确'}`,
          minLength: rule.min,
          maxLength: rule.max,
          match: rule.pattern ? new RegExp(rule.pattern) : undefined,
        }));
      } else if (field.required) {
        rules[field.name] = [
          { required: true, message: `${field.label}不能为空` },
        ];
      }
    });
    return rules;
  });

  // 暴露验证方法
  const validate = async () => {
    if (formRef.value) {
      return formRef.value.validate();
    }
    return undefined;
  };

  defineExpose({ validate });
</script>

<style lang="less" scoped>
  .dynamic-form-renderer {
    :deep(.arco-tabs) {
      .arco-tabs-content {
        padding-top: 16px;
      }
    }

    :deep(.arco-col) {
      min-width: 0;
    }

    .form-group-body {
      min-height: 100px;
    }
  }
</style>
