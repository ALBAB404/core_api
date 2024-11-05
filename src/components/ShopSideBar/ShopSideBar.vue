<script setup>
// All Import File  Code Is Here......................................................................................................
import { useCategory, useCommonIsToggleFunctionality } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
// All Variable  Code Is Here.....................................................................................................
const category = useCategory();
const commonIsToggleFunctionality = useCommonIsToggleFunctionality();
const { shopSideBar } = storeToRefs(commonIsToggleFunctionality);

</script>

<template lang="">
  <div>
    <div
      class="backdrop"
      :style="{ display: shopSideBar ? 'block' : 'none' }"
      @click="commonIsToggleFunctionality.isShopSideBarOpenOrClose"
    ></div>

    <aside :class="['category-sidebar', { active: shopSideBar }]">
      <div class="shop-widget">
          <h6 class="shop-widget-title">Filter by Price</h6>
          <form>
              <div class="shop-widget-group">
                  <input type="text" placeholder="Min - 00">
                  <input type="text" placeholder="Max - 5k">
              </div>
              <button class="shop-widget-btn">
                  <i class="fas fa-search"></i>
                  <span>search</span>
              </button>
          </form>
      </div>
      <div class="shop-widget">
          <h6 class="shop-widget-title">Filter by Brand</h6>
          <form>
              <input class="shop-widget-search" type="text" placeholder="Search...">
              <ul class="shop-widget-list shop-widget-scroll">
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand1">
                          <label for="brand1">mari gold</label>
                      </div>
                      <span class="shop-widget-number">(13)</span>
                  </li>
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand2">
                          <label for="brand2">tredar</label>
                      </div>
                      <span class="shop-widget-number">(28)</span>
                  </li>
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand3">
                          <label for="brand3">keya</label>
                      </div>
                      <span class="shop-widget-number">(35)</span>
                  </li>
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand4">
                          <label for="brand4">diamond</label>
                      </div>
                      <span class="shop-widget-number">(47)</span>
                  </li>
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand5">
                          <label for="brand5">lilly's</label>
                      </div>
                      <span class="shop-widget-number">(59)</span>
                  </li>
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand6">
                          <label for="brand6">fremant</label>
                      </div>
                      <span class="shop-widget-number">(64)</span>
                  </li>
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand7">
                          <label for="brand7">avocads</label>
                      </div>
                      <span class="shop-widget-number">(77)</span>
                  </li>
                  <li>
                      <div class="shop-widget-content">
                          <input type="checkbox" id="brand8">
                          <label for="brand8">boroclas</label>
                      </div>
                      <span class="shop-widget-number">(85)</span>
                  </li>
              </ul>
              <button class="shop-widget-btn">
                  <i class="far fa-trash-alt"></i>
                  <span>clear filter</span>
              </button>
          </form>
      </div>

      <div class="category-footer">
        <p class="text-danger fw-bold">&copy; 2024 Anon Leather</p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.category-sidebar{
  overflow-y: scroll;
}

.shop-widget {
  border-top: none !important;
  border-left: none !important;
  border-bottom: none !important;
  border-right: none !important;
}

</style>
