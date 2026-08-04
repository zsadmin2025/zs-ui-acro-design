<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-form :model="form" label-align="left" :auto-label-width="true">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="warehouseCode" label="库房编号">
                <a-input
                  v-model="form.warehouseCode"
                  placeholder="库房编号"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="warehouseName" label="库房名称">
                <a-input
                  v-model="form.warehouseName"
                  placeholder="库房名称"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="warehouseType" label="库房类型">
                <a-select
                  v-model="form.warehouseType"
                  placeholder="请选择库房类型"
                  allow-clear
                >
                  <a-option
                    v-for="item in warehouseType"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="!collapsed">
              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                <a-form-item field="status" label="状态">
                  <a-select
                    v-model="form.status"
                    placeholder="请选择状态"
                    allow-clear
                  >
                    <a-option :value="1">正常</a-option>
                    <a-option :value="0">停用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col flex="1">
              <div style="text-align: right">
                <a-space :size="9" wrap>
                  <a-button type="primary" @click="infoStore.fetchData">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="infoStore.reset">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    {{ $t('searchTable.form.reset') }}
                  </a-button>
                  <a-button type="text" @click="collapsed = !collapsed">
                    {{ collapsed ? '展开' : '收起' }}
                    <icon-down v-if="collapsed" />
                    <icon-up v-else />
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
                v-permission="'warehouse:info:save'"
                type="primary"
                @click="infoStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'warehouse:info:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="infoStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'warehouse:info:export'"
                @click="infoStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                {{ $t('searchTable.operation.download') }}
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => infoStore.reset()"
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
          row-key="warehouseInfoId"
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
                v-permission="'warehouse:info:update'"
                @click="infoStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'warehouse:info:delete'"
                status="danger"
                @click="infoStore.handleDelete(record)"
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
          @change="infoStore.handleCurrentChange"
          @page-size-change="infoStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <InfoAddOrEdit ref="addEditRef" @refresh="infoStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableRowSelection } from '@arco-design/web-vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useInfoStore } from '@/store/modules/business/warehouse/info/infoStore';
  import { useDicts } from '@/hooks/dict';
  import InfoAddOrEdit from './info-add-or-edit.vue';

  const infoStore = useInfoStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(infoStore);

  const { warehouseType } = useDicts('warehouseType');

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const collapsed = ref(true);

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
      title: '库房编号',
      dataIndex: 'warehouseCode',
      slotName: 'warehouseCode',
      ellipsis: true,
      tooltip: true,
      width: 240,
      align: 'center',
    },
    {
      title: '库房名称',
      dataIndex: 'warehouseName',
      slotName: 'warehouseName',
      width: 200,
      align: 'center',
    },
    {
      title: '库房地址',
      dataIndex: 'warehouseAddress',
      slotName: 'warehouseAddress',
      width: 200,
      align: 'center',
    },
    {
      title: '库房面积m²',
      dataIndex: 'warehouseArea',
      slotName: 'warehouseArea',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '库房类型',
      dataIndex: 'warehouseTypeLabel',
      slotName: 'warehouseTypeLabel',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '货位数量',
      dataIndex: 'locationCount',
      slotName: 'locationCount',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '货架数量',
      dataIndex: 'shelfCount',
      slotName: 'shelfCount',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '管理员',
      dataIndex: 'managerUserName',
      slotName: 'managerUserName',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'contactInfo',
      slotName: 'contactInfo',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      width: 120,
      align: 'center',
      tooltip: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      slotName: 'remark',
      ellipsis: true,
      tooltip: true,
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
    infoStore.fetchData();
  });
</script>
