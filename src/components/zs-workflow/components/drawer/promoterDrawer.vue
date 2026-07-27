<template>
  <a-drawer
    v-model:visible="visible"
    title="发起人"
    class="promoter"
    :width="550"
  >
    <div>
      <div class="promoter_content">
        <p>{{ initiatorText || '全部成员可以发起流程' }}</p>
      </div>
    </div>
    <template #footer>
      <a-button @click="closeDrawer">取 消</a-button>
      <a-button type="primary" @click="savePromoter">确 定</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
  import { computed } from 'vue';
  import { useStore } from '../../stores/index';

  defineProps({
    initiatorText: {
      type: String,
      default: '',
    },
  });

  const store = useStore();
  const promoterDrawer = computed(() => store.promoterDrawer);
  const closeDrawer = () => {
    store.setPromoter(false);
  };
  const visible = computed({
    get() {
      return promoterDrawer.value;
    },
    set() {
      closeDrawer();
    },
  });
  const savePromoter = () => {
    closeDrawer();
  };
</script>

<style lang="less">
  .promoter {
    .promoter_content {
      padding: 0 var(--base-padding);
      p {
        padding: 18px 0;
        font-size: 14px;
        line-height: 20px;
        color: #000000;
      }
    }
  }
</style>
