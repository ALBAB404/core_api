<script setup>
import {
  CategorySideBar,
  CartSideBar,
  NavSideBar,
  MobileMenu,
  Blog,
  ProductView,
  AnonLeatherCategorySection,
  PremiumCollection,
  HomePageBanner,
  Banner,
  Brand,
} from "@/components";
// product data fetch
import { useProduct, useSection } from "@/stores";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { ProductSkeleton } from "@/components/skeleton";
import axiosInstance from "@/services/axiosService.js";

const product = useProduct();
const section = useSection();
const sections = ref("");
const bannerAllItems = ref({});

const getSections = async () => {
  sections.value = await section.getData();
};

onMounted(() => {
  getSections();
});
</script>

<template>
  <div>

    <CategorySideBar />

    <CartSideBar />

    <NavSideBar />

    <!-- <ProductView /> -->

    <MobileMenu />

    <Banner />

    <AnonLeatherCategorySection />

    <AnonleatherSectionProduct /> 


    <PremiumCollection />

    <HomePageBanner />

    <Brand />

    <Blog />

  </div>
</template>

<style scoped>
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
