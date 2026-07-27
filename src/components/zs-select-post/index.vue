<template>
  <a-tree-select
    :model-value="modelValue"
    :data="processedDeptPostTreeData"
    :multiple="multiple"
    :allow-search="true"
    :allow-clear="true"
    :max-tag-count="5"
    :placeholder="placeholder"
    :disabled="disabled"
    :loading="loading"
    :tree-checkable="true"
    :tree-check-strictly="false"
    style="width: 100%"
    :field-names="{
      key: 'id',
      title: 'name',
      children: 'children',
    }"
    @change="handleChange"
  >
    <template #default="{ data }">
      <span :style="{ color: data.type === 'dept' ? '#999' : '#333' }">
        <!-- 部门节点显示文件夹图标 -->
        <icon-folder v-if="data.type === 'dept'" style="margin-right: 4px" />
        <!-- 岗位节点显示人物图标 -->
        <icon-user v-else style="margin-right: 4px" />
        {{ data.name }}
        <span
          v-if="data.type === 'dept'"
          style="color: #bbb; font-size: 12px; margin-left: 4px"
          >(部门)</span
        >
      </span>
    </template>
  </a-tree-select>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { sysPostApi } from '@/api/sys/post';

  defineProps<{
    modelValue?: (number | string)[];
    multiple?: boolean;
    placeholder?: string;
    disabled?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: (number | string)[]): void;
    (
      e: 'change',
      value: Array<{ sysPostId: number | string; postName: string }>,
    ): void;
  }>();

  const loading = ref(false);
  const deptPostTreeData = ref<any[]>([]);

  const findPostById = (data: any[], id: number | string): any => {
    let result: any = null;
    data.forEach((item) => {
      if (result) return;
      if (item.id === id) {
        result = item;
        return;
      }
      if (item.children && item.children.length > 0) {
        const found = findPostById(item.children, id);
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

    // 二次保护：根据 type 字段过滤掉部门节点，只保留岗位
    const postIds = ids.filter((id) => {
      // 在原始数据中查找节点
      const node = findPostById(deptPostTreeData.value, id);
      // 使用 type 字段判断：type === 'post' 才是岗位
      const isPost = node && node.type === 'post';
      return isPost;
    });

    emit('update:modelValue', postIds);
    const result = postIds.map((id) => {
      const post = findPostById(deptPostTreeData.value, id);
      return {
        sysPostId: id,
        postName: post?.name || '',
      };
    });
    emit('change', result);
  };

  const processTreeData = (data: any[]): any[] => {
    // 根据 type 字段区分部门和岗位，保持树形结构但禁用部门节点的勾选功能
    return data.map((item) => {
      const processedItem = { ...item };
      if (item.type === 'dept') {
        // 部门节点：保留但设置为不可勾选、不可选择
        processedItem.checkable = false;
        processedItem.disabled = true;
        processedItem.selectable = false;
        // 递归处理子节点
        if (item.children && item.children.length > 0) {
          processedItem.children = processTreeData(item.children);
        }
      } else {
        // 岗位节点：保持可选状态
        processedItem.checkable = true;
        processedItem.disabled = false;
        processedItem.selectable = true;
      }
      return processedItem;
    });
  };

  const processedDeptPostTreeData = computed(() => {
    return processTreeData(deptPostTreeData.value);
  });

  const loadDeptPostTree = async () => {
    loading.value = true;
    try {
      const response = await sysPostApi.getDeptPostTree();
      deptPostTreeData.value = response?.data ?? [];
    } catch {
      deptPostTreeData.value = [];
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadDeptPostTree();
  });
</script>
