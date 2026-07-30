<template>
  <div class="item-container">
    <a-card
      title="合同信息"
      :header-style="{
        background: '#fafafa',
        fontSize: '16px',
        fontWeight: 'bold',
      }"
    >
      <template #extra>
        <a-button
          v-if="type === 'edit'"
          type="primary"
          @click="handleEdit(props.caseInfoId)"
        >
          <template #icon>
            <icon-edit />
          </template>
          <template #default>编辑</template>
        </a-button>
      </template>
      <a-descriptions
        size="large"
        :column="3"
        layout="horizontal"
        table-layout="fixed"
        :label-style="{
          width: '100px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <a-descriptions-item label="起始日期" :span="1">
          {{ props.caseContract?.startDate }}
        </a-descriptions-item>
        <a-descriptions-item label="付款方式" :span="1">
          {{ paymentMethodLabel }}
        </a-descriptions-item>
        <a-descriptions-item label="合同金额" :span="1">
          {{ props.caseContract?.contractAmount }}
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions
        size="large"
        :column="3"
        layout="vertical"
        table-layout="fixed"
        :label-style="{
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          textAlign: 'left',
        }"
      >
        <a-descriptions-item label="付款明细" :span="1">
          <a-table
            :data="props.caseContract?.contractNodeList ?? []"
            :bordered="false"
            :columns="columns"
            :pagination="false"
          />
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions
        size="large"
        :column="3"
        :label-style="{
          width: '80px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <a-descriptions-item label="合同文件" :span="1">
          <div class="file-list">
            <div
              v-for="(file, index) in props.caseContract?.contractFileList ??
              []"
              :key="index"
              class="list-item"
            >
              <div class="list-item-content">
                <div class="list-item-name">
                  <span class="list-item-file-icon">
                    <zs-icon icon="icon-custom-pdf" />
                  </span>
                  <a-link
                    class="list-item-name-link"
                    :hoverable="false"
                    @click="downloadFile(file.fileUrl, file.fileName)"
                    >{{ file.fileName }}</a-link
                  >
                  <!-- <a class="list-item-name-link" :href="item.fileUrl">{{
                    item.fileName
                  }}</a> -->
                </div>
                <span class="list-item-operation">
                  <span class="list-item-operation-time">
                    {{ '上传时间：' + file.createTime }}</span
                  >
                </span>
                <a-link
                  class="list-item-operation-icon"
                  @click="downloadFile(file.fileUrl, file.fileName)"
                  >下载</a-link
                >
              </div>
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { useDicts } from '@/hooks/dict';
  import download from '@/utils/fileDownload';
  import { useRouter } from 'vue-router';

  const props = defineProps<{
    caseInfoId: string;
    caseContract: any;
    type?: string; // 用于区分详情和编辑
  }>();

  const router = useRouter();

  const { getLabel } = useDicts('paymentCategory', 'paymentMethod');
  // 计算属性- 获取付款方式标签
  const paymentMethodLabel = computed(() =>
    getLabel('paymentMethod', props.caseContract?.paymentMethod),
  );

  const columns = [
    {
      title: '款项类别',
      dataIndex: 'paymentCategory',
      key: 'paymentCategory',
      render: ({ record }: any) =>
        getLabel('paymentCategory', record.paymentCategory),
    },
    {
      title: '款项名称',
      dataIndex: 'paymentName',
      key: 'paymentName',
    },
    {
      title: '应收金额',
      dataIndex: 'receivableAmount',
      key: 'receivableAmount',
    },
    {
      title: '预计收款日期',
      dataIndex: 'expectedCollectionDate',
      key: 'expectedCollectionDate',
    },
    {
      title: '收款条件',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
    },
  ];

  const downloadFile = async (url: string, fileName: string) => {
    download.url(url, fileName);
  };

  const handleEdit = (caseInfoId: any) => {
    router.push({
      name: 'infoRegister',
      query: { id: caseInfoId ?? '', type: 'edit' },
    });
  };
  onMounted(() => {});
</script>

<style scoped lang="less">
  .item-container {
    padding: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
  }
  .file-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .list-item {
      margin-top: 14px;
      position: relative;
      display: flex;
      align-items: center;
      box-sizing: border-box;

      .list-item-content {
        display: flex;
        flex: 1;
        flex-wrap: nowrap;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: 4px 5px 4px 6px;
        overflow: hidden;
        font-size: 14px;
        background-color: var(--color-fill-1);
        border-radius: var(--border-radius-small);
        transition: background-color 0.1s cubic-bezier(0, 0, 1, 1);

        .list-item-name {
          display: flex;
          flex: 1;
          align-items: center;
          margin-right: 10px;
          overflow: hidden;
          color: var(--color-text-1);
          font-size: 14px;
          line-height: 1.4286;
          white-space: nowrap;
          text-overflow: ellipsis;

          .list-item-file-icon {
            color: rgb(var(--color-primary-6));
            margin-right: 12px;
            font-size: 16px;
            line-height: 16px;
          }
        }
        .list-item-operation {
          position: relative;
          margin-left: auto;
          line-height: 12px;

          .list-item-operation-time {
            margin-right: 20px;
            font-size: 13px;
          }
          .list-item-operation-icon {
            margin-left: 24px;
          }
        }
      }
    }
  }
</style>
