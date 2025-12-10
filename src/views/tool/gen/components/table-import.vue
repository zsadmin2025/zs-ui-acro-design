<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="60%"
    title-align="start"
    :draggable="true"
    @cancel="genTableStore.close"
  >
    <template #title>
      <h4>
        {{ '导入表' }}
      </h4>
    </template>
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <a-space>
          <a-input-search
            v-model="form.tableName"
            placeholder="请输入表名"
            :allow-clear="true"
            @search="genTableStore.fetchData()"
          >
          </a-input-search>
          <a-space :size="18">
            <a-button type="primary" @click="genTableStore.fetchData">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="genTableStore.resetSearch">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-space>
      </a-col>
    </a-row>
    <a-table
      v-model:selected-keys="selectedKeys"
      row-key="tableName"
      :loading="loading"
      :columns="(columns as TableColumnData[])"
      :data="list"
      :bordered="false"
      :row-selection="rowSelection"
      :pagination="false"
      :scroll="{ x: '100%', y: '100%' }"
      style="margin-bottom: 16px"
    ></a-table>
    <a-pagination
      v-model:current="form.current"
      v-model:page-size="form.pageSize"
      :total="total"
      show-total
      @change="genTableStore.handleCurrentChange"
      @page-size-change="genTableStore.handleSizeChange"
    />
    <template #footer>
      <a-space>
        <a-button @click="genTableStore.close">取消</a-button>
        <a-button
          :disabled="selectedKeys.length === 0"
          type="primary"
          @click="genTableStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useGenTableStore } from '@/store/modules/tool/gen/genTableStore';

  const genTableStore = useGenTableStore();
  const { dialogFormVisible, loading, list, total, form, selectedKeys } =
    storeToRefs(genTableStore);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });
  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 60,
      align: 'center',
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 200,
    },
  ]);

  const emits = defineEmits(['refresh']);

  defineExpose({
    init: genTableStore.init,
    form,
  });
</script>
