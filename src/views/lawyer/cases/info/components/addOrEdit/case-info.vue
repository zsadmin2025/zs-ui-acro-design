<template>
  <a-card class="general-card">
    <template #title> 案件信息 </template>
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item label="案件名称" field="caseInfo.caseName">
          <a-input
            v-model="form.caseInfo.caseName"
            placeholder="请输入案件名称"
          />
        </a-form-item>
      </a-col>
      <a-col v-if="form.caseInfo.caseInfoId" :span="12">
        <a-form-item label="案件编号" field="caseNo">
          <a-input
            v-model="form.caseInfo.caseNo"
            placeholder="请输入案件编号"
            disabled
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="案件类型" field="caseInfo.caseType">
          <a-cascader
            v-model="form.caseInfo.caseType"
            :options="caseType"
            :field-names="{ value: 'dictValue', label: 'dictLabel' }"
            placeholder="请选择案件类型"
            :alllow-clear="true"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="立项类型" field="projectType">
          <a-select
            v-model="form.caseInfo.projectType"
            placeholder="请选择客户"
          >
            <a-option
              v-for="item in projectType"
              :key="item.dictValue"
              :value="item.dictValue"
              >{{ item.dictLabel }}</a-option
            >
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
          <a-cascader
            v-model="form.caseInfo.litigationStatus"
            :options="caseLitigationStatus"
            :field-names="{ value: 'dictValue', label: 'dictLabel' }"
            placeholder="请选择诉讼地位"
            :alllow-clear="true"
          />
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
            <template #append> 元 </template>
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
                <a-option
                  v-for="os in caseInfoOurSide"
                  :key="os.dictValue"
                  :value="os.dictValue"
                  >{{ os.dictLabel }}</a-option
                >
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
                <a-option
                  v-for="os in caseInfoOtherSide"
                  :key="os.dictValue"
                  :value="os.dictValue"
                  >{{ os.dictLabel }}</a-option
                >
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
      <!-- <a-col :span="12">
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
        </a-form-item>
      </a-col> -->
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
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useDicts } from '@/hooks/dict';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form } = storeToRefs(infoAddOrEditStore);

  const {
    caseType,
    projectType,
    proxyStage,
    caseLitigationStatus,
    caseInfoOurSide,
    caseInfoOtherSide,
  } = useDicts(
    'caseType',
    'projectType',
    'proxyStage',
    'caseLitigationStatus',
    'caseInfoOurSide',
    'caseInfoOtherSide',
  );

  const handleDeleteOtherSide = (index: any) => {
    form.value.caseInfo.otherSide.splice(index, 1);
  };

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

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .our-side {
    width: 100%;
    .related-parties {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      // 选择器宽度
      :deep(.related-parties-select) {
        width: 200px;
        margin-right: 10px;
      }

      // 输入框宽度
      :deep(.related-parties-input) {
        width: calc(100% - 300px);
      }

      // 按钮
      :deep(.related-parties-button) {
        margin-left: 10px;
      }
    }
  }

  .other-side {
    width: 100%;
    .related-parties {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      // 选择器宽度
      :deep(.related-parties-select) {
        width: 200px;
        margin-right: 10px;
      }

      // 输入框宽度
      :deep(.related-parties-input) {
        width: calc(100% - 300px);
      }

      // 按钮
      :deep(.related-parties-button) {
        margin-left: 10px;
      }
    }
  }
</style>
