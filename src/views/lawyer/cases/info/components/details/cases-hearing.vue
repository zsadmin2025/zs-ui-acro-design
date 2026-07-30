<template>
  <div class="item-container">
    <div v-for="(item, idx) in caseHearingList" :key="idx" class="item">
      <a-card
        :title="valueToLabel(item.hearingProcedure)"
        :header-style="{
          paddingBottom: '12px',
          backgroundColor: '#f2f3f5',
        }"
      >
        <template #extra>
          <a-space v-if="type === 'edit'" size="small">
            <a-button type="primary" @click="hearingStore.handleEdit(item)">
              <template #icon>
                <icon-edit />
              </template>
              <template #default>编辑</template>
            </a-button>
            <a-button
              type="primary"
              status="danger"
              @click="hearingStore.handleDelete(item, emits)"
            >
              <template #icon>
                <icon-edit />
              </template>
              <template #default>删除</template>
            </a-button>
          </a-space>
        </template>
        <a-descriptions
          size="large"
          :column="2"
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
          <a-descriptions-item label="法院受理日期" :span="1">
            {{ item.courtAcceptDate }}
          </a-descriptions-item>
          <a-descriptions-item label="开庭时间" :span="1">
            {{ item.courtTime }}
          </a-descriptions-item>
          <a-descriptions-item label="开庭律师" :span="1">
            {{ item.courtLawyer }}
          </a-descriptions-item>
          <a-descriptions-item label="法院/仲裁委员会" :span="1">
            {{ item.court }}
          </a-descriptions-item>
          <a-descriptions-item label="法官" :span="1">
            {{ item.judge }}
          </a-descriptions-item>
          <a-descriptions-item label="电话" :span="1">
            {{ item.judgePhone }}
          </a-descriptions-item>
          <a-descriptions-item label="书记员" :span="1">
            {{ item.courtClerk }}
          </a-descriptions-item>
          <a-descriptions-item label="电话" :span="1">
            {{ item.courtClerkPhone }}
          </a-descriptions-item>
          <a-descriptions-item label="判决结果" :span="1">
            {{ item.judgmentResult }}
          </a-descriptions-item>
          <a-descriptions-item label="公告送达时间" :span="1">
            {{ item.serviceByPublicationDate }}
          </a-descriptions-item>
          <a-descriptions-item label="判决生效时间" :span="1">
            {{ item.judgmentTakesEffect }}
          </a-descriptions-item>
          <a-descriptions-item label="判决签收时间" :span="1">
            {{ item.judgmentSignDate }}
          </a-descriptions-item>
          <a-descriptions-item label="判决内容" :span="4">
            {{ item.judgmentContent }}
          </a-descriptions-item>
          <a-descriptions-item label="附件" :span="4">
            <div class="file-list">
              <div
                v-for="(file, index) in item.caseHearingFilesList"
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
                  </div>
                  <span class="list-item-operation">
                    <span class="list-item-operation-time">
                      {{ '上传时间' + file.createTime }}</span
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

    <a-button
      v-if="type === 'edit'"
      type="outline"
      long
      @click="hearingStore.handleAdd(props.caseInfoId)"
    >
      <template #icon>
        <icon-plus />
      </template>
      <template #default>添加</template>
    </a-button>
    <HearingAddOrEdit ref="addEditRef" @refresh="handleRefresh" />
  </div>
</template>

<script lang="ts" setup>
  import { useDicts } from '@/hooks/dict';
  import download from '@/utils/fileDownload';
  import { useHearingStore } from '@/store/modules/lawyer/cases/hearing/hearingStore';
  import { storeToRefs } from 'pinia';
  import HearingAddOrEdit from '../hearing/hearing-add-or-edit.vue';

  const hearingStore = useHearingStore();

  const { addEditRef } = storeToRefs(hearingStore);

  const props = defineProps<{
    caseInfoId: string;
    caseHearingList: any;
    type: string; // 用于区分详情和宾基
  }>();

  const { getLabel } = useDicts('hearingProcedure');
  const caseHearingList = computed(() => props.caseHearingList);

  const valueToLabel = (value: string) => getLabel('hearingProcedure', value);

  const downloadFile = async (url: string, fileName: string) => {
    download.url(url, fileName);
  };
  // 定义 emit 事件
  const emits = defineEmits(['update:caseHearingList']);

  const handleRefresh = () => {
    emits('update:caseHearingList');
  };
  onMounted(() => {});
</script>

<style scoped lang="less">
  .item-container {
    padding: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }

    .item {
      margin-bottom: 20px;
    }
  }
</style>

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
