<template>
  <a-select
    v-if="type === 'select'"
    :style="{ width: '80px' }"
    :default-value="(defaultValue as string)"
    size="small"
    @change="handleChange"
  >
    <a-option value="common" label="常规"></a-option>
    <a-option value="float">浮动</a-option>
    <a-option value="horizontal">横向</a-option>
    <a-option value="vertical">纵向</a-option>
    <!-- <a-option value="column">分栏</a-option> -->
    <!-- <a-option value="comprehensive">综合</a-option> -->
  </a-select>
  <a-input-number
    v-else-if="type === 'number'"
    :style="{ width: '80px' }"
    size="small"
    :default-value="(defaultValue as number)"
    @change="handleChange"
  />

  <a-color-picker
    v-else-if="type === 'colorPicker'"
    default-value="#165DFF"
    hide-trigger
    show-history
    show-preset
    @change="handleChange"
  />
  <a-switch
    v-else
    :default-checked="(defaultValue as boolean)"
    size="small"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
  const props = defineProps({
    type: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: [String, Boolean, Number],
      default: '',
    },
  });
  const emit = defineEmits(['inputChange']);
  const handleChange = (value: unknown) => {
    emit('inputChange', {
      value,
      key: props.name,
    });
  };
</script>
