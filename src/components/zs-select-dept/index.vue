<template>
  <a-tree-select
    v-model="selectedIds"
    :data="deptTreeData"
    :multiple="multiple"
    :allow-search="true"
    :allow-clear="true"
    :max-tag-count="5"
    :placeholder="placeholder"
    :disabled="disabled"
    :loading="loading"
    style="width: 100%"
    :tree-checkable="true"
    :tree-check-strictly="false"
    :field-names="{
      key: 'sysDeptId',
      title: 'deptName',
      children: 'children',
    }"
    @change="handleChange"
  >
  </a-tree-select>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { sysDeptApi } from '@/api/sys/dept';

  const props = withDefaults(
    defineProps<{
      modelValue?: (number | string)[];
      multiple?: boolean;
      placeholder?: string;
      disabled?: boolean;
    }>(),
    {
      modelValue: () => [],
      multiple: false,
      placeholder: '请选择部门',
      disabled: false,
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', value: (number | string)[]): void;
    (
      e: 'change',
      value: Array<{ sysDeptId: number | string; deptName: string }>,
    ): void;
  }>();

  const loading = ref(false);
  const deptTreeData = ref<any[]>([]);

  const selectedIds = computed({
    get: () => [...props.modelValue],
    set: (val) => {
      emit('update:modelValue', val);
    },
  });

  const loadDeptTree = async () => {
    loading.value = true;
    try {
      const response = await sysDeptApi.getDeptTree({});
      deptTreeData.value = response?.data ?? [];
    } catch {
      deptTreeData.value = [];
    } finally {
      loading.value = false;
    }
  };

  const findDeptById = (data: any[], id: number | string): any => {
    let result: any = null;
    data.forEach((item) => {
      if (result) return;
      if (item.sysDeptId === id) {
        result = item;
        return;
      }
      if (item.children && item.children.length > 0) {
        const found = findDeptById(item.children, id);
        if (found) {
          result = found;
        }
      }
    });
    return result;
  };

  const handleChange = (val: any) => {
    let ids: (number | string)[] = [];
    if (val !== undefined && val !== null) {
      if (Array.isArray(val)) {
        ids = val.map((item: any) =>
          item?.value !== undefined ? item.value : item,
        );
      } else {
        const id = val?.value !== undefined ? val.value : val;
        ids = [id];
      }
    }
    emit('update:modelValue', ids);
    const result = ids.map((id) => {
      const dept = findDeptById(deptTreeData.value, id);
      return {
        sysDeptId: id,
        deptName: dept?.deptName || '',
      };
    });
    emit('change', result);
  };

  watch(
    () => props.modelValue,
    (val) => {
      selectedIds.value = val;
    },
    { deep: true },
  );

  onMounted(() => {
    loadDeptTree();
  });
</script>
