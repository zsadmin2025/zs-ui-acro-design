<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="hearingAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.caseHearingId ? '新增案件开庭信息' : '修改案件开庭信息' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="开庭时间" field="courtTime">
            <a-date-picker
              v-model="form.courtTime"
              show-time
              format="YYYY-MM-DD hh:mm"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法院受理日期" field="courtAcceptDate">
            <a-date-picker v-model="form.courtAcceptDate" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="审理程序" field="hearingProcedure">
            <a-select
              v-model="form.hearingProcedure"
              placeholder="请选择审理程序"
            >
              <a-option
                v-for="item in hearingProcedure"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictLabel }}</a-option
              >
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="开庭律师" field="courtLawyer">
            <a-input v-model="form.courtLawyer" placeholder="请输入开庭律师" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法院/仲裁委员会" field="court">
            <a-input v-model="form.court" placeholder="请输入法院/仲裁委员会" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法院案号" field="courtCaseNumber">
            <a-input
              v-model="form.courtCaseNumber"
              placeholder="请输入法院案号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法官" field="judge">
            <a-input v-model="form.judge" placeholder="请输入法官" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="法官电话" field="judgePhone">
            <a-input v-model="form.judgePhone" placeholder="请输入法官电话" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="书记员" field="courtClerk">
            <a-input v-model="form.courtClerk" placeholder="请输入书记员" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="书记员电话" field="courtClerkPhone">
            <a-input
              v-model="form.courtClerkPhone"
              placeholder="请输入书记员电话"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="判决结果" field="judgmentResult">
            <a-input
              v-model="form.judgmentResult"
              placeholder="请输入判决结果"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="公告送达日期" field="serviceByPublicationDate">
            <a-date-picker
              v-model="form.serviceByPublicationDate"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="判决签发日期" field="judgmentIssuedDate">
            <a-date-picker
              v-model="form.judgmentIssuedDate"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="判决签收日期" field="judgmentSignDate">
            <a-date-picker
              v-model="form.judgmentSignDate"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="判决生效日期" field="judgmentTakesEffect">
            <a-date-picker
              v-model="form.judgmentTakesEffect"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="判决内容" field="judgmentContent">
            <a-textarea
              v-model="form.judgmentContent"
              placeholder="请输入判决内容"
              rows="2"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="跟进情况" field="followUpSituation">
            <a-textarea
              v-model="form.followUpSituation"
              placeholder="请输入跟进情况"
              rows="3"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="上传文件" field="caseHearingFilesList">
            <zs-upload-files
              v-model="form.caseHearingFilesList"
              multiple
              style="width: 100%"
              @add="handleAddFile"
              @remove="handleRemoveFile"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="hearingAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="hearingAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useHearingAddOrEditStore } from '@/store/modules/lawyer/cases/hearing/hearingAddOrEditStore';
  import { useDicts } from '@/hooks/dict';

  const hearingAddOrEditStore = useHearingAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } = storeToRefs(
    hearingAddOrEditStore,
  );
  const { hearingProcedure } = useDicts('hearingProcedure');
  const emits = defineEmits(['refresh']);

  const handleAddFile = (fileItem: any) => {
    // 上传成功后，将文件信息赋值给 form.value.contractFileList
    form.value.caseHearingFilesList.push({
      caseInfoFilesId: '',
      caseInfoId: form.value.caseInfoId,
      caseOtherId: form.value?.caseHearingId ?? '',
      fileSource: '',
      fileName: fileItem.fileOriginalName,
      fileType: fileItem.fileType,
      fileSize: fileItem.fileSize,
      fileUrl: fileItem.fileUrl,
    });
  };

  const handleRemoveFile = (fileItem: any) => {
    // 删除成功后，将文件信息从 form.value.contractFileList 中删除
    form.value.caseHearingFilesList = form.value.caseHearingFilesList.filter(
      (item: any) => item.fileUrl !== fileItem.fileUrl,
    );
  };
  onMounted(() => {});
  defineExpose({
    init: hearingAddOrEditStore.init,
    form,
  });
</script>
