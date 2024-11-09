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
    <section>
      <div class="clb">
          <div class="container pd-bt">
              <div class="sec-or text-center">
                  <h2 class="title-e">{{ landingPageData.title }} <span class="sp">{{ landingPageData.sub_title }}</span></h2>
              </div>
              <div class="row align-items-center se-img">
                  <div class="col-md-6 col-12 tx-p mb-3 mb-md-0">
                      <p>
                          <span v-for="(title, index) in landingPageData.titles" :key="index">✅ {{ title.title }}<br></span>
                      </p>
                  </div>
                  <div class="col-md-6 col-12">
                      <img :src="landingPageData.image" alt="Product Image" class="img-fluid img-lf">
                  </div>
              </div>
              <div class="pd-cd text-center mt-4">
                  <a href="#" class="btn btn-primary order-btn-d">অর্ডার করুন</a>
              </div>
          </div>
      </div>
  </section>
  </div>
</template>


<style scoped>
@import "@/assets/css/landing-page.css";

</style>