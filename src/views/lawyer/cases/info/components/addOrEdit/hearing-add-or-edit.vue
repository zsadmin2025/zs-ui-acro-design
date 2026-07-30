<template>
  <a-modal
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    @cancel="close"
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
        <a-button @click="close">取消</a-button>
        <a-button type="primary" :loading="loading" @click="submit()">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import { FormInstance } from '@arco-design/web-vue';
  import { useDicts } from '@/hooks/dict';
  import { InfoFiles } from '@/types/lawyer/cases/infoFiles/infoFilesTypes';

  const dialogFormVisible = ref(false);
  const loading = ref(false);
  const formRef = ref<FormInstance | null>(null); //

  defineProps({
    caseHearingList: {
      type: Array,
      default: () => [],
    },
  });
  const caseInfoId = ref('');
  const { hearingProcedure } = useDicts('hearingProcedure');

  const rules = reactive({
    courtTime: [{ required: true, message: '请选择开庭时间' }],
    courtAcceptDate: [{ required: true, message: '请选择法院受理日期' }],
    hearingProcedure: [{ required: true, message: '请选择审理程序' }],
    court: [{ required: true, message: '请输入法院/仲裁委员会' }],
    courtLawyer: [{ required: true, message: '请选择开庭律师' }],
  });

  const form = ref({
    caseHearingId: '',
    caseInfoId: '',
    courtAcceptDate: '',
    hearingProcedure: '',
    courtTime: '',
    courtLawyer: '',
    court: '',
    courtCaseNumber: '',
    judge: '',
    judgePhone: '',
    courtClerk: '',
    courtClerkPhone: '',
    judgmentResult: '',
    serviceByPublicationDate: '',
    judgmentIssuedDate: '',
    judgmentSignDate: '',
    judgmentTakesEffect: '',
    judgmentContent: '',
    followUpSituation: '',
    caseHearingFilesList: [] as InfoFiles[],
  });

  const close = () => {
    formRef.value?.resetFields();
    dialogFormVisible.value = false;
  };
  const emits = defineEmits(['refresh', 'update:caseHearingList']);
  const submit = async () => {
    if (await formRef.value?.validate()) {
      return;
    }
    // 使用 emit 通知父组件更新列表
    emits('update:caseHearingList', form.value);
    dialogFormVisible.value = false;
  };

  // 打开弹窗并赋值
  const open = (row?: any, isEditMode?: boolean) => {
    dialogFormVisible.value = true;
    if (row && isEditMode !== undefined) {
      form.value = { ...row }; // 编辑模式：复制原数据
    } else {
      form.value = {
        caseHearingId: '',
        caseInfoId: caseInfoId.value,
        courtAcceptDate: '',
        hearingProcedure: '',
        courtTime: '',
        courtLawyer: '',
        court: '',
        courtCaseNumber: '',
        judge: '',
        judgePhone: '',
        courtClerk: '',
        courtClerkPhone: '',
        judgmentResult: '',
        serviceByPublicationDate: '',
        judgmentIssuedDate: '',
        judgmentSignDate: '',
        judgmentTakesEffect: '',
        judgmentContent: '',
        followUpSituation: '',
        caseHearingFilesList: [],
      };
    }
  };
  const handleAddFile = (fileItem: any) => {
    // 上传成功后，将文件信息赋值给 form.value.contractFileList
    form.value.caseHearingFilesList.push({
      caseInfoFilesId: '',
      caseInfoId: caseInfoId.value,
      caseOtherId: '',
      fileSource: '',
      fileName: fileItem.fileOriginalName,
      fileType: fileItem.fileType,
      fileSize: fileItem.fileSize,
      fileUrl: fileItem.fileUrl,
    });
  };

  const handleRemoveFile = (fileItem: any) => {
    // 删除成功后，将文件信息从列表中移除
    form.value.caseHearingFilesList = form.value.caseHearingFilesList.filter(
      (item: any) => item.fileUrl !== fileItem.fileUrl,
    );
  };

  onMounted(() => {});
  defineExpose({
    form,
    caseInfoId,
    open,
    visible: dialogFormVisible,
  });
</script>
