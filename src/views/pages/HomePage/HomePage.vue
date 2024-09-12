<script setup>
import { CategorySideBar, CartSideBar,ProductCard, NavSideBar, MobileMenu,  Blog, ProductView, PromoPart, Banner, IntroPart, NewItem, Brand } from '@/components'
// product data fetch 
import {useProduct, useSection} from '@/stores'
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import { ProductSkeleton} from '@/components/skeleton'
import axiosInstance from "@/services/axiosService.js";
// All Variable  Code Is Here.....................................................................................................
const product = useProduct();
const section = useSection();
const {sections} = storeToRefs(section);
const bannerAllItems = ref({});
// API Calling Code Is Here.....................................................................................................

const banner = async() => {
  const res = await axiosInstance.get("/banners");
  bannerAllItems.value = res.data.result;
}

// All Function  Code Is Here.....................................................................................................

onMounted(() => {
  banner();
  section.getData();
})


</script>

<template>

  <div>
      <!--=====================================
                CATEGORY SIDEBAR PART START
        =======================================-->
      <CategorySideBar />
    <!--=====================================
                CATEGORY SIDEBAR PART END
        =======================================-->

    <!--=====================================
                  CART SIDEBAR PART START
        =======================================-->
    <CartSideBar />
    <!--=====================================
                    CART SIDEBAR PART END
        =======================================-->

    <!--=====================================
                  NAV SIDEBAR PART START
        =======================================-->
    <NavSideBar />
    <!--=====================================
                  NAV SIDEBAR PART END
        =======================================-->

    <!--=====================================
                    MOBILE-MENU PART START
        =======================================-->
    <MobileMenu />
    <!--=====================================
                    MOBILE-MENU PART END
        =======================================-->

    <!--=====================================
                    PRODUCT VIEW START
        =======================================-->
    <!-- <ProductView /> -->
    <!--=====================================
                    PRODUCT VIEW END
        =======================================-->

    <!--=====================================
                    BANNER PART START
        =======================================-->
    <Banner />
    <!--=====================================
                    BANNER PART END
        =======================================-->

        <!--=====================================
          Section PART Start
        =======================================-->

        <section class="section deals-part" v-for="(section, index) in sections.data" :key="index">
          <div class="container">
            <div class="row">
              <div class="col-lg-12">
                <div class="section-heading">
                  <h2>
                    <span class="section-header-text">{{ section.title }}</span>
                  </h2>
                  <div class="heading-line"></div>
                </div>
              </div>
            </div>
            <template v-if="!section">
              <ProductSkeleton :dataAmount='8' :cols="4"/>
            </template>
            <template v-else> 
            <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4">
              <div class="col" v-for="(product, index) in section.products.data" :key="index">
                
                <ProductCard :product="product" :types="'sale'"/>
              </div>
            </div>
            </template>
            <div class="row">
              <div class="col-lg-12">
                <div class="section-btn-25">
                  <router-link :to="{ name: 'shopPage', query: {recent: 'recent-product'}}" class="btn btn-inline">
                    <i class="fas fa-eye"></i>
                    <span>আরো দেখুন </span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!--=====================================
          Section PART End
        =======================================-->
   
    

    <!--=====================================
                      BLOG PART START
        =======================================-->
    <Blog /> 
    <!--=====================================
                      BLOG PART END
        =======================================-->
  </div>
</template>

<style scoped>

.section-header-text{
    background-color: #f5f6f7;
    padding: 10px 20px;
    border: 3px solid var(--primary) !important;
    border-top-width: 7px !important;
    border-radius: 15px / 45px !important;
    box-shadow: #ccdbe8 3px 3px 15px inset, #ffffff80 -3px -3px 12px 1px inset;
    transition: all linear .2s;
}

.heading-line {
  width: 100%;
  background-color: var(--primary);
  height: 2px;
  margin-top: -25px;
}

</style>
