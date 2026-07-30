<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-form :model="form" label-align="left" :auto-label-width="true">
          <a-row :gutter="[16, 16]">
            <a-col :span="8">
              <a-form-item field="caseName" label="案件名称">
                <a-input
                  v-model="form.caseName"
                  placeholder="案件名称"
                  :allow-clear="true"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="caseNo" label="案件编号">
                <a-input
                  v-model="form.caseNo"
                  placeholder="案件编号"
                  :allow-clear="true"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="caseType" label="案件类型">
                <a-cascader
                  v-model="form.caseType"
                  :options="caseType"
                  :field-names="{ value: 'dictValue', label: 'dictLabel' }"
                  placeholder="请选择案件类型"
                  :allow-clear="true"
                />
              </a-form-item>
            </a-col>
            <template v-if="!collapsed">
              <a-col :span="8">
                <a-form-item field="proxyStage" label="代理阶段">
                  <a-select
                    v-model="form.proxyStage"
                    placeholder="请选择代理阶段"
                    :allow-clear="true"
                  >
                    <a-option
                      v-for="item in proxyStage"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      >{{ item.dictLabel }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="applicantName" label="申请人名称">
                  <a-input
                    v-model="form.applicantName"
                    placeholder="申请人名称"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
            </template>
            <a-col :flex="1">
              <div style="text-align: right">
                <a-space :size="9" wrap>
                  <a-button type="primary" @click="handleSearch">
                    <template #icon>
                      <icon-search />
                    </template>
                    {{ $t('searchTable.form.search') }}
                  </a-button>
                  <a-button @click="handleReset">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    {{ $t('searchTable.form.reset') }}
                  </a-button>
                  <a-button @click="collapsed = !collapsed">
                    <template #icon>
                      <icon-up v-if="!collapsed" />
                      <icon-down v-else />
                    </template>
                    {{ collapsed ? '展开' : '收起' }}
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
            <slot name="toolbar-left" />
          </a-col>
          <a-col
            v-if="appStore.device !== 'mobile'"
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="handleSearch"
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
          row-key="caseInfo"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
          :table-layout-fixed="true"
        >
          <template #caseStatus="{ record }">
            <span
              v-if="record.caseInfo.caseStatus === 0"
              class="circle fail"
            ></span>
            <span
              v-if="record.caseInfo.caseStatus === 1"
              class="circle pass"
            ></span>
            <span
              v-if="record.caseInfo.caseStatus === 2"
              class="circle warning"
            ></span>
            <span
              v-if="record.caseInfo.caseStatus === 3"
              class="circle unknown"
            ></span>

            <span v-if="record.caseInfo.caseStatus === 0">已作废</span>
            <span v-if="record.caseInfo.caseStatus === 1">进行中</span>
            <span v-if="record.caseInfo.caseStatus === 2">已结案</span>
            <span v-if="record.caseInfo.caseStatus === 3">已归档</span>
          </template>
          <template #isPaperContractSubmitted="{ record }">
            <slot name="is-paper-contract-submitted" :record="record">
              <a-switch
                v-model="record.caseInfo.isPaperContractSubmitted"
                :checked-value="1"
                :unchecked-value="0"
                type="round"
                :before-change="
                  (newValue): Promise<boolean> => infoStore.onSwitchIsPaperContractSubmittedChange(record, newValue) as Promise<boolean>
                "
              >
                <template #checked> 已提交 </template>
                <template #unchecked> 未提交 </template>
              </a-switch>
            </slot>
          </template>
          <template #isScannedContractSubmitted="{ record }">
            <a-tag
              v-if="
                record.caseContract &&
                record.caseContract.contractFileList.length > 0
              "
              color="rgb(var(--primary-6))"
            >
              已提交
            </a-tag>
            <a-tag
              v-if="
                record.caseContract &&
                record.caseContract.contractFileList.length === 0
              "
              color="gray"
            >
              未提交
            </a-tag>
          </template>
          <template #isLetterIssued="{ record }">
            <slot name="is-letter-issued" :record="record">
              <a-switch
                v-model="record.caseInfo.isLetterIssued"
                :checked-value="1"
                :unchecked-value="0"
                type="round"
                :before-change="
                  (newValue): Promise<boolean> => infoStore.onSwitchIsLetterIssuedChange(record, newValue) as Promise<boolean>
                "
              >
                <template #checked> 已开 </template>
                <template #unchecked> 未开 </template>
              </a-switch>
            </slot>
          </template>
          <template #isApprove="{ record }">
            <a-tag
              v-if="record.caseInfo.isApprove === 1"
              color="rgb(var(--primary-6))"
            >
              是
            </a-tag>
            <div v-else> -- </div>
          </template>
          <template #approveStatus="{ record }">
            <a-tag
              v-if="record.caseInfo.approveStatus === 2"
              color="rgb(var(--primary-6))"
            >
              审核通过
            </a-tag>
            <a-tag v-if="record.caseInfo.approveStatus === 1" color="gray">
              审核中
            </a-tag>
            <a-tag v-if="record.caseInfo.approveStatus === 0" color="red">
              已拒绝
            </a-tag>
          </template>
          <template #operations="{ record }">
            <slot name="operations" :record="record" />
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
          @change="infoStore.handleCurrentChange"
          @page-size-change="infoStore.handleSizeChange"
        />
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useInfoStore } from '@/store/modules/lawyer/cases/info/infoStore';
  import { useAppStore } from '@/store';
  import { useDicts } from '@/hooks/dict';

  // 案件页面类型 info-详情 filing-立案 cancel-作废 closed-结案 follow-up-跟进
  export type CasesPageType =
    | 'info'
    | 'filing'
    | 'cancel'
    | 'closed'
    | 'follow-up';

  const props = defineProps<{
    pageType: CasesPageType;
  }>();

  const appStore = useAppStore();
  const infoStore = useInfoStore();
  const { loading, list, total, form, selectedKeys } = storeToRefs(infoStore);

  const collapsed = ref(true);
  const { caseType, proxyStage, getLabel } = useDicts(
    'caseType',
    'proxyStage',
    'paymentMethod',
    'projectType',
    'caseLitigationStatus',
  );

  // 根据 pageType 映射加载方法
  const loadMethodMap: Record<CasesPageType, () => Promise<void>> = {
    'info': () => infoStore.fetchData(),
    'filing': () => infoStore.loadfilingPage(),
    'cancel': () => infoStore.loadcancelPage(),
    'closed': () => infoStore.loadclosedPage(),
    'follow-up': () => infoStore.loadfollowPage(),
  };

  const handleSearch = () => {
    loadMethodMap[props.pageType]();
  };

  const handleReset = () => {
    infoStore.reset();
    loadMethodMap[props.pageType]();
  };

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '案件编号',
      dataIndex: 'caseNo',
      ellipsis: true,
      tooltip: true,
      fixed: 'left',
      width: 160,
      render: ({ record }) => {
        return record.caseInfo.caseNo;
      },
    },
    {
      title: '项目名称',
      dataIndex: 'caseName',
      ellipsis: true,
      tooltip: true,
      width: 400,
      render: ({ record }) => {
        return record.caseInfo.caseName;
      },
    },
    {
      title: '案件状态',
      dataIndex: 'caseStatus',
      slotName: 'caseStatus',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      width: 100,
    },
    {
      title: '案件类型',
      dataIndex: 'caseType',
      ellipsis: true,
      tooltip: true,
      width: 120,
      render: ({ record }) => getLabel('caseType', record?.caseInfo?.caseType),
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      ellipsis: true,
      tooltip: true,
      width: 200,
      render: ({ record }) => {
        return record?.caseCustomer?.customerName ?? '--';
      },
    },
    {
      title: '承接律师',
      dataIndex: 'undertakeLawyer',
      ellipsis: true,
      tooltip: true,
      width: 100,
      render: ({ record }) => {
        return record.caseTeam?.undertakeLawyerVo?.realName ?? '';
      },
    },
    {
      title: '主办律师',
      dataIndex: 'leadLawyer',
      ellipsis: true,
      tooltip: true,
      width: 100,
      render: ({ record }) => {
        if (
          !record.caseTeam?.leadLawyerVos ||
          !Array.isArray(record.caseTeam.leadLawyerVos)
        ) {
          return '';
        }
        return record.caseTeam.leadLawyerVos
          .map((item: any) => item.realName)
          .filter(Boolean)
          .join('、');
      },
    },
    {
      title: '标的额',
      dataIndex: 'subjectAmount',
      ellipsis: true,
      tooltip: true,
      width: 100,
      render: ({ record }) => {
        return record.caseInfo.subjectAmount;
      },
    },
    {
      title: '诉讼地位',
      dataIndex: 'litigationStatus',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
      render: ({ record }) =>
        getLabel('caseLitigationStatus', record?.caseInfo?.litigationStatus),
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount',
      ellipsis: true,
      tooltip: true,
      width: 100,
      render: ({ record }) => {
        return record.caseContract?.contractAmount ?? '--';
      },
    },
    {
      title: '付款方式',
      dataIndex: 'paymentMethod',
      ellipsis: true,
      tooltip: true,
      width: 100,
      render: ({ record }) =>
        getLabel('paymentMethod', record?.caseContract?.paymentMethod),
    },
    {
      title: '纸质合同原件',
      dataIndex: 'isPaperContractSubmitted',
      slotName: 'isPaperContractSubmitted',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '合同扫描件',
      dataIndex: 'isScannedContractSubmitted',
      slotName: 'isScannedContractSubmitted',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '所函是否已开',
      dataIndex: 'isLetterIssued',
      slotName: 'isLetterIssued',
      ellipsis: true,
      tooltip: true,
      width: 120,
      align: 'center',
    },
    {
      title: '立项类型',
      dataIndex: 'projectType',
      ellipsis: true,
      tooltip: true,
      align: 'center',
      width: 100,
      render: ({ record }) =>
        getLabel('projectType', record?.caseInfo?.projectType),
    },
    {
      title: '申请人',
      dataIndex: 'applicantName',
      ellipsis: true,
      tooltip: true,
      width: 120,
      render: ({ record }) => {
        return record.caseInfo.applicantName;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      ellipsis: true,
      tooltip: true,
      width: 150,
      render: ({ record }) => {
        return record.caseInfo.applyDate;
      },
    },
    {
      title: '是否审批',
      dataIndex: 'isApprove',
      slotName: 'isApprove',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
    },
    {
      title: '主管领导意见',
      dataIndex: 'approvalOpinion',
      ellipsis: true,
      tooltip: true,
      width: 200,
      render: ({ record }) => {
        return record.caseInfo.approvalOpinion;
      },
    },
    {
      title: '审批律师',
      dataIndex: 'approvalLawyerName',
      ellipsis: true,
      tooltip: true,
      width: 200,
      render: ({ record }) => {
        return record.caseInfo.approvalLawyerName;
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '审批状态',
      dataIndex: 'approveStatus',
      slotName: 'approveStatus',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 210,
      align: 'center',
      fixed: 'right',
    },
  ]);

  onMounted(() => {
    loadMethodMap[props.pageType]();
  });

  // 暴露给父组件使用
  defineExpose({
    form,
    list,
    total,
    loading,
    selectedKeys,
    infoStore,
    handleSearch,
    handleReset,
  });
</script>
