<template>
  <a-drawer width="50%" :visible="dialogFormVisible" unmount-on-close>
    <template #title> 签批 </template>
    <div class="detail-container">
      <div class="header">
        <div class="title">内蒙古全兴律师事务所</div>
        <div class="sub-title">案件代理、辩护审批表</div>
        <div class="case-no">
          {{ form?.caseNo ?? '' }}
        </div>
        <table class="pure-table">
          <tr>
            <td>
              <span>委托方</span>
            </td>
            <td>
              <span>{{ form.customerName }}</span>
            </td>
            <td>
              <span>诉讼地位</span>
            </td>
            <td>
              <span>{{ form.litigationStatus }}</span>
            </td>
            <td>
              <span>案由</span>
            </td>
            <td>
              <span>{{ form.causeAction }}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>对方当事人</span>
            </td>
            <td>
              <span>{{ form.otherSide }}</span>
            </td>
            <td>
              <span>诉讼地位</span>
            </td>
            <td>
              <span>{{ form.otherLitigationStatus }}</span>
            </td>
            <td>
              <span>第三人</span>
            </td>
            <td>
              <span>{{ form.thirdParty }}</span>
            </td>
          </tr>

          <tr>
            <td colspan="2">
              <span>初查：委托事务与本所承办其他案件是否有利益冲突</span>
            </td>
            <td>
              <span>{{ form.conflictInterest === 1 ? '有' : '无' }}</span>
            </td>
            <td>
              <span>标的额</span>
            </td>
            <td colspan="2">
              <span>{{ form.subjectAmount }}</span>
            </td>
          </tr>

          <tr>
            <td>
              <span>指明律师</span>
            </td>
            <td colspan="2">
              <span>{{ form.indicateLawyerName }}</span>
            </td>
            <td>
              <span>指定律师</span>
            </td>
            <td colspan="2">
              <span>{{ form.appointLawyerName }}</span>
            </td>
          </tr>

          <tr>
            <td>
              <span>受案法院</span>
            </td>
            <td colspan="2">
              <span>{{ form.acceptingCourt }}</span>
            </td>
            <td>
              <span>委托要求</span>
            </td>
            <td colspan="2">
              <span>{{ form.entrustRequire }}</span>
            </td>
          </tr>

          <tr>
            <td>
              <span>委托事项摘要</span>
            </td>
            <td colspan="5">
              <span>{{ form.entrustedMattersAbstract }}</span>
            </td>
          </tr>

          <tr>
            <td rowspan="2">
              <span>承办律师意见</span>
            </td>
            <!-- 合并输入-->
            <td colspan="2" rowspan="2">
              <span>{{ form.undertakeLawyerOpinion }}</span>
            </td>
            <td>收费金额</td>
            <td colspan="2">
              <span>{{ form.feeAmount }}</span>
            </td>
          </tr>

          <tr>
            <td>审批意见</td>
            <td colspan="2">
              <span
                v-if="form.approvalStatus === 2 || form.approvalStatus === 0"
                >{{ form.approvalOpinion }}</span
              >
              <a-input
                v-else
                v-model="form.approvalOpinion"
                placeholder="请输入审批意见"
                style="width: 100%"
              />
            </td>
          </tr>
        </table> </div
    ></div>
    <template #footer>
      <a-button @click="infoApprovalFormAddOrEditStore.handleCancel"
        >取消</a-button
      >
      <a-button
        type="primary"
        :loading="loading"
        @click="infoApprovalFormAddOrEditStore.handleApprove(emits)"
      >
        提交
      </a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { useInfoApprovalFormAddOrEditStore } from '@/store/modules/lawyer/cases/infoApprovalForm/infoApprovalFormAddOrEditStore';
  import { storeToRefs } from 'pinia';

  const infoApprovalFormAddOrEditStore = useInfoApprovalFormAddOrEditStore();
  const { form, dialogFormVisible, loading } = storeToRefs(
    infoApprovalFormAddOrEditStore,
  );

  const emits = defineEmits(['refresh']);

  defineExpose({
    init: infoApprovalFormAddOrEditStore.init,
    form,
  });
</script>

<style lang="less" scoped>
  .detail-container {
    margin: auto;
    max-width: 800px;
    height: 100%;
    .header {
      text-align: center;
      margin-bottom: 20px;

      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .sub-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .case-no {
        text-align: right;
        font-size: 16px;
      }
    }

    .pure-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin-top: 10px;

      // tr {
      //   &:nth-child(even) {
      //     background-color: #f9f9f9;
      //   }
      // }

      th,
      td {
        border: 1px solid #000;
        padding: 12px;
        vertical-align: middle;
        min-width: 100px;
        max-width: 250px;
        word-break: break-all;
        text-align: center;

        span {
          min-height: 20px;
          line-height: 20px;
        }

        &.label-cell {
          font-weight: bold;
          text-align: right;
        }
      }

      th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
    }
  }
</style>
