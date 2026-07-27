<template>
  <div style="width: 100%">
    <div>
      <a-select v-model="innerType" @change="handleTypeChange">
        <a-option :value="1">全体用户</a-option>
        <a-option :value="2">指定用户</a-option>
        <a-option :value="3">指定角色</a-option>
        <a-option :value="4">指定部门</a-option>
        <a-option :value="5">指定岗位</a-option>
      </a-select>
    </div>
    <ZsGap height="10" />
    <div>
      <ZsSelectUser
        v-if="innerType === 2"
        :model-value="selectedIds"
        multiple
        @update:model-value="onUserSelect"
      />
      <a-select
        v-if="innerType === 3"
        :model-value="selectedIds"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="5"
        placeholder="请选择角色"
        style="width: 100%"
        @change="onSelectChange"
      >
        <a-option
          v-for="item in roleData"
          :key="item.sysRoleId"
          :label="item.roleName"
          :value="item.sysRoleId"
        >
        </a-option>
      </a-select>

      <a-tree-select
        v-if="innerType === 4"
        :model-value="selectedIds"
        :data="deptTreeData"
        :tree-checkable="true"
        :allow-search="true"
        :allow-clear="true"
        style="width: 100%"
        :field-names="{
          key: 'sysDeptId',
          title: 'deptName',
          children: 'children',
        }"
        placeholder="请选择部门"
        @change="onTreeSelectChange"
      />

      <a-tree-select
        v-if="innerType === 5"
        :model-value="selectedIds"
        :data="processedDeptPostTreeData"
        :multiple="true"
        :allow-search="true"
        :allow-clear="true"
        :max-tag-count="5"
        style="width: 100%"
        :field-names="{
          key: 'id',
          title: 'name',
          children: 'children',
        }"
        placeholder="请选择岗位"
        @change="onTreeSelectChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useRoleStore } from '@/store/modules/sys/role/roleStore';
  import { useDeptStore } from '@/store/modules/sys/dept/deptStore';

  defineOptions({
    name: 'ZsSelectType',
  });

  const props = withDefaults(
    defineProps<{
      /** 选中的ID数组 */
      modelValue?: (number | string)[];
      /** 选择类型：1-全体用户 2-指定用户 3-指定角色 4-指定部门 5-指定岗位 */
      type?: number;
    }>(),
    {
      modelValue: () => [],
      type: 1,
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', value: (number | string)[]): void;
    (e: 'update:type', value: number): void;
    (e: 'change', value: { type: number; ids: (number | string)[] }): void;
  }>();

  // 内部维护type
  const innerType = ref(props.type);

  watch(
    () => props.type,
    (val) => {
      innerType.value = val;
    },
  );

  // 使用 computed 替代双向 watch，避免循环更新
  const selectedIds = computed({
    get: () => [...props.modelValue],
    set: (val) => {
      emit('update:modelValue', val);
      emit('change', { type: innerType.value, ids: val });
    },
  });

  // 类型切换时清空已选值，并通知外部
  const handleTypeChange = () => {
    selectedIds.value = [];
    emit('update:type', innerType.value);
  };

  // 用户选择变化（ZsSelectUser）
  const onUserSelect = (val: any[]) => {
    selectedIds.value = val as (number | string)[];
  };

  // 下拉选择变化（a-select）
  const onSelectChange = (val: any) => {
    selectedIds.value = Array.isArray(val) ? val : [val];
  };

  // 树选择变化（a-tree-select）
  const onTreeSelectChange = (val: any) => {
    if (Array.isArray(val)) {
      selectedIds.value = val;
    } else if (val != null) {
      selectedIds.value = [val];
    } else {
      selectedIds.value = [];
    }
  };

  // 角色store
  const roleStore = useRoleStore();
  const { roleData } = storeToRefs(roleStore);

  // 部门store
  const deptStore = useDeptStore();
  const { deptTreeData, deptPostTreeData } = storeToRefs(deptStore);

  // 处理岗位树数据，禁用有子节点的节点
  const processTreeData = (data: any[]): any[] => {
    return data.map((item) => {
      const processedItem = { ...item };
      if (item.children && item.children.length > 0) {
        processedItem.selectable = false;
        processedItem.children = processTreeData(item.children);
      }
      return processedItem;
    });
  };

  const processedDeptPostTreeData = computed(() => {
    return processTreeData(deptPostTreeData.value);
  });

  onBeforeMount(async () => {
    await roleStore.loadRoleList();
    await deptStore.loadDeptTreeData();
    await deptStore.loadDeptPostTree();
  });
</script>
