<template>
  <a-card class="general-card">
    <template #title> 利冲信息 </template>
    <a-row :gutter="20">
      <a-table
        :columns="columns"
        :data="lichongList"
        :pagination="false"
        :table-layout-fixed="true"
        :scroll="{ x: '100%', y: '100%' }"
      >
      </a-table>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form } = storeToRefs(infoAddOrEditStore);
  const lichongList = ref([]);
  const columns: TableColumnData[] = [
    {
      title: '条件',
      dataIndex: '',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: '',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '客户名称',
      dataIndex: '',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '承接律师',
      dataIndex: '',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '其他信息',
      dataIndex: '',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '立项时间',
      dataIndex: '',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
  ];
</script>
