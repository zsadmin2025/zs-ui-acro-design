<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-form :model="form" label-align="left" :auto-label-width="true">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="goodsName" label="商品名称">
                <a-input
                  v-model="form.goodsName"
                  placeholder="商品名称"
                  allow-clear
                />
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
            <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
              <a-form-item field="goodsCategoryId" label="商品类别">
                <a-select
                  v-model="form.goodsCategoryId"
                  placeholder="请选择商品类别"
                  allow-clear
                  allow-search
                >
                  <a-option
                    v-for="item in goodsCategoryList"
                    :key="item.categoryId"
                    :value="item.categoryId"
                    >{{ item.categoryName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="!collapsed">
              <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                <a-form-item field="manufacturerId" label="生产厂家">
                  <a-select
                    v-model="form.manufacturerId"
                    placeholder="请选择生产厂家"
                    allow-clear
                  >
                    <a-option
                      v-for="item in partnerList"
                      :key="item.partnerId"
                      :value="item.partnerId"
                      >{{ item.companyName }}</a-option
                    >
                  </a-select></a-form-item
                >
              </a-col>
            </template>
            <a-col flex="1">
              <div style="text-align: right">
                <a-space :size="9" wrap>
                  <a-button type="primary" @click="goodsStore.fetchData">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="goodsStore.reset">
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
                v-permission="'goods:goods:save'"
                type="primary"
                @click="goodsStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'goods:goods:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="goodsStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'goods:goods:export'"
                @click="goodsStore.handleExport()"
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
                <div class="action-icon" @click="() => goodsStore.reset()"
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
          row-key="drugGoodsId"
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
                v-permission="'goods:goods:update'"
                @click="goodsStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'goods:goods:delete'"
                status="danger"
                @click="goodsStore.handleDelete(record)"
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
          @change="goodsStore.handleCurrentChange"
          @page-size-change="goodsStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <GoodsAddOrEdit ref="addEditRef" @refresh="goodsStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useGoodsStore } from '@/store/modules/business/goods/goods/goodsStore';
  import { useCategoryStore } from '@/store/modules/business/goods/category/categoryStore';
  import { usePartnerStore } from '@/store/modules/business/partner/partner/partnerStore';
  import GoodsAddOrEdit from './goods-add-or-edit.vue';

  const goodsStore = useGoodsStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(goodsStore);

  const { goodsCategoryList } = storeToRefs(useCategoryStore());
  const { partnerList } = storeToRefs(usePartnerStore());

  const rowSelection = reactive({
    type: 'checkbox' as const,
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
      title: '商品类别',
      dataIndex: 'goodsCategoryIdName',
      slotName: 'goodsCategoryIdName',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '追溯码',
      dataIndex: 'traceCode',
      slotName: 'traceCode',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '商品货号',
      dataIndex: 'goodsSn',
      slotName: 'goodsSn',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '国家编码',
      dataIndex: 'nationalCode',
      slotName: 'nationalCode',
      ellipsis: true,
      tooltip: true,
      width: 260,
      align: 'center',
    },
    {
      title: '通用名',
      dataIndex: 'commonName',
      slotName: 'commonName',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
    },
    {
      title: '通用名拼音码',
      dataIndex: 'commonNamePinyin',
      slotName: 'commonNamePinyin',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      slotName: 'goodsName',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
    },
    {
      title: '商品拼音码',
      dataIndex: 'goodsPinyin',
      slotName: 'goodsPinyin',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
    },
    {
      title: '状态',
      width: 100,
      align: 'center',
      dataIndex: 'status',
      slotName: 'status',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '剂型',
      dataIndex: 'dosageFormLabel',
      slotName: 'dosageFormLabel',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '单位',
      dataIndex: 'unitLabel',
      slotName: 'unitLabel',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      slotName: 'spec',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturerIdName',
      slotName: 'manufacturerIdName',
      ellipsis: true,
      tooltip: true,
      width: 260,
      align: 'center',
    },

    {
      title: '条形码',
      dataIndex: 'barcode',
      slotName: 'barcode',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '是否医保用药',
      dataIndex: 'isMedicalInsurance',
      slotName: 'isMedicalInsurance',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
      render: ({ record }) => {
        return record.isMedicalInsurance === 1 ? '是' : '否';
      },
    },
    {
      title: '上市许可人',
      dataIndex: 'marketingAuthorizationHolder',
      slotName: 'marketingAuthorizationHolder',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '是否中药',
      dataIndex: 'isChineseMedicine',
      slotName: 'isChineseMedicine',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
      render: ({ record }) => {
        return record.isChineseMedicine === 1 ? '是' : '否';
      },
    },
    {
      title: '最近进价',
      dataIndex: 'latestPurchasePrice',
      slotName: 'latestPurchasePrice',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '最近供应商',
      dataIndex: 'latestSupplierIdName',
      slotName: 'latestSupplierIdName',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: '药品有效期',
      dataIndex: 'drugValidDate',
      slotName: 'drugValidDate',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '近效期预警天数',
      dataIndex: 'expireWarnDays',
      slotName: 'expireWarnDays',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
    },
    {
      title: '商品分类',
      dataIndex: 'goodsClassifyIdName',
      slotName: 'goodsClassifyIdName',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '批准文号',
      dataIndex: 'approvalNo',
      slotName: 'approvalNo',
      ellipsis: true,
      tooltip: true,
      width: 200,
      align: 'center',
    },
    {
      title: '批准文号有效期',
      dataIndex: 'approvalValidEnd',
      slotName: 'approvalValidEnd',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
    },
    {
      title: '大包装数量',
      dataIndex: 'bigPackageNum',
      slotName: 'bigPackageNum',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '大包装单位',
      dataIndex: 'bigPackageUnitLabel',
      slotName: 'bigPackageUnitLabel',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '中包装数量',
      dataIndex: 'midPackageNum',
      slotName: 'midPackageNum',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '中包装单位',
      dataIndex: 'midPackageUnitLabel',
      slotName: 'midPackageUnitLabel',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '小包装数量',
      dataIndex: 'smallPackageNum',
      slotName: 'smallPackageNum',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '小包装单位',
      dataIndex: 'smallPackageUnitLabel',
      slotName: 'smallPackageUnitLabel',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '商品出售包装形式',
      dataIndex: 'salePackageType',
      slotName: 'salePackageType',
      ellipsis: true,
      tooltip: true,
      width: 150,
      align: 'center',
      render: ({ record }) => {
        return record.salePackageType === 1 ? '整合出售' : '散装出售';
      },
    },
    {
      title: '省级编码',
      dataIndex: 'provinceCode',
      slotName: 'provinceCode',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '产地',
      dataIndex: 'originPlace',
      slotName: 'originPlace',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },

    {
      title: '处方标志',
      dataIndex: 'prescriptionFlag',
      slotName: 'prescriptionFlag',
      ellipsis: true,
      tooltip: true,
      width: 120,
      render: ({ record }) => {
        return record.prescriptionFlag === 1 ? '处方' : '非处方';
      },
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
    useCategoryStore().fetchGoodsCategoryList();
    goodsStore.fetchData();
    usePartnerStore().getpartnerList();
  });
</script>
