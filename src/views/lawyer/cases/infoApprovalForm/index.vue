<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row v-if="queryVisible">
          <a-col :flex="1">
            <a-form
              :model="form"
              :label-col-props="{ span: 6 }"
              :wrapper-col-props="{ span: 18 }"
              label-align="left"
            >
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item field="caseInfoApprovalFormId" label="">
                    <a-input
                      v-model="form.caseInfoApprovalFormId"
                      placeholder=""
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="caseInfoId" label="案件表id">
                    <a-input v-model="form.caseInfoId" placeholder="案件表id" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="caseNo" label="案件编号">
                    <a-input v-model="form.caseNo" placeholder="案件编号" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item field="status" label="状态">
                    <a-select
                      v-model="form.status"
                      placeholder="请选择状态"
                      allow-clear
                    >
                      <a-option :value="0">启用</a-option>
                      <a-option :value="1">禁用</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider style="height: 84px" direction="vertical" />
          <a-col :flex="'86px'" style="text-align: right">
            <a-space direction="vertical" :size="18">
              <a-button type="primary" @click="infoApprovalFormStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="infoApprovalFormStore.reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
          <a-divider style="margin-top: 0" />
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'cases:infoApprovalForm:save'"
                type="primary"
                @click="infoApprovalFormStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'cases:infoApprovalForm:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="infoApprovalFormStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'cases:infoApprovalForm:export'"
                @click="infoApprovalFormStore.handleExport()"
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
              <a-input-search
                v-model="form.infoApprovalFormName"
                placeholder="请输入岗位名称"
                :allow-clear="true"
                @search="infoApprovalFormStore.fetchData"
              >
              </a-input-search>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div
                  class="action-icon"
                  @click="() => infoApprovalFormStore.reset()"
                  ><icon-refresh size="18"
                /></div>
              </a-tooltip>
              <a-tooltip content="高级筛选">
                <icon-double-up
                  v-if="queryVisible"
                  size="18"
                  @click="handleAdvancedSearch"
                />
                <icon-double-down
                  v-else
                  size="18"
                  @click="handleAdvancedSearch"
                />
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main>
        <a-table
          v-model:selected-keys="selectedKeys"
          :row-selection="rowSelection"
          row-key="caseInfoApprovalFormId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <span v-if="record.status === 0" class="circle fail"></span>
            <span v-else-if="record.status === 1" class="circle pass"></span>
            <span v-if="record.status === 0"> 禁用 </span>
            <span v-else-if="record.status === 1"> 启用 </span>
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-button
                v-permission="'cases:infoApprovalForm:update'"
                type="text"
                size="small"
                @click="infoApprovalFormStore.handleAddOrEdit(record)"
              >
                编辑
              </a-button>
              <a-button
                v-permission="'cases:infoApprovalForm:delete'"
                type="text"
                size="small"
                status="danger"
                @click="infoApprovalFormStore.handleDelete(record)"
              >
                删除
              </a-button>
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
          @change="infoApprovalFormStore.handleCurrentChange"
          @page-size-change="infoApprovalFormStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <InfoApprovalFormAddOrEdit
      ref="addEditRef"
      @refresh="infoApprovalFormStore.fetchData"
    />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useInfoApprovalFormStore } from '@/store/modules/lawyer/cases/infoApprovalForm/infoApprovalFormStore';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import InfoApprovalFormAddOrEdit from './components/infoApprovalForm-add-or-edit.vue';

  const infoApprovalFormStore = useInfoApprovalFormStore();
  const { addEditRef, loading, list, total, form, selectedKeys } = storeToRefs(
    infoApprovalFormStore,
  );

  const rowSelection = reactive({
    type: 'checkbox' as const,
    showCheckedAll: true,
  });

  const queryVisible = ref(false);
  const dynamicHeight = ref();

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
      title: '',
      dataIndex: 'caseInfoApprovalFormId',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '案件表id',
      dataIndex: 'caseInfoId',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '案件编号',
      dataIndex: 'caseNo',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '委托人',
      dataIndex: 'customerName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '诉讼地位',
      dataIndex: 'litigationStatus',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '案由',
      dataIndex: 'causeAction',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '对方当事人',
      dataIndex: 'otherSide',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '对方诉讼地位',
      dataIndex: 'otherLitigationStatus',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '第三方',
      dataIndex: 'thirdParty',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '是否有利益冲突',
      dataIndex: 'conflictInterest',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '标的金额',
      dataIndex: 'subjectAmount',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '指明律师',
      dataIndex: 'indicateLawyer',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '指明律师名称',
      dataIndex: 'indicateLawyerName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '指定律师',
      dataIndex: 'appointLawyer',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '指定律师名称',
      dataIndex: 'appointLawyerName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '受理法院',
      dataIndex: 'acceptingCourt',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '委托要求',
      dataIndex: 'entrustRequire',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '委托事项摘要',
      dataIndex: 'entrustedMattersAbstract',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '承接律师意见',
      dataIndex: 'undertakeLawyerOpinion',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '收费额',
      dataIndex: 'feeAmount',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '审批意见',
      dataIndex: 'approvalOpinion',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '申请人名称',
      dataIndex: 'applicantName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '更新人',
      dataIndex: 'updater',
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
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref<'small' | 'mini' | 'medium' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'mini' | 'medium' | 'large';
  };

  const handleAdvancedSearch = () => {
    queryVisible.value = !queryVisible.value;
    if (queryVisible.value) {
      dynamicHeight.value = '180';
    } else {
      dynamicHeight.value = 'var(--header-box-height)';
    }
  };
  onMounted(() => {
    infoApprovalFormStore.fetchData();
  });
</script>
