<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="infoApprovalFormAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{
          !form.caseInfoApprovalFormId ? '新增案件审批信息' : '修改案件审批信息'
        }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-form-item label="" field="caseInfoApprovalFormId">
        <a-input
          v-model="form.caseInfoApprovalFormId"
          placeholder="请输入案件审批信息ID"
        />
      </a-form-item>
      <a-form-item label="案件表id" field="caseInfoId">
        <a-input v-model="form.caseInfoId" placeholder="请输入案件表id" />
      </a-form-item>
      <a-form-item label="案件编号" field="caseNo">
        <a-input v-model="form.caseNo" placeholder="请输入案件编号" />
      </a-form-item>
      <a-form-item label="委托人" field="customerName">
        <a-input v-model="form.customerName" placeholder="请输入委托人" />
      </a-form-item>
      <a-form-item label="诉讼地位" field="litigationStatus">
        <a-radio-group v-model="form.litigationStatus">
          <a-radio value="0">0</a-radio>
          <a-radio value="1">1</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="案由" field="causeAction">
        <a-input v-model="form.causeAction" placeholder="请输入案由" />
      </a-form-item>
      <a-form-item label="对方当事人" field="otherSide">
        <a-input v-model="form.otherSide" placeholder="请输入对方当事人" />
      </a-form-item>
      <a-form-item label="对方诉讼地位" field="otherLitigationStatus">
        <a-radio-group v-model="form.otherLitigationStatus">
          <a-radio value="0">0</a-radio>
          <a-radio value="1">1</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="第三方" field="thirdParty">
        <a-input v-model="form.thirdParty" placeholder="请输入第三方" />
      </a-form-item>
      <a-form-item label="是否有利益冲突" field="conflictInterest">
        <a-input-number
          v-model="form.conflictInterest"
          placeholder="请输入是否有利益冲突"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="标的金额" field="subjectAmount">
        <a-input-number
          v-model="form.subjectAmount"
          placeholder="请输入标的金额"
          :precision="2"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="指明律师" field="indicateLawyer">
        <a-input v-model="form.indicateLawyer" placeholder="请输入指明律师" />
      </a-form-item>
      <a-form-item label="指明律师名称" field="indicateLawyerName">
        <a-input
          v-model="form.indicateLawyerName"
          placeholder="请输入指明律师名称"
        />
      </a-form-item>
      <a-form-item label="指定律师" field="appointLawyer">
        <a-input v-model="form.appointLawyer" placeholder="请输入指定律师" />
      </a-form-item>
      <a-form-item label="指定律师名称" field="appointLawyerName">
        <a-input
          v-model="form.appointLawyerName"
          placeholder="请输入指定律师名称"
        />
      </a-form-item>
      <a-form-item label="受理法院" field="acceptingCourt">
        <a-input v-model="form.acceptingCourt" placeholder="请输入受理法院" />
      </a-form-item>
      <a-form-item label="委托要求" field="entrustRequire">
        <a-input v-model="form.entrustRequire" placeholder="请输入委托要求" />
      </a-form-item>
      <a-form-item label="委托事项摘要" field="entrustedMattersAbstract">
        <a-input
          v-model="form.entrustedMattersAbstract"
          placeholder="请输入委托事项摘要"
        />
      </a-form-item>
      <a-form-item label="承接律师意见" field="undertakeLawyerOpinion">
        <a-input
          v-model="form.undertakeLawyerOpinion"
          placeholder="请输入承接律师意见"
        />
      </a-form-item>
      <a-form-item label="收费金额" field="feeAmount">
        <a-input-number
          v-model="form.feeAmount"
          placeholder="请输入收费额"
          :precision="2"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="审批意见" field="approvalOpinion">
        <a-input v-model="form.approvalOpinion" placeholder="请输入审批意见" />
      </a-form-item>
      <a-form-item label="申请人" field="applicant">
        <a-input v-model="form.applicant" placeholder="请输入申请人" />
      </a-form-item>
      <a-form-item label="申请人名称" field="applicantName">
        <a-input v-model="form.applicantName" placeholder="请输入申请人名称" />
      </a-form-item>
      <a-form-item
        label="审批状态0-拒绝 1-审批中2-审批通过"
        field="approvalStatus"
      >
        <a-radio-group v-model="form.approvalStatus">
          <a-radio value="0">0</a-radio>
          <a-radio value="1">1</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="infoApprovalFormAddOrEditStore.close">取消</a-button>
        <a-button type="primary" :loading="loading"> 确定 </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useInfoApprovalFormAddOrEditStore } from '@/store/modules/lawyer/cases/infoApprovalForm/infoApprovalFormAddOrEditStore';
  import { storeToRefs } from 'pinia';

  const infoApprovalFormAddOrEditStore = useInfoApprovalFormAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } = storeToRefs(
    infoApprovalFormAddOrEditStore,
  );

  defineExpose({
    init: infoApprovalFormAddOrEditStore.init,
    form,
  });
</script>
