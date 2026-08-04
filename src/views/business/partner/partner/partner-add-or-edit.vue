<template>
  <a-drawer
    v-model:visible="dialogFormVisible"
    width="50%"
    title-align="start"
    :draggable="true"
    :mask-closable="false"
    :esc-to-close="false"
    @cancel="partnerAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.partnerId ? '新增往来单位' : '修改往来单位' }}
      </h4>
    </template>
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <!-- ==================== 基本信息 ==================== -->
      <zs-section title="基本信息">
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="单位大类" field="partnerCategoryId">
              <a-select
                v-model="form.partnerCategoryId"
                placeholder="请选择单位大类"
                allow-clear
                allow-search
              >
                <a-option
                  v-for="item in partnerCategoryList"
                  :key="item.businessPartnerCategoryId"
                  :value="item.businessPartnerCategoryId"
                  >{{ item.partnerCategoryName }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="企业名称" field="companyName">
              <a-input
                v-model="form.companyName"
                placeholder="请输入企业名称"
                :max-length="200"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="单位类型" field="partnerType">
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
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="企业地址" field="companyAddress">
              <a-input
                v-model="form.companyAddress"
                placeholder="请输入企业地址"
                :max-length="500"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="仓库地址" field="warehouseAddress">
              <a-input
                v-model="form.warehouseAddress"
                placeholder="请输入仓库地址"
                :max-length="500"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="简称" field="shortName">
              <a-input
                v-model="form.shortName"
                placeholder="请输入简称"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="名称首拼" field="namePinyin">
              <a-input
                v-model="form.namePinyin"
                placeholder="请输入名称首拼"
                :max-length="200"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="联系人" field="contactPerson">
              <a-input
                v-model="form.contactPerson"
                placeholder="请输入联系人"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </zs-section>

      <!-- ==================== 联系方式 ==================== -->
      <zs-section title="联系方式">
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="企业电话" field="companyPhone">
              <a-input
                v-model="form.companyPhone"
                placeholder="请输入企业电话"
                :max-length="50"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="手机号" field="mobile">
              <a-input
                v-model="form.mobile"
                placeholder="请输入手机号"
                :max-length="20"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="传真" field="fax">
              <a-input
                v-model="form.fax"
                placeholder="请输入传真"
                :max-length="50"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="电子邮箱" field="email">
              <a-input
                v-model="form.email"
                placeholder="请输入电子邮箱"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </zs-section>

      <!-- ==================== 结算与资质 ==================== -->
      <zs-section title="结算与资质">
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="档案号" field="fileNo">
              <a-input
                v-model="form.fileNo"
                placeholder="请输入档案号"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="结算状态" field="settlementStatus">
              <a-select
                v-model="form.settlementStatus"
                placeholder="请选择结算状态"
                allow-clear
              >
                <a-option :value="0">未结算</a-option>
                <a-option :value="1">已结算</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="结算账期(天)" field="settlementPeriod">
              <a-input-number
                v-model="form.settlementPeriod"
                placeholder="请输入结算账期(天)"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="单位状态" field="status">
              <a-switch
                v-model="form.status"
                :checked-value="1"
                :unchecked-value="0"
                type="round"
              >
                <template #checked> 正常 </template>
                <template #unchecked> 停用 </template>
              </a-switch>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="统一社会信用代码" field="socialCreditCode">
              <a-input
                v-model="form.socialCreditCode"
                placeholder="请输入统一社会信用代码"
                :max-length="50"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="有效期至" field="validUntil">
              <a-date-picker
                v-model="form.validUntil"
                placeholder="请选择有效期至"
                value-format="YYYY-MM-DD"
                :style="{ width: '100%' }"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="开户银行" field="bankName">
              <a-input
                v-model="form.bankName"
                placeholder="请输入开户银行"
                :max-length="200"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="银行账号" field="bankAccount">
              <a-input
                v-model="form.bankAccount"
                placeholder="请输入银行账号"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </zs-section>

      <!-- ==================== 人员信息 ==================== -->
      <zs-section title="人员信息">
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="企业负责人" field="companyPrincipal">
              <a-input
                v-model="form.companyPrincipal"
                placeholder="请输入企业负责人"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="联系电话" field="principalPhone">
              <a-input
                v-model="form.principalPhone"
                placeholder="请输入企业负责人-联系电话"
                :max-length="30"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="企业管理员" field="companyManager">
              <a-input
                v-model="form.companyManager"
                placeholder="请输入企业管理员"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="联系电话" field="managerPhone">
              <a-input
                v-model="form.managerPhone"
                placeholder="请输入企业管理员-联系电话"
                :max-length="30"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="质量负责人" field="qualityPrincipal">
              <a-input
                v-model="form.qualityPrincipal"
                placeholder="请输入质量负责人"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="联系电话" field="qualityPhone">
              <a-input
                v-model="form.qualityPhone"
                placeholder="请输入质量负责人-联系电话"
                :max-length="30"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="质量管理员" field="qualityManager">
              <a-input
                v-model="form.qualityManager"
                placeholder="请输入质量管理员"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="联系电话" field="qualityManagerPhone">
              <a-input
                v-model="form.qualityManagerPhone"
                placeholder="请输入质量管理员联系电话"
                :max-length="20"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="财务负责人" field="financePrincipal">
              <a-input
                v-model="form.financePrincipal"
                placeholder="请输入财务负责人"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="联系电话" field="financePhone">
              <a-input
                v-model="form.financePhone"
                placeholder="请输入财务负责人联系电话"
                :max-length="20"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="质量机构负责人" field="qualityOrgPrincipal">
              <a-input
                v-model="form.qualityOrgPrincipal"
                placeholder="请输入质量机构负责人"
                :max-length="100"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form-item label="联系电话" field="qualityOrgPhone">
              <a-input
                v-model="form.qualityOrgPhone"
                placeholder="请输入质量机构负责人联系电话"
                :max-length="20"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </zs-section>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="partnerAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="partnerAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { usePartnerAddOrEditStore } from '@/store/modules/business/partner/partner/partnerAddOrEditStore';
  import { useCategoryStore } from '@/store/modules/business/partner/category/categoryStore';
  import { useDicts } from '@/hooks/dict';

  const partnerAddOrEditStore = usePartnerAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules } = storeToRefs(
    partnerAddOrEditStore,
  );

  const { partnerCategoryList } = storeToRefs(useCategoryStore());

  const { unitType } = useDicts('unitType');

  const emits = defineEmits(['refresh']);

  onMounted(() => {
    useCategoryStore().getPartnerCategoryList();
  });

  defineExpose({
    init: partnerAddOrEditStore.init,
    form,
  });
</script>
