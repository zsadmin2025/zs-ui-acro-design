<!-- PermissionTree.vue -->
<template>
  <div v-for="item in data" :key="item.id" class="permission-node">
    <a-checkbox
      :model-value="checkedAll"
      :indeterminate="indeterminate"
      @change="handleChangeAll"
    >
      {{ item.title }}
    </a-checkbox>
    <a-checkbox-group v-model="item.children" @change="handleChange">
      <a-checkbox v-for="it in item.children" :key="it.key" :value="it.key">{{
        it.title
      }}</a-checkbox>
    </a-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    data: {
      type: Array as () => any[],
      required: true,
    },
    modelValue: {
      type: Array as () => (string | number)[],
      required: true,
    },
  });

  const indeterminate = ref(false);
  const checkedAll = ref(false);
  const checkData = ref<string[]>([]);
  const handleChangeAll = (value: any) => {
    indeterminate.value = false;
    if (value) {
      checkedAll.value = true;
      checkData.value = ['1', '2', '3'];
    } else {
      checkedAll.value = false;
      checkData.value = [];
    }
  };

  const handleChange = (values: any[]) => {
    if (values.length === 3) {
      checkedAll.value = true;
      indeterminate.value = false;
    } else if (values.length === 0) {
      checkedAll.value = false;
      indeterminate.value = false;
    } else {
      checkedAll.value = false;
      indeterminate.value = true;
    }
  };
</script>

<style scoped>
  .permission-node {
    margin: 4px 0;
  }
  .node-item {
    display: flex;
    align-items: center;
    margin: 2px 0;
  }
  .children {
    margin-left: 20px;
    margin-top: 4px;
  }
</style>
