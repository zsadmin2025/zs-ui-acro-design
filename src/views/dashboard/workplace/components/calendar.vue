<template>
  <a-card
    class="general-card"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ paddingTop: '15px' }"
  >
    <a-calendar v-model="value" />
    select: {{ value }}
  </a-card>
</template>

<script>
  import { ref } from 'vue';

  export default {
    setup() {
      const value = ref(new Date());

      return {
        value,
      };
    },
  };
</script>
