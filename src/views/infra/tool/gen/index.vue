<template>
  <div class="gen-container">
    <ZsContainer layout="header-main-footer">
      <template #header>
        <a-row :gutter="[16, 16]">
          <a-col :flex="1">
            <a-form :model="form" label-align="left" :auto-label-width="true">
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item field="tableName" label="表名">
                    <a-input v-model="form.tableName" placeholder="表名" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="24" :xl="6" :xxl="6">
                  <div style="text-align: right">
                    <a-space :size="9" wrap>
                      <a-button type="primary" @click="genStore.fetchData">
                        <template #icon>
                          <icon-search />
                        </template>
                        {{ $t('searchTable.form.search') }}
                      </a-button>
                      <a-button @click="genStore.resetSearch">
                        <template #icon>
                          <icon-refresh />
                        </template>
                        {{ $t('searchTable.form.reset') }}
                      </a-button>
                    </a-space>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12">
            <a-space>
              <a-button type="primary" @click="genStore.handleImport()">
                <template #icon>
                  <icon-plus />
                </template>
                导入
              </a-button>
              <a-button
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="genStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
            </a-space>
          </a-col>
          <a-col
            v-if="appStore.device !== 'mobile'"
            :xs="24"
            :sm="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => genStore.resetSearch()"
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
          row-key="tableId"
          :loading="loading"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :row-selection="rowSelection"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #operations="{ record }">
            <a-space>
              <a-link
                type="text"
                size="small"
                @click="genStore.handlePreview(record)"
              >
                <template #icon>
                  <icon-eye />
                </template>
                <template #default>预览</template>
              </a-link>
              <a-link
                type="text"
                size="small"
                @click="genStore.handleEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                type="text"
                size="small"
                status="danger"
                @click="genStore.handleDelete(record)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-link>
              <a-link
                type="text"
                size="small"
                @click="genStore.handleGenCode(record)"
              >
                <template #icon>
                  <icon-code />
                </template>
                <template #default>生成代码</template>
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
          @change="genStore.handleCurrentChange"
          @page-size-change="genStore.handleSizeChange"
        />
      </template>
    </ZsContainer>
    <TableImport ref="addEditRef" @refresh="genStore.fetchData" />
    <GenEdit ref="genEditRef" @refresh="genStore.fetchData" />
    <GenPreview ref="genPreviewRef" @refresh="genStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useGenStore } from '@/store/modules/infra/tool/gen/genStore';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useAppStore } from '@/store';
  import TableImport from './components/table-import.vue';
  import GenEdit from './components/gen-edit.vue';
  import GenPreview from './components/gen-preview.vue';

  const genStore = useGenStore();
  const {
    addEditRef,
    genEditRef,
    genPreviewRef,
    loading,
    list,
    total,
    form,
    selectedKeys,
  } = storeToRefs(genStore);
  const appStore = useAppStore();

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
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '实体',
      dataIndex: 'className',
      ellipsis: true,
      tooltip: true,
      width: 200,
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
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 300,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);

  const currentSize = ref<'small' | 'mini' | 'medium' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'mini' | 'medium' | 'large';
  };
  onMounted(() => {
    genStore.fetchData();
  });
</script>
