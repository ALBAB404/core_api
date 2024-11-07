<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
 landingPageData: {
    type: Object,
    default: {}, 
  },
});


</script>

<template>
  <div>
    <section class="top-section" v-if="landingPageData">
      <div class="container">
          <div class="top-title">
              <p>{{ landingPageData.title }}</p>
          </div>
          <div class="sub-title">
              <p>{{ landingPageData.sub_title }}</p>
          </div>
          <div>
              <img :src="landingPageData.image" alt="Logo" class="logo-top">

              <div class="pd">
                  <a href="#" class="order-btn-c bt-a">অর্ডার করুন</a>
              </div>
          </div>
      </div>
  </section>
  </div>
</template>


<style scoped>

</style>