<template>
  <a-drawer
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="infoAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.caseInfo.caseInfoId ? '新增案件信息' : '修改案件信息' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-space direction="vertical" :size="16">
        <a-card class="general-card">
          <template #title> 客户信息 </template>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="客户名称" name="customerId">
                <a-select
                  v-model="form.caseCustomer.customerId"
                  placeholder="请选择客户"
                >
                  <a-option
                    v-for="item in customerList"
                    :key="item.customerId"
                    :value="item.customerId"
                    >{{ item.customerName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="客户编号" name="customerCode">
                <a-input v-model="form.caseCustomer.customerCode" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="客户状态" name="customerType">
                <a-select
                  v-model="form.caseCustomer.customerType"
                  placeholder="请选择客户"
                >
                  <a-option
                    v-for="item in customerType"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card">
          <template #title> 案件信息 </template>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="案件名称" field="caseName">
                <a-input
                  v-model="form.caseInfo.caseName"
                  placeholder="请输入案件名称"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="案件编号" field="caseNo">
                <a-input
                  v-model="form.caseInfo.caseNo"
                  placeholder="请输入案件编号"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="案件类型" field="caseType">
                <a-select
                  v-model="form.caseInfo.caseType"
                  placeholder="请选择案件类型"
                >
                  <a-option :value="0">刑事案件</a-option>
                  <a-option :value="1">合同纠纷</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="代理阶段" field="proxyStage">
                <a-select
                  v-model="form.caseInfo.proxyStage"
                  placeholder="请选择代理阶段"
                  multiple
                  :max-tag-count="2"
                  allow-clear
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
            <a-col :span="12">
              <a-form-item label="当前阶段" field="nowStage">
                <a-select
                  v-model="form.caseInfo.nowStage"
                  placeholder="请选择当前阶段"
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
            <a-col :span="12">
              <a-form-item label="诉讼地位" field="litigationStatus">
                <a-select
                  v-model="form.caseInfo.litigationStatus"
                  placeholder="请选择诉讼地位"
                >
                  <a-option :value="0">上诉人</a-option>
                  <a-option :value="1">被上诉人</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="标的金额" field="subjectAmount">
                <a-input-number
                  v-model="form.caseInfo.subjectAmount"
                  placeholder="请输入标的金额"
                  :precision="2"
                  :min="0"
                >
                  <template #append> 元</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="我方" field="ourSide">
                <div class="our-side">
                  <div
                    v-for="(item, index) in form.caseInfo.ourSide"
                    :key="index"
                    class="related-parties"
                  >
                    <a-select
                      v-model="item.relationType"
                      placeholder="请选择关联关系"
                      class="related-parties-select"
                    >
                      <a-option value="1">我方</a-option>
                      <a-option value="2">我方关联</a-option>
                    </a-select>
                    <a-input
                      v-model="item.relatedName"
                      placeholder="请输入关联名称"
                      class="related-parties-input"
                    />
                    <a-button
                      type="primary"
                      shape="circle"
                      size="mini"
                      class="related-parties-button"
                      @click="handleAddOurSide()"
                    >
                      <icon-plus />
                    </a-button>
                    <a-button
                      v-if="index > 0"
                      type="primary"
                      shape="circle"
                      size="mini"
                      status="danger"
                      class="related-parties-button"
                      @click="handleDeleteOurSide(item)"
                    >
                      <icon-delete />
                    </a-button>
                  </div>
                </div>
              </a-form-item>
              <a-form-item label="对方" field="otherSide">
                <div class="other-side">
                  <div
                    v-for="(item, index) in form.caseInfo.otherSide"
                    :key="index"
                    class="related-parties"
                  >
                    <a-select
                      v-model="item.relationType"
                      placeholder="请选择关联关系"
                      class="related-parties-select"
                    >
                      <a-option value="1">对方</a-option>
                      <a-option value="2">对方关联</a-option>
                    </a-select>
                    <a-input
                      v-model="item.relatedName"
                      placeholder="请输入关联名称"
                      class="related-parties-input"
                    />
                    <a-button
                      type="primary"
                      shape="circle"
                      size="mini"
                      class="related-parties-button"
                      @click="handleAddOtherSide()"
                    >
                      <icon-plus />
                    </a-button>
                    <a-button
                      v-if="index > 0"
                      type="primary"
                      shape="circle"
                      size="mini"
                      status="danger"
                      class="related-parties-button"
                      @click="handleDeleteOtherSide(item)"
                    >
                      <icon-delete />
                    </a-button>
                  </div>
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="申请时间" field="applyDate">
                <a-date-picker
                  v-model="form.caseInfo.applyDate"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="申请人：" field="applicant">
                <span>{{ form.caseInfo.applicantName }}</span>
                <!-- <a-input
                  v-model="form.caseInfo.applicant"
                  placeholder="请输入申请人"
                /> -->
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="案情简介" field="caseIntroduction">
                <a-textarea
                  v-model="form.caseInfo.caseIntroduction"
                  placeholder="请输入案情简介"
                  rows="2"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="委托事宜" field="entrustmentMatters">
                <a-textarea
                  v-model="form.caseInfo.entrustmentMatters"
                  placeholder="请输入委托事宜"
                  rows="2"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card">
          <template #title> 开庭信息 </template>
          <template #extra>
            <a-button type="primary">
              <template #icon>
                <icon-plus />
              </template>
              登记
            </a-button>
          </template>
          <div class="hearing-card">
            <a-row :gutter="16">
              <a-empty />
            </a-row>
          </div>
        </a-card>
        <a-card class="general-card">
          <template #title> 团队信息 </template>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="承接律师" field="undertakeLawyer">
                <a-select
                  v-model="form.caseTeam.undertakeLawyer"
                  placeholder="请选择承接律师"
                  allow-search
                >
                  <a-option
                    v-for="item in userList"
                    :key="item.sysUserId"
                    :value="item.sysUserId"
                    >{{ item.realName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="协接律师" field="coordinatingLawyer">
                <a-select
                  v-model="form.caseTeam.coordinatingLawyer"
                  placeholder="请选择协接律师"
                  allow-search
                >
                  <a-option
                    v-for="item in userList"
                    :key="item.sysUserId"
                    :value="item.sysUserId"
                    >{{ item.realName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="主办律师" field="leadLawyer">
                <a-select
                  v-model="form.caseTeam.leadLawyer"
                  placeholder="请选择主办律师"
                  allow-search
                >
                  <a-option
                    v-for="item in userList"
                    :key="item.sysUserId"
                    :value="item.sysUserId"
                    >{{ item.realName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="协办人员" field="coOrganizer">
                <a-select
                  v-model="form.caseTeam.coOrganizer"
                  placeholder="请选择协办人员"
                  allow-search
                >
                  <a-option
                    v-for="item in userList"
                    :key="item.sysUserId"
                    :value="item.sysUserId"
                    >{{ item.realName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="助理" field="assistant">
                <a-select
                  v-model="form.caseTeam.assistant"
                  placeholder="请选择助理"
                  allow-search
                >
                  <a-option
                    v-for="item in userList"
                    :key="item.sysUserId"
                    :value="item.sysUserId"
                    >{{ item.realName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="秘书" field="secretary">
                <a-select
                  v-model="form.caseTeam.secretary"
                  placeholder="请选择秘书"
                  allow-search
                >
                  <a-option
                    v-for="item in userList"
                    :key="item.sysUserId"
                    :value="item.sysUserId"
                    >{{ item.realName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card">
          <template #title> 合同信息 </template>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="起始日期" field="startDate">
                <a-date-picker
                  v-model="form.caseContract.startDate"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="合同金额" field="contractAmount">
                <a-input-number
                  v-model="form.caseContract.contractAmount"
                  placeholder="请输入合同金额"
                  :precision="2"
                  :min="0"
                >
                  <template #append> 元</template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="付款方式" field="paymentMethod">
                <a-select
                  v-model="form.caseContract.paymentMethod"
                  placeholder="请选择当前阶段"
                >
                  <a-option
                    v-for="item in paymentMethod"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="付款方式明细" field="paymentMethodDetails">
                <a-textarea
                  v-model="form.caseContract.paymentMethodDetails"
                  placeholder="请输入付款方式明细"
                  rows="2"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="合同付款节点" field="contractNode">
                <a-table
                  :columns="columns"
                  :data="form.caseContract.contractNodeList"
                  :pagination="false"
                  :scroll="{ x: '100%', y: '100%' }"
                >
                  <template #paymentCategory="{ record }">
                    <a-select
                      v-model="record.paymentCategory"
                      placeholder="请选择款项类别"
                    >
                      <a-option
                        v-for="item in paymentCategory"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        >{{ item.dictLabel }}</a-option
                      >
                    </a-select>
                  </template>
                  <template #paymentName="{ record }">
                    <a-input v-model="record.paymentName" />
                  </template>
                  <template #receivableAmount="{ record }">
                    <a-input v-model="record.receivableAmount" />
                  </template>
                  <template #expectedCollectionDate="{ record }">
                    <a-date-picker v-model="record.expectedCollectionDate" />
                  </template>
                  <template #paymentTerms="{ record }">
                    <a-input v-model="record.paymentTerms" />
                  </template>
                  <template #operations="{ rowIndex }">
                    <a-space>
                      <a-button
                        type="text"
                        size="small"
                        status="danger"
                        @click="handleDeleteNode(rowIndex)"
                      >
                        删除
                      </a-button>
                    </a-space>
                  </template>
                  <template #footer>
                    <a-button
                      type="text"
                      style="width: 100%"
                      @click="handleAddNode"
                    >
                      <template #icon>
                        <icon-plus />
                      </template>
                      <template #default>添加付款节点</template>
                    </a-button>
                  </template>
                </a-table>
              </a-form-item>
            </a-col>
            <a-col :span="12"></a-col>
            <a-col :span="12"></a-col>
          </a-row>
        </a-card>
        <a-card class="general-card">
          <template #title> 利冲信息 </template>
        </a-card>
      </a-space>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="infoAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="infoAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';
  import { useCustomerStore } from '@/store/modules/lawyer/customer/customerStore';
  import { useUserStore } from '@/store/modules/sys/user/userStore';
  import { useDicts } from '@/hooks/dict';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } =
    storeToRefs(infoAddOrEditStore);

  const { customerType, paymentCategory, proxyStage, paymentMethod } = useDicts(
    'customerType',
    'paymentCategory',
    'proxyStage',
    'paymentMethod',
  );

  const { customerList } = storeToRefs(useCustomerStore());

  const userList = computed(() => useUserStore().userList);

  const columns: TableColumnData[] = [
    {
      title: '款项类别',
      dataIndex: 'paymentCategory',
      slotName: 'paymentCategory',
    },
    {
      title: '款项名称',
      dataIndex: 'paymentName',
      slotName: 'paymentName',
    },
    {
      title: '应收金额/元',
      dataIndex: 'receivableAmount',
      slotName: 'receivableAmount',
    },
    {
      title: '预计收款时间',
      dataIndex: 'expectedCollectionDate',
      slotName: 'expectedCollectionDate',
    },
    {
      title: '收款条件',
      dataIndex: 'paymentTerms',
      slotName: 'paymentTerms',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 100,
      align: 'center',
      fixed: 'right',
    },
  ];

  const handleAddOurSide = () => {
    form.value.caseInfo.ourSide.push({
      caseRelatedPartiesId: '',
      caseInfoId: '',
      role: 'our_side',
      relationType: '',
      relatedName: '',
    });
  };
  const handleDeleteOurSide = (index: any) => {
    form.value.caseInfo.ourSide.splice(index, 1);
  };
  const handleAddOtherSide = () => {
    form.value.caseInfo.otherSide.push({
      caseRelatedPartiesId: '',
      caseInfoId: '',
      role: 'other_side',
      relationType: '',
      relatedName: '',
    });
  };

  const handleDeleteOtherSide = (index: any) => {
    form.value.caseInfo.otherSide.splice(index, 1);
  };
  const handleAddNode = () => {
    // 添加节点
    form.value.caseContract.contractNodeList.push({
      caseContractNodeId: '',
      caseInfoId: '',
      caseContractId: '',
      paymentCategory: '',
      paymentName: '',
      receivableAmount: 0.0,
      expectedCollectionDate: '',
      paymentTerms: '',
    });
  };
  const handleDeleteNode = (index: number) => {
    // 删除节点,
    form.value.caseContract.contractNodeList.splice(index, 1);
  };
  onMounted(() => {
    useCustomerStore().loadlist();
    useUserStore().loadUserList();
  });

  const emits = defineEmits(['refresh']);

  defineExpose({
    init: infoAddOrEditStore.init,
    form,
  });
</script>

<style lang="less" scoped>
  .hearing-card {
    background-color: var(--color-fill-2);
  }
  .our-side {
    width: 100%;
    .related-parties {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      // 选择器
      //  :deep(.related-parties-select) {
      width: 200px;
      margin-right: 10px;
    }

    // 输入框宽元      :deep(.related-parties-input) {
    width: calc(100% - 300px);
  }

  // 按钮
  :deep(.related-parties-button) {
    margin-left: 10px;
  }

  .other-side {
    width: 100%;
    .related-parties {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      // 选择器宽元      :deep(.related-parties-select) {
      width: 200px;
      margin-right: 10px;
    }

    // 输入框宽元      :deep(.related-parties-input) {
    width: calc(100% - 300px);
  }

  // 按钮
  :deep(.related-parties-button) {
    margin-left: 10px;
  }
</style>
