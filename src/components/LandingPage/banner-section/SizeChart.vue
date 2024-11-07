<script setup>

import { ref } from "vue";

const props = defineProps({
 landingPageData: {
    type: Object,
    default: {}, 
  },
});

</script>

<template>
  <div>
    <section>
      <div class="clb-size" v-if="landingPageData">
          <div class="container ">
              <div class="">
                  <h2 class="title-size"> <span class="sp">{{ landingPageData.title }}</span></h2>
              </div>
              <div class="container">
                  <div class="row">
                      <div class="col">
                          <img :src="landingPageData.image" alt="Responsive Image" class="img-fluid img-lf-size">
                      </div>
                    </div>
                </div>
            </div>
        </div>
      
  </section> 
  </div>
</template>


<style scoped>

</style>