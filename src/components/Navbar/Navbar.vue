<script setup>
// All Import File  Code Is Here......................................................................................................
import { useAuth, useNotification, useCategory } from "@/stores";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import axiosInstance from "@/services/axiosService.js";
// All Variable  Code Is Here.....................................................................................................
const auth = useAuth();
const router = useRouter();
const route = useRoute();
const { user, loading } = storeToRefs(auth);
const notify = useNotification();
const category = useCategory();
const { categories } = storeToRefs(category);
const campaignDataShowing = ref("");
// API Calling Code Is Here.....................................................................................................

// All Function  Code Is Here.....................................................................................................

const logout = async () => {
  const res = await auth.logout();
  if (res.success) {
    router.push({ name: "homePage" });
    notify.Success("Logout Successfully Done");
  }
};


// sticky Header

const stickyHeader = () => {
  const mainHeaderNavSection = document.querySelector(".navbar-part");

  window.addEventListener("scroll", () => {
    const scrollTopWindow = window.pageYOffset;
    const scrollScreenSize = window.screen.width;

    if (scrollTopWindow > 80 && scrollScreenSize > 768) {
      mainHeaderNavSection.classList.add("header-sticky");
    } else {
      mainHeaderNavSection.classList.remove("header-sticky");
    }
  });
};

// sticky Header

onMounted(() => {
  stickyHeader();
});
</script>

<template>
  <div>
    <!--=====================================
                    NAVBAR PART START
        =======================================-->
    <nav class="navbar-part">
      <div class="container">
        <div class="row">
          <!-- <div class="col-xl-2 col-lg-3 mt-2">
            <div class="banner-category">
              <div class="banner-category-head">
                <i class="fas fa-bars"></i>
                <span>categories</span>
              </div>
              <ul class="banner-category-list">
                <li
                  class="banner-category-item"
                  v-for="(category, index) in categories.data"
                  :key="index"
                >
                  <router-link
                    :to="{ name: 'shopPage', query: { category: category.id } }"
                  >
                    <i class="flaticon-vegetable"></i>
                    <span>{{ category.name }}</span>
                    <i
                      class="fa-solid fa-arrow-right ms-auto fs-6"
                      @click.prevent="toggleDropdown(index, category)"
                      v-if="category.sub_category.length > 0"
                    ></i>
                  </router-link>
                </li>
              </ul>
            </div>
          </div> -->
          <div class="col-xl-10 col-lg-8">
            <span class="navbar-section">
              <span>
                <router-link :to="{ name: 'shopPage' }" :class="{ 'active-link': !route.query.category }">
                  All Product
                </router-link>
              </span>
              <span v-for="(category, index) in categories?.data" :key="index">
                <router-link :to="{ name: 'shopPage', query: { category: category.id } }" :class="{ 'active-link': route.query.category == category.id }">
                  {{ category.name }}
                </router-link>
              </span>
            </span>
          </div>
          <div class="col-xl-2 col-lg-4 text-center">
            <router-link
              :to="{ name: 'CampaignBanner' }"
              class="main-order-btn mt-2"
              >Campaign</router-link
            >
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

.active-link {
  color: var(--secondary-color) !important;
  font-weight: bold;
}

.navbar-section{
    padding: 5px 0px; 
    display:inline-block;
}
.navbar-section span a{
    padding: 10px 15px !important; 
    display:inline-block;
    font-size: 17px !important;
    color: var(--white);
}
.navbar-section span a:hover{
    color: var(--secondary-color);
    cursor: pointer;
}

.navbar-link {
    padding: 10px 0px;
}

.header-sticky {
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

.main-order-btn {
  animation: pulse 1s infinite;
  font-size: 20px;
  background-color: var(--secondary-color);
  color: var(--primary);
  padding: 5px 15px;
  border-top: 2px solid var(--primary);
  border-left: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  border-right: 2px solid var(--primary);
  border-top-left-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
  transition: 0.3s ease-in-out background-color;
}

.main-order-btn:hover {
  background-color: var(--secondary-color);
  color: white;
  transition: 0.3s ease-in-out background-color;
  border-color: var(--secondary-color);
}

.banner-category-list {
  width: 12%;
}

.active-text-color {
  color: var(--primary) !important;
}

@media (max-width: 1440px) {
  .banner-category-list {
    width: 14%;
  }
}

@media (max-width: 1199px) {
  .banner-category-list {
    width: 19%;
  }
}

@media (max-width: 1024px) {
  .banner-category-list {
    width: 21% !important;
  }
}

@media (max-width: 991px) {
}
</style>
