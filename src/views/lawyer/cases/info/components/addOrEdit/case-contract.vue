<template>
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
            placeholder="请输入标的金额"
            :precision="2"
            :min="0"
          >
            <template #append> 元 </template>
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
        <a-form-item label="合同付款节点" field="caseContract.contractNodeList">
          <a-table
            :columns="columns"
            :data="form.caseContract.contractNodeList"
            :pagination="false"
            :scroll="{ x: '100%', y: '100%' }"
          >
            <template #paymentCategory="{ record, rowIndex }">
              <a-form-item
                :field="`caseContract.contractNodeList.${rowIndex}.paymentCategory`"
                :rules="[
                  {
                    required: true,
                    message: '请选择款项类别',
                  },
                ]"
                :hide-label="true"
                :hide-asterisk="true"
              >
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
              </a-form-item>
            </template>

            <template #paymentName="{ record }">
              <a-form-item
                :field="`caseContract.contractNodeList.${recordIndex(
                  record,
                )}.paymentName`"
                :rules="[
                  {
                    required: true,
                    message: '请输入款项名称',
                  },
                ]"
                :hide-label="true"
                :hide-asterisk="true"
              >
                <a-input
                  v-model="record.paymentName"
                  placeholder="请输入款项名称"
                />
              </a-form-item>
            </template>

            <template #receivableAmount="{ record }">
              <a-form-item
                :field="`caseContract.contractNodeList.${recordIndex(
                  record,
                )}.receivableAmount`"
                :rules="[
                  {
                    required: true,
                    message: '请输入应收金额',
                  },
                ]"
                :hide-label="true"
                :hide-asterisk="true"
              >
                <a-input-number
                  v-model="record.receivableAmount"
                  placeholder="请输入应收金额"
                  :precision="2"
                  :min="0"
                >
                  <template #append> 元 </template>
                </a-input-number>
              </a-form-item>
            </template>

            <template #expectedCollectionDate="{ record }">
              <a-form-item
                :field="`caseContract.contractNodeList.${recordIndex(
                  record,
                )}.expectedCollectionDate`"
                :rules="[
                  {
                    required: true,
                    message: '请选择预计收款时间',
                  },
                ]"
                :hide-label="true"
                :hide-asterisk="true"
              >
                <a-date-picker
                  v-model="record.expectedCollectionDate"
                  style="width: 100%"
                />
              </a-form-item>
            </template>

            <template #paymentTerms="{ record }">
              <a-form-item
                :field="`caseContract.contractNodeList.${recordIndex(
                  record,
                )}.paymentTerms`"
                :rules="[
                  {
                    required: true,
                    message: '请输入收款条件',
                  },
                ]"
                :hide-label="true"
                :hide-asterisk="true"
              >
                <a-input
                  v-model="record.paymentTerms"
                  placeholder="请输入收款条件"
                />
              </a-form-item>
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
              <a-button type="text" style="width: 100%" @click="handleAddNode">
                <template #icon>
                  <icon-plus />
                </template>
                <template #default>添加付款节点</template>
              </a-button>
            </template>
          </a-table>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item label="电子版合同" field="contractFileList">
          <zs-upload-files
            v-model="form.caseContract.contractFileList"
            multiple
            style="width: 100%"
            @add="handleAddFile"
            @remove="handleRemoveFile"
          />
        </a-form-item>
      </a-col>

      <a-col :span="12"></a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useDicts } from '@/hooks/dict';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form } = storeToRefs(infoAddOrEditStore);
  const { paymentCategory, paymentMethod } = useDicts(
    'paymentCategory',
    'paymentMethod',
  );

  // 获取行索引
  const recordIndex = (record: any) => {
    return form.value.caseContract.contractNodeList.indexOf(record);
  };

  const columns = [
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
      align: 'center' as const,
    },
  ];

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

  const handleAddFile = (fileItem: any) => {
    // 上传成功后，将文件信息赋值给 form.value.contractFileList
    form.value.caseContract.contractFileList.push({
      caseInfoFilesId: '',
      caseInfoId: '',
      caseOtherId: '',
      fileSource: '',
      fileName: fileItem.fileOriginalName,
      fileType: fileItem.fileType,
      fileSize: fileItem.fileSize,
      fileUrl: fileItem.fileUrl,
    });
  };

  const handleRemoveFile = (fileItem: any) => {
    // 删除成功后，将文件信息从 form.value.contractFileList 中删除
    form.value.caseContract.contractFileList =
      form.value.caseContract.contractFileList.filter(
        (item: any) => item.fileUrl !== fileItem.fileUrl,
      );
  };

  onMounted(() => {});
</script>
