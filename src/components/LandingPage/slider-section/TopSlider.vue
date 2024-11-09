<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { ref } from "vue";

const props = defineProps({
  landingPageData: {
    type: Object,
    default: {},
  }
});

</script>

<template>
  <div>
    <section v-if="landingPageData">
      <div class="clb-g">
        <div class="container">
            <h2 class="slider-head">{{ landingPageData.title }}</h2>
            <Swiper
              :slidesPerView="3"
              :spaceBetween="30"
              :autoplay="{ delay: 3000, disableOnInteraction: false }"
              :loop="true"
              :pagination="{ clickable: true }"
              :navigation="true"
              :modules="[Pagination, Navigation, Autoplay]"
              :centeredSlides="true" 
              class="mySwiper"
              >
            <SwiperSlide v-for="(image, index) in landingPageData.images" :key="index">
              <img :src="image.image" alt="" class="w-50 h-50">
            </SwiperSlide>
          </Swiper>
            <div class="pd-cd text-center">
                <a href="#" class="order-btn-d">অর্ডার করুন</a>
            </div>
        </div>
    </div>
  </section>
  </div>
</template>


<style scoped>

@import "@/assets/css/landing-page.css";
.mySwiper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mySwiper .swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>