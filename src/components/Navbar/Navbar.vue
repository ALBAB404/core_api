<script setup>
// All Import File  Code Is Here......................................................................................................
import { useAuth, useNotification, useFlashDeal, useCategory } from '@/stores';
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import axiosInstance from "@/services/axiosService.js";
// All Variable  Code Is Here.....................................................................................................
const flashDeals          = useFlashDeal()
const auth                = useAuth()
const router              = useRouter();
const {user, loading}     = storeToRefs(auth)
const {campaignProduct}   = storeToRefs(flashDeals)
const notify              = useNotification();
const category            = useCategory();
const {categories}        = storeToRefs(category)
const campaignDataShowing = ref('');
// API Calling Code Is Here.....................................................................................................

// All Function  Code Is Here.....................................................................................................

const logout = async () => {
    const res = await auth.logout();
    if (res.success) {
        router.push({ name: "homePage"});
        notify.Success("Logout Successfully Done");
    }
}

const campaignData = async () => {
    const res = await flashDeals.index();
    campaignDataShowing.value = res
    
}

// sticky Header 

const stickyHeader = () => {
    const mainHeaderNavSection = document.querySelector('.navbar-part');

    window.addEventListener('scroll', () => {        
        const scrollTopWindow = window.pageYOffset;
        const scrollScreenSize = window.screen.width;

        if (scrollTopWindow > 80 && scrollScreenSize > 768) {            
            mainHeaderNavSection.classList.add('header-sticky');
        }else{
            mainHeaderNavSection.classList.remove('header-sticky');
        }
    });
}

// sticky Header 

onMounted(() => {
    campaignData();
    stickyHeader();
})


</script>

<template lang="">
  <div>
    <!--=====================================
                    NAVBAR PART START
        =======================================-->
        <nav class="navbar-part">
            <div class="container">
                <div class="row">
                    <div class="col-xl-2 col-lg-3 mt-2">
                        <div class="banner-category">
                            <div class="banner-category-head">
                              <i class="fas fa-bars"></i>
                              <span>categories</span>
                            </div>
                            <ul class="banner-category-list">
                                <li class="banner-category-item" v-for="(category, index) in categories.data" :key="index">
                                    <router-link :to="{ name: 'shopPage', query: { category: category.id }}">
                                        <i class="flaticon-vegetable"></i>
                                        <span>{{ category.name }}</span>
                                        <i class="fa-solid fa-arrow-right ms-auto fs-6" @click.prevent="toggleDropdown(index, category)" v-if="category.sub_category.length > 0"></i>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-8 col-lg-7">
                        <div class="navbar-content">
                            <ul class="navbar-list">
                                <li class="navbar-item dropdown">
                                    <router-link :to="{ name: 'homePage' }" class="navbar-link" :class="{ 'active-text-color': $route.name === 'homePage' }">Home</router-link>
                                </li>
                                <li class="navbar-item dropdown-megamenu">
                                    <router-link :to="{ name: 'shopPage' }" class="navbar-link" :class="{ 'active-text-color': $route.name === 'shopPage' }">Shop</router-link>
                                </li>
                                <li class="navbar-item">
                                    <router-link :to="{ name: 'aboutPage' }" class="navbar-link" :class="{ 'active-text-color': $route.name === 'aboutPage' }">About Us</router-link>
                                </li>
                                <li class="navbar-item">
                                     <router-link :to="{ name: 'contactPage' }" class="navbar-link" :class="{ 'active-text-color': $route.name === 'contactPage' }">Contact Us</router-link>
                                </li>
                                <li class="navbar-item" v-if="campaignDataShowing == 'flashdeal'">
                                     <router-link :to="{ name: 'flashDealPage' }" class="navbar-link" :class="{ 'active-text-color': $route.name === 'flashDealPage' }">Flash Deal</router-link>
                                </li>
                                <li class="navbar-item" v-if="campaignDataShowing == 'campaign'">
                                     <router-link :to="{ name: 'campaignPage' }" class="navbar-link" :class="{ 'active-text-color': $route.name === 'campaignPage' }">Campaign Page</router-link>
                                </li>
                                <li class="navbar-item">
                                     <router-link :to="{ name: 'blogPage' }" class="navbar-link" :class="{ 'active-text-color': $route.name === 'blogPage' }">Blog</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-2 text-center">
                        <router-link :to="{ name: 'CampaignBanner' }" class="main-order-btn mt-2">Campaign</router-link>
                    </div>
                </div>
            </div>
        </nav>
        <!--=====================================
                    NAVBAR PART END
        =======================================-->
  </div>
</template>

<style>

.header-sticky{
    z-index: 99999;
    width: 100%;
    position: fixed;
    background-color: rgb(255, 255, 255);
    top: 0;
    padding: 5px 0 10px 0;
    border-radius: 0 0 30px 30px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .main-order-btn{
    animation: pulse 1s infinite; 
    font-size: 20px;
    background-color: var(--primary);
    color: var(--white);
    padding: 5px 15px;
    border-top: 2px solid var(--primary);
    border-left: 2px solid var(--primary);
    border-bottom: 2px solid var(--primary);
    border-right: 2px solid var(--primary);
    border-top-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
    transition: .3s ease-in-out background-color;
  }

  .main-order-btn:hover{
    background-color: var(--secondary-color);
    color: white;
    transition: .3s ease-in-out background-color;
    border-color: var(--secondary-color);
  }

.banner-category-list{
    width: 12%;
}

.active-text-color{
    color: var(--primary) !important;
}

@media (max-width: 1440px) {
    .banner-category-list{
        width: 14%;
    }
  }
  
  @media (max-width: 1199px) {
    .banner-category-list{
        width: 19%;
    }
  }
  
  
  @media (max-width: 1024px) {
    .banner-category-list{
        width: 21% !important
    }
  }
  
  @media (max-width: 991px){
    
  }

</style>
