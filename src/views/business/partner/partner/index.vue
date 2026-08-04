<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-form :model="form" label-align="left" :auto-label-width="true">
          <a-row :gutter="[16, 16]">
            <!-- <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="partnerCategoryId" label="合作方分类ID">
                <a-input
                  v-model="form.partnerCategoryId"
                  placeholder="合作方分类ID"
                  allow-clear
                />
              </a-form-item>
            </a-col> -->
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="companyName" label="企业名称">
                <a-input
                  v-model="form.companyName"
                  placeholder="企业名称"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="partnerType" label="单位类型">
                <a-select
                  v-model="form.partnerType"
                  placeholder="请选择单位类型"
                  allow-clear
                >
                  <a-option
                    v-for="item in unitType"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
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
            <a-col flex="1">
              <div style="text-align: right">
                <a-space :size="9" wrap>
                  <a-button type="primary" @click="partnerStore.fetchData">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="partnerStore.reset">
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
                v-permission="'partner:partner:save'"
                type="primary"
                @click="partnerStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'partner:partner:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="partnerStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'partner:partner:export'"
                @click="partnerStore.handleExport()"
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
                <div class="action-icon" @click="() => partnerStore.reset()"
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
          row-key="businessPartnerId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #settlementStatus="{ record }">
            <span v-if="record.settlementStatus === 1">已结算</span>
            <span v-else>未结算</span>
          </template>
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link
                v-permission="'partner:partner:update'"
                @click="partnerStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'partner:partner:delete'"
                status="danger"
                @click="partnerStore.handleDelete(record)"
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
          @change="partnerStore.handleCurrentChange"
          @page-size-change="partnerStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <PartnerAddOrEdit ref="addEditRef" @refresh="partnerStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableRowSelection } from '@arco-design/web-vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { usePartnerStore } from '@/store/modules/business/partner/partner/partnerStore';
  import { useDicts } from '@/hooks/dict';
  import PartnerAddOrEdit from './partner-add-or-edit.vue';

  const partnerStore = usePartnerStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(partnerStore);

  const { unitType } = useDicts('unitType');

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
      title: '单位大类',
      dataIndex: 'partnerCategoryName',
      slotName: 'partnerCategoryName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      slotName: 'companyName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 300,
      align: 'left',
    },
    {
      title: '名称首拼',
      dataIndex: 'namePinyin',
      slotName: 'namePinyin',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      slotName: 'shortName',
      ellipsis: true,
      tooltip: true,
      minWidth: 100,
      width: 100,
      align: 'center',
    },
    {
      title: '企业电话',
      dataIndex: 'companyPhone',
      slotName: 'companyPhone',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      slotName: 'contactPerson',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 120,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      slotName: 'mobile',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '传真',
      dataIndex: 'fax',
      slotName: 'fax',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      slotName: 'email',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 200,
      align: 'center',
    },
    {
      title: '结算账期(天)',
      dataIndex: 'settlementPeriod',
      slotName: 'settlementPeriod',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 120,
      align: 'center',
    },
    {
      title: '结算状态',
      dataIndex: 'settlementStatus',
      slotName: 'settlementStatus',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 120,
      align: 'center',
    },

    {
      title: '单位类型',
      dataIndex: 'partnerTypeLabel',
      slotName: 'partnerTypeLabel',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '企业地址',
      dataIndex: 'companyAddress',
      slotName: 'companyAddress',
      ellipsis: true,
      tooltip: true,
      minWidth: 300,
      width: 300,
      align: 'left',
    },
    {
      title: '单位状态',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 120,
      align: 'center',
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'socialCreditCode',
      slotName: 'socialCreditCode',
      ellipsis: true,
      tooltip: true,
      minWidth: 200,
      width: 300,
      align: 'center',
    },
    {
      title: '有效期至',
      dataIndex: 'validUntil',
      slotName: 'validUntil',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 120,
      align: 'center',
    },

    // {
    //   title: '仓库地址',
    //   dataIndex: 'warehouseAddress',
    //   slotName: 'warehouseAddress',
    //   ellipsis: true,
    //   tooltip: true,
    //   minWidth: 120,
    //   width: 200,
    //   align: 'center',
    // },

    // {
    //   title: '档案号',
    //   dataIndex: 'fileNo',
    //   slotName: 'fileNo',
    //   ellipsis: true,
    //   tooltip: true,
    //   minWidth: 120,
    //   width: 200,
    //   align: 'center',
    // },

    {
      title: '开户银行',
      dataIndex: 'bankName',
      slotName: 'bankName',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '银行账号',
      dataIndex: 'bankAccount',
      slotName: 'bankAccount',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '企业负责人',
      dataIndex: 'companyPrincipal',
      slotName: 'companyPrincipal',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 120,
      align: 'center',
    },
    {
      title: '企业负责人-联系电话',
      dataIndex: 'principalPhone',
      slotName: 'principalPhone',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '企业管理员',
      dataIndex: 'companyManager',
      slotName: 'companyManager',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '企业管理员-联系电话',
      dataIndex: 'managerPhone',
      slotName: 'managerPhone',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '质量负责人',
      dataIndex: 'qualityPrincipal',
      slotName: 'qualityPrincipal',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '质量负责人-联系电话',
      dataIndex: 'qualityPhone',
      slotName: 'qualityPhone',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '质量管理员',
      dataIndex: 'qualityManager',
      slotName: 'qualityManager',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '质量管理员联系电话',
      dataIndex: 'qualityManagerPhone',
      slotName: 'qualityManagerPhone',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '财务负责人',
      dataIndex: 'financePrincipal',
      slotName: 'financePrincipal',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '财务负责人联系电话',
      dataIndex: 'financePhone',
      slotName: 'financePhone',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
      align: 'center',
    },
    {
      title: '质量机构负责人',
      dataIndex: 'qualityOrgPrincipal',
      slotName: 'qualityOrgPrincipal',
      ellipsis: true,
      tooltip: true,
      minWidth: 150,
      width: 150,
      align: 'center',
    },
    {
      title: '质量机构负责人联系电话',
      dataIndex: 'qualityOrgPhone',
      slotName: 'qualityOrgPhone',
      ellipsis: true,
      tooltip: true,
      minWidth: 120,
      width: 200,
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
    partnerStore.fetchData();
  });
</script>
