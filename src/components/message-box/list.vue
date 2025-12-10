<template>
  <a-list :bordered="false">
    <a-list-item
      v-for="item in filteredRenderList"
      :key="item.sysMessageId"
      action-layout="vertical"
      :style="{
        opacity: item.isRead ? 0.5 : 1,
      }"
    >
      <!-- <template #extra>
        <a-tag v-if="item.type === 0" color="gray">未开始</a-tag>
        <a-tag v-else-if="item.type === 1" color="green">已开通</a-tag>
        <a-tag v-else-if="item.type === 2" color="blue">进行中</a-tag>
        <a-tag v-else-if="item.type === 3" color="red">即将到期</a-tag>
      </template> -->
      <div class="item-wrap" @click="onItemClick(item)">
        <a-list-item-meta v-if="item.type === 1">
          <template v-if="item.senderUser" #avatar>
            <a-avatar shape="circle">
              <img v-if="item.senderUser" :src="item.senderUser.avatar" />
              <icon-desktop v-else />
            </a-avatar>
          </template>
          <template #title>
            <a-space :size="4">
              <span>{{ item.senderUser?.realName }}</span>
              <a-typography-text type="secondary"> 的私信 </a-typography-text>
            </a-space>
          </template>
          <template #description>
            <div>
              <a-typography-paragraph
                :ellipsis="{
                  rows: 1,
                }"
                >{{ item.title }}
              </a-typography-paragraph>
              <a-typography-text class="time-text">
                {{ item.createTime }}
              </a-typography-text>
            </div>
          </template>
        </a-list-item-meta>
        <a-list-item-meta v-if="item.type === 2">
          <template #title>
            <a-space :size="4">
              <span>{{ item.title }}</span>
            </a-space>
          </template>
          <template #description>
            <div>
              <a-typography-paragraph
                :ellipsis="{
                  rows: 1,
                }"
              >
                <div v-dompurify-html="item.content"></div>
              </a-typography-paragraph>
            </div>
          </template>
        </a-list-item-meta>
        <a-list-item-meta v-if="item.type === 3">
          <template #title>
            <a-space :size="4">
              <span>{{ item.title }}</span>
            </a-space>
          </template>
          <template #description>
            <div>
              <a-typography-paragraph
                :ellipsis="{
                  rows: 1,
                }"
              >
                <div v-dompurify-html="item.content"></div>
              </a-typography-paragraph>
            </div>
          </template>
        </a-list-item-meta>
      </div>
    </a-list-item>
    <template #footer>
      <a-space
        fill
        :size="0"
        :class="{ 'add-border-top': renderList.length < showMax }"
      >
        <div class="footer-wrap">
          <a-link @click="allRead">{{ $t('messageBox.allRead') }}</a-link>
        </div>
        <div class="footer-wrap">
          <a-link>{{ $t('messageBox.viewMore') }}</a-link>
        </div>
      </a-space>
    </template>
    <div
      v-if="renderList.length && renderList.length < 3"
      :style="{ height: (showMax - renderList.length) * 86 + 'px' }"
    ></div>
  </a-list>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Messages } from '@/types/sys/messages/messagesTypes';

  const props = defineProps({
    renderList: {
      type: Array as PropType<Messages[]>,
      required: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  });

  // 添加计算属性来限制每种类型的数据数量
  const filteredRenderList = computed(() => {
    const typeMap: Record<number, Messages[]> = {};

    // 按类型分组
    props.renderList.forEach((item) => {
      if (!typeMap[item.type]) {
        typeMap[item.type] = [];
      }
      typeMap[item.type].push(item);
    });

    // 每种类型只保留前5条数据
    const result: Messages[] = [];
    Object.values(typeMap).forEach((items) => {
      result.push(...items.slice(0, 5));
    });

    return result;
  });

  const emit = defineEmits(['itemClick']);
  const allRead = () => {
    emit('itemClick', [...props.renderList]);
  };

  const onItemClick = (item: Messages) => {
    if (!item.isRead) {
      emit('itemClick', [item]);
    }
  };
  const showMax = 3;
</script>

<style scoped lang="less">
  :deep(.arco-list) {
    .arco-list-item {
      min-height: 86px;
      border-bottom: 1px solid rgb(var(--gray-3));
    }
    .arco-list-item-extra {
      position: absolute;
      right: 20px;
    }
    .arco-list-item-meta-content {
      flex: 1;
    }
    .item-wrap {
      cursor: pointer;
    }
    .time-text {
      font-size: 12px;
      color: rgb(var(--gray-6));
    }
    .arco-empty {
      display: none;
    }
    .arco-list-footer {
      padding: 0;
      height: 50px;
      line-height: 50px;
      border-top: none;
      .arco-space-item {
        width: 100%;
        border-right: 1px solid rgb(var(--gray-3));
        &:last-child {
          border-right: none;
        }
      }
      .add-border-top {
        border-top: 1px solid rgb(var(--gray-3));
      }
    }
    .footer-wrap {
      width: 100%;
      text-align: center;
    }
    .arco-typography {
      margin-bottom: 0;
    }
    .add-border {
      border-top: 1px solid rgb(var(--gray-3));
    }
  }
</style>
