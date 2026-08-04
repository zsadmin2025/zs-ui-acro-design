<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-form :model="form" label-align="left" :auto-label-width="true">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="partnerCategoryName" label="类别名称">
                <a-input
                  v-model="form.partnerCategoryName"
                  placeholder="类别名称"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="remark" label="备注">
                <a-input v-model="form.remark" placeholder="备注" allow-clear />
              </a-form-item>
            </a-col>
            <a-col flex="1">
              <div style="text-align: right">
                <a-space :size="9" wrap>
                  <a-button type="primary" @click="categoryStore.fetchData">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="categoryStore.reset">
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
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'partner:category:save'"
                type="primary"
                @click="categoryStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'partner:category:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="categoryStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'partner:category:export'"
                @click="categoryStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                {{ $t('searchTable.operation.export') }}
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => categoryStore.reset()"
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
          row-key="businessPartnerCategoryId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link
                v-permission="'partner:category:update'"
                @click="categoryStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'partner:category:delete'"
                status="danger"
                @click="categoryStore.handleDelete(record)"
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
          show-total
          show-jumper
          show-page-size
          @change="categoryStore.handleCurrentChange"
          @page-size-change="categoryStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <CategoryAddOrEdit ref="addEditRef" @refresh="categoryStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableRowSelection } from '@arco-design/web-vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useCategoryStore } from '@/store/modules/business/partner/category/categoryStore';
  import CategoryAddOrEdit from './category-add-or-edit.vue';

  const categoryStore = useCategoryStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(categoryStore);

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 80,
      align: 'center',
    },
    {
      title: '类别名称',
      dataIndex: 'partnerCategoryName',
      slotName: 'partnerCategoryName',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
      minWidth: 100,
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      slotName: 'creatorName',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      align: 'center',
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      slotName: 'createTime',
      ellipsis: true,
      tooltip: true,
      minWidth: 300,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      slotName: 'remark',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  onMounted(() => {
    categoryStore.fetchData();
  });
</script>
