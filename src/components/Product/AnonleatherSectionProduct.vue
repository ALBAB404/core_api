<script setup>
import { CoreDeveloperProductCard, ProductCard} from "@/components";

// product data fetch
import { useProduct, useSection } from "@/stores";
import { ref, onMounted } from "vue";
import { ProductSkeleton } from "@/components/skeleton";
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
  <span v-if="!sections.data">
    <div class="container">
      <ProductSkeleton :dataAmount="12" :cols="4" />
    </div>
  </span>
  <span v-else>
    <section
      class="section deals-part"
      v-for="(section, index) in sections.data"
      :key="index"
    >
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
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4">
          <div
            class="col"
            v-for="(product, index) in section.products.data"
            :key="index"
          >
            <!-- <ProductCard :product="product" :types="'sale'" /> -->
            <CoreDeveloperProductCard :product="product" :types="'sale'" />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="section-btn-25">
              <router-link
                :to="{
                  name: 'shopPage',
                  query: { recent: 'recent-product' },
                }"
                class="btn btn-inline"
              >
                <i class="fas fa-eye"></i>
                <span>আরো দেখুন </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </span>
</template>


<style scoped>

</style>