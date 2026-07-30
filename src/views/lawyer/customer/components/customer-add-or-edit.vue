<template>
  <a-drawer
    v-model:visible="dialogFormVisible"
    width="60%"
    title-align="start"
    :draggable="true"
    @cancel="customerAddOrEditStore.close"
  >
    <template #title>
      <h4>
        {{ !form.customerId ? '新增客户' : '修改客户' }}
      </h4>
    </template>

    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      auto-label-width
      label-align="right"
    >
      <zs-scetion title="客户信息">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="客户类别" field="customerCategory">
              <a-select
                v-model="form.customerCategory"
                placeholder="请选择客户类别"
              >
                <a-option
                  v-for="item in customerCategory"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  >{{ item.dictLabel }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户性质" field="customerNature">
              <a-select
                v-model="form.customerNature"
                placeholder="请选择客户性质"
              >
                <a-option
                  v-for="item in customerNature"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  >{{ item.dictLabel }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户名称" field="customerName">
              <a-input
                v-model="form.customerName"
                placeholder="请输入客户名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户简称" field="customerAbbreviation">
              <a-input
                v-model="form.customerAbbreviation"
                placeholder="请输入客户简称"
              /> </a-form-item
          ></a-col>
          <a-col :span="12">
            <a-form-item label="维系人" field="maintainingPeople">
              <a-select
                v-model="form.maintainingPeople"
                placeholder="请选择维系人"
                multiple
                :max-tag-count="3"
                @change="customerAddOrEditStore.handleMaintainingPeopleChange"
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
            <a-form-item label="共享人" field="sharer">
              <a-select
                v-model="form.sharer"
                placeholder="请选择共享人"
                multiple
                :max-tag-count="3"
                @change="customerAddOrEditStore.handleSharerChange"
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
            <a-form-item label="法人代表" field="legalPerson">
              <a-input
                v-model="form.legalPerson"
                placeholder="请输入法人代表"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="统一社会信用代码" field="credit">
              <a-input
                v-model="form.credit"
                placeholder="请输入统一社会信用代码"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户来源" field="customerSource">
              <a-select
                v-model="form.customerSource"
                placeholder="请选择客户来源"
              >
                <a-option
                  v-for="item in customerSource"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  >{{ item.dictLabel }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户等级" field="customerGrade">
              <a-select
                v-model="form.customerGrade"
                placeholder="请选择客户等级"
              >
                <a-option
                  v-for="item in customerGrade"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  >{{ item.dictLabel }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" field="contactNumber">
              <a-input
                v-model="form.contactNumber"
                placeholder="请输入联系电话"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="微信号" field="wechatNumber">
              <a-input v-model="form.wechatNumber" placeholder="请输入微信号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱" field="email">
              <a-input v-model="form.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否顾问" field="isConsultant">
              <a-select
                v-model="form.isConsultant"
                placeholder="请选择是否顾问"
              >
                <a-option :value="1">是</a-option>
                <a-option :value="0">否</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开户行" field="bankDeposit">
              <a-input v-model="form.bankDeposit" placeholder="请输入开户行" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="银行账户" field="bankAccount">
              <a-input
                v-model="form.bankAccount"
                placeholder="请输入银行账户"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="客户地址" field="customerAddress">
              <a-input
                v-model="form.customerAddress"
                placeholder="请输入客户地址"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="录入人" field="inputPerson">
              <a-select
                v-model="form.inputPerson"
                placeholder="请选择录入人"
                allow-search
                @change="customerAddOrEditStore.handleInputPersonChange"
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
            <a-form-item label="录入时间" field="inputTime">
              <a-date-picker
                v-model="form.inputTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择录入时间"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </zs-scetion>
      <zs-scetion title="其他信息">
        <a-row>
          <a-col :span="12">
            <a-form-item label="行业类别" field="industryCategory">
              <a-select
                v-model="form.industryCategory"
                placeholder="请选择行业类别"
              >
                <a-option
                  v-for="item in industryCategory"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  >{{ item.dictLabel }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="成立日期" field="establishedTime">
              <a-date-picker
                v-model="form.establishedTime"
                value-format="YYYY-MM-DD"
                placeholder="请选择成立日期"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮政编码" field="postalCode">
              <a-input v-model="form.postalCode" placeholder="请输入邮政编码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="传真号码" field="faxNumber">
              <a-input v-model="form.faxNumber" placeholder="请输入传真号码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="注册资本" field="registeredCapital">
              <a-input
                v-model="form.registeredCapital"
                placeholder="请输入注册资本"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="股东与持股情况" field="shareholding">
              <a-textarea
                v-model="form.shareholding"
                placeholder="请输入股东与持股情况"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="管理层与分管情况" field="companyManagement">
              <a-textarea
                v-model="form.companyManagement"
                placeholder="请输入管理层与分管情况"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="营业范围" field="businessScope">
              <a-textarea
                v-model="form.businessScope"
                placeholder="请输入营业范围"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </zs-scetion>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="customerAddOrEditStore.close">取消</a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="customerAddOrEditStore.submit(emits)"
        >
          确定
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useDicts } from '@/hooks/dict';
  import { useCustomerAddOrEditStore } from '@/store/modules/lawyer/customer/customerAddOrEditStore';

  const customerAddOrEditStore = useCustomerAddOrEditStore();
  const { form, dialogFormVisible, loading, formRef, rules, userList } =
    storeToRefs(customerAddOrEditStore);

  const {
    customerCategory,
    customerNature,
    customerSource,
    customerGrade,
    industryCategory,
  } = useDicts(
    'customerCategory',
    'customerNature',
    'customerSource',
    'customerGrade',
    'industryCategory',
  );

  const emits = defineEmits(['refresh']);

  defineExpose({
    init: customerAddOrEditStore.init,
    form,
  });
</script>
