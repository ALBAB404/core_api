<script setup>
import { useCategory } from "@/stores";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
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
    <div class="container mt-4 mb-5">
      <div class="section-heading">
        <h2>
          <span class="section-header-text">Category Section</span>
        </h2>
        <div class="heading-line"></div>
      </div>
      <div class="row">
        <div
          class="col-4 col-md-3  mb-4"
          v-for="(category, index) in categories?.data"
          :key="index"
        >
          <router-link
            :to="{ name: 'shopPage', query: { category: category.id } }"
          >
            <img
              :src="category.image"
              alt=""
              width="100%"
            />
          </router-link>
        </div>
      </div>
    </div>
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
