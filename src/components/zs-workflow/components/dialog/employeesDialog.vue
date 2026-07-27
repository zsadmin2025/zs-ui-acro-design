<template>
  <a-modal
    v-model:visible="visibleDialog"
    title="选择成员"
    :width="600"
    class="promoter_person"
  >
    <div class="person_body clear">
      <div class="person_tree l">
        <input
          v-model="searchVal"
          type="text"
          placeholder="搜索成员"
          @input="getDebounceData($event)"
        />
        <p v-if="!searchVal" class="ellipsis tree_nav">
          <span class="ellipsis" @click="getDepartmentList(0)">天下</span>
          <span
            v-for="(item, index) in departments.titleDepartments"
            :key="index + 'a'"
            class="ellipsis"
            @click="getDepartmentList(item.id)"
            >{{ item.departmentName }}</span
          >
        </p>
        <selectBox :list="list" />
      </div>
      <selectResult :total="total" :list="resList" @del="delList" />
    </div>
    <template #footer>
      <a-button @click="$emit('update:visible', false)">取 消</a-button>
      <a-button type="primary" @click="saveDialog">确 定</a-button>
    </template>
  </a-modal>
</template>

<script setup>
  import { computed, watch, ref } from 'vue';
  import $func from '../../utils/index';
  import selectBox from '../selectBox.vue';
  import selectResult from '../selectResult.vue';
  import {
    departments,
    getDebounceData,
    getDepartmentList,
    searchVal,
  } from './common';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    isDepartment: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['update:visible', 'change']);

  const closeDialog = () => {
    emits('update:visible', false);
  };

  const visibleDialog = computed({
    get() {
      return props.visible;
    },
    set() {
      closeDialog();
    },
  });
  const checkedDepartmentList = ref([]);
  const checkedEmployessList = ref([]);
  const list = computed(() => {
    return [
      {
        isDepartment: props.isDepartment,
        type: 'department',
        data: departments.value.childDepartments,
        isActive: (item) =>
          $func.toggleClass(checkedDepartmentList.value, item),
        change: (item) => $func.toChecked(checkedDepartmentList.value, item),
        next: (item) => getDepartmentList(item.id),
      },
      {
        type: 'employee',
        data: departments.value.employees,
        isActive: (item) => $func.toggleClass(checkedEmployessList.value, item),
        change: (item) => $func.toChecked(checkedEmployessList.value, item),
      },
    ];
  });
  const resList = computed(() => {
    const data = [
      {
        type: 'employee',
        data: checkedEmployessList.value,
        cancel: (item) => $func.removeEle(checkedEmployessList.value, item),
      },
    ];
    if (props.isDepartment) {
      data.unshift({
        type: 'department',
        data: checkedDepartmentList.value,
        cancel: (item) => $func.removeEle(checkedDepartmentList.value, item),
      });
    }
    return data;
  });
  watch(
    () => props.visible,
    (val) => {
      if (val) {
        getDepartmentList();
        searchVal.value = '';
        checkedEmployessList.value = props.data
          .filter((item) => item.type === 1)
          .map(({ name, targetId }) => ({
            employeeName: name,
            id: targetId,
          }));
        checkedDepartmentList.value = props.data
          .filter((item) => item.type === 3)
          .map(({ name, targetId }) => ({
            departmentName: name,
            id: targetId,
          }));
      }
    },
  );

  const total = computed(
    () =>
      checkedDepartmentList.value.length + checkedEmployessList.value.length,
  );

  const saveDialog = () => {
    const checkedList = [
      ...checkedDepartmentList.value,
      ...checkedEmployessList.value,
    ].map((item) => ({
      type: item.employeeName ? 1 : 3,
      targetId: item.id,
      name: item.employeeName || item.departmentName,
    }));
    emits('change', checkedList);
  };
  const delList = () => {
    checkedDepartmentList.value = [];
    checkedEmployessList.value = [];
  };
</script>

<style>
  @import '../../css/dialog.css';
</style>
