<script setup>
import { useCategory } from "@/stores";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Pagination, Autoplay, Navigation } from "swiper/modules";

// All Variable  Code Is Here.....................................................................................................
const newSlide = ref([Navigation]);
const modules = ref([Pagination, Autoplay]);

const category = useCategory();
const router = useRouter();
const categories = ref("");

const getCategories = async () => {
  categories.value = await category.getCategories();
};

onMounted(() => {
  getCategories();
});
</script>

<template>
  <div>
    <div class="container mt-5 mb-3">
      <div class="section-heading">
        <h2>
          <span class="section-header-text">Category Section</span>
        </h2>
        <div class="heading-line"></div>
      </div>
      <div class="row">
        <swiper
                :slidesPerView="4"
                :sliderPerGroup="1"
                :loop="true"
                :autoplay="{
                  delay: 2000,
                }"
                :breakpoints="{
                  320: { slidesPerView: 1, spaceBetween: 40 },
                  480: { slidesPerView: 3, spaceBetween: 30 },
                  790: { slidesPerView: 4, spaceBetween: 20 }
                }"
                :navigation="true"
                :modules="newSlide"
                class="mySwiper"
              >
              <swiper-slide v-for="(category, index) in categories?.data" :key="index" >
                <router-link :to="{ name: 'shopPage', query: { category: category.id } }" class="hover14 hover01">
                  <figure>
                    <img :src="category.image" alt="" width="100%" />
                  </figure>
                </router-link>        
              </swiper-slide>
        </swiper>  
      </div>
    </div>
  </div>
</template>

<style scoped>

/* Shine start*/
.hover14 figure {
	position: relative;
	overflow: hidden; /* Add this to keep shine within bounds */
}

.hover14 figure::before {
	position: absolute;
	top: 0;
	left: -75%;
	z-index: 2;
	display: block;
	content: '';
	width: 50%;
	height: 100%;
	background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
	transform: skewX(-25deg);
	transition: left 0.75s ease;
}

.hover14 figure:hover::before {
	left: 125%; /* Move shine effect smoothly */
}

/* Zoom In */
.hover01 figure img {
	transform: scale(1);
	transition: transform .3s ease-in-out;
}

.hover01 figure:hover img {
	transform: scale(1.1); /* Zoom effect */
}


.section-header-text {
  background-color: #f5f6f7;
  padding: 10px 20px;
  border: 3px solid var(--primary) !important;
  border-top-width: 7px !important;
  border-radius: 15px / 45px !important;
  box-shadow: #ccdbe8 3px 3px 15px inset, #ffffff80 -3px -3px 12px 1px inset;
  transition: all linear 0.2s;
}

.section-header-text:hover {
  background-color: #f5f6f7;
  border: 3px solid var(--secondary-color) !important;
  border-top-width: 7px !important;
  border-radius: 15px / 45px !important;
  transition: all linear 0.2s;
}

.heading-line {
  width: 100%;
  background-color: var(--primary);
  height: 2px;
  margin-top: -25px;
}
.heading-line:hover {
  background-color: var(--secondary-color);
}
</style>
