<script setup>

import { ref } from "vue";

const props = defineProps({
 landingPageData: {
    type: Object,
    default: {}, 
  },
});


</script>

<template>
  <div>
    <section class="container pd-bc" v-if="landingPageData">
      <div class="sec-4 text-center">
          <h2 class="title-d">{{ landingPageData.title }}</h2>
      </div>

      <div class="row card-bx">
          <div class="col-lg-3  col-md-6 col-sm-6 col-12 mb-4" v-for="(item, index) in 4" :key="index">
              <div class="crd text-center">
                  <img :src="landingPageData.images[index]?.image" alt="Handmade Shoe" class="img-fluid card-image mb-3">
                  <p class="dis-d">{{ landingPageData.titles[index]?.title }}</p>
              </div>
          </div>
      </div>

      <div class="pd-c text-center re-bt">
          <a href="#" class="btn btn-primary order-btn-d">অর্ডার করুন</a>
      </div>
  </section>
  </div>
</template>


<style scoped>
@import "@/assets/css/landing-page.css";

</style>