<template>
  <a-carousel
    indicator-type="slider"
    show-arrow="hover"
    auto-play
    style="width: 100%; height: 170px; border-radius: 4px; overflow: hidden"
  >
    <a-carousel-item v-for="(src, idx) in imageSrc" :key="idx">
      <div>
        <img :src="src" style="width: 100%" />
      </div>
    </a-carousel-item>
  </a-carousel>
</template>

<script lang="ts" setup>
  import image1 from '@/assets/images/home/1.jpg';
  import image2 from '@/assets/images/home/2.png';
  import image3 from '@/assets/images/home/3.jpg';

  const imageSrc = [image1, image2, image3];
</script>
