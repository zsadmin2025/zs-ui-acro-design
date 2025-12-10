<template>
  <a-dropdown @select="handleSelectDensity">
    <a-tooltip :content="$t('searchTable.actions.density')">
      <div class="action-icon"><icon-line-height size="18" /></div>
    </a-tooltip>
    <template #content>
      <a-doption
        v-for="item in densityList"
        :key="item.value"
        :value="item.value"
        :class="{ active: item.value === size }"
      >
        <span>{{ item.name }}</span>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { computed, ref, defineEmits } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const emits = defineEmits(['sizeChange']);
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const size = ref<SizeProps>('medium');
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
  ) => {
    size.value = val as SizeProps;
    emits('sizeChange', val);
  };
</script>
