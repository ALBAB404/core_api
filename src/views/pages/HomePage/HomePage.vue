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
  AnonleatherSectionProduct,
  AnonleatherCampaignSection,
  AnonleatherLocationStoreSection,
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
    
    <AnonleatherCampaignSection /> 

    <AnonLeatherCategorySection />

    <AnonleatherSectionProduct /> 
    
    <PremiumCollection />
    
    <HomePageBanner />
    
    <Blog />
    
    <AnonleatherLocationStoreSection /> 
  </div>
</template>

<style scoped>

</style>
