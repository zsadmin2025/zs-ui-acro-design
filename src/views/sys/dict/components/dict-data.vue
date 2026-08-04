<template>
  <zs-container layout="header-main-footer">
    <template #header>
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form :model="form" label-align="left" :auto-label-width="true">
            <a-form-item label="字典名称">
              <a-input
                v-model="form.dictLabel"
                placeholder="请输入字典名称"
                :allow-clear="true"
              />
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="16" :xl="18" :xxl="18">
          <div style="text-align: right">
            <a-space :size="9" wrap>
              <a-button type="primary" @click="dictDataStore.loadDictDataPage">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="dictDataStore.resetSearch">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.form.reset') }}
              </a-button>
            </a-space>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #main-header>
      <a-row justify="space-between" align="center">
        <a-col :xs="24" :sm="24" :md="12">
          <a-space :size="8" wrap>
            <a-button
              v-permission="'sys:dict:save'"
              type="primary"
              @click="dictDataStore.handleAddOrEdit(null)"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-button
              v-permission="'sys:dict:batchDelete'"
              type="primary"
              status="danger"
              :disabled="selectedKeys.length === 0"
              @click="dictDataStore.handleDeleteSelected()"
            >
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-button>
            <a-button
              v-permission="'sys:dict:export'"
              @click="dictDataStore.handleExport"
            >
              <template #icon>
                <icon-download />
              </template>
              {{ $t('searchTable.operation.export') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          v-if="appStore.device !== 'mobile'"
          :xs="24"
          :sm="24"
          :md="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-space>
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <div
                class="action-icon"
                @click="() => dictDataStore.resetSearch()"
                ><icon-refresh size="18"
              /></div>
            </a-tooltip>
            <DensityDropdown @size-change="handleSizeChange" />
          </a-space>
        </a-col>
      </a-row>
    </template>
    <template #main-body>
      <a-table
        v-model:selected-keys="selectedKeys"
        :row-selection="rowSelection"
        row-key="sysDictDataId"
        :loading="loading"
        :pagination="false"
        :columns="(columns as TableColumnData[])"
        :data="list"
        :bordered="false"
        show-empty-tree
        :size="currentSize"
        :scroll="{ x: 1200, y: '100%' }"
      >
        <template #status="{ record }">
          <ZsStatus :value="record.status" />
        </template>
        <template #operations="{ record }">
          <a-space size="mini">
            <a-link
              v-permission="'sys:dict:update'"
              @click="dictDataStore.handleAddChild(record)"
            >
              <template #icon>
                <icon-plus />
              </template>
              <template #default>新增子级字典</template>
            </a-link>
            <a-link
              v-permission="'sys:dict:update'"
              @click="dictDataStore.handleAddOrEdit(record)"
            >
              <template #icon>
                <icon-edit />
              </template>
              <template #default>编辑</template>
            </a-link>
            <a-link
              v-permission="'sys:dict:delete'"
              status="danger"
              @click="dictDataStore.handleDelete(record)"
            >
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-link>
          </a-space>
        </template>
      </a-table>
    </template>
    <template #footer>
      <a-pagination
        v-model:current="form.current"
        v-model:page-size="form.pageSize"
        :total="total"
        :show-total="appStore.device !== 'mobile'"
        :show-jumper="appStore.device !== 'mobile'"
        :show-page-size="appStore.device !== 'mobile'"
        :simple="appStore.device === 'mobile'"
        @change="dictDataStore.handleCurrentChange"
        @page-size-change="dictDataStore.handleSizeChange"
      />
    </template>
  </zs-container>

  <dict-data-add-or-edit
    ref="addEditRef"
    @refresh="dictDataStore.loadDictDataPage"
  />
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useAppStore } from '@/store';
  import { useDictDataStore } from '@/store/modules/sys/dict/dictDataStore';
  import DictDataAddOrEdit from './dict-data-add-or-edit.vue';

  const appStore = useAppStore();
  const dictDataStore = useDictDataStore();
  const { addEditRef, list, total, loading, form, selectedKeys } =
    storeToRefs(dictDataStore);

  const rowSelection = reactive({
    type: 'checkbox' as const,
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
      fixed: 'left',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      slotName: 'dictType',
      width: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      width: 150,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      width: 150,
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 210,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);

  const currentSize = ref<'small' | 'mini' | 'medium' | 'large'>('medium');
  const handleSizeChange = (size: 'small' | 'mini' | 'medium' | 'large') => {
    currentSize.value = size;
  };

  onMounted(() => {
    dictDataStore.loadDictDataPage();
  });
</script>
