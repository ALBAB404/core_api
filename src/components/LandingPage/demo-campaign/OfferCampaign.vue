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
      <div class="container mt-5 ct-title" v-if="landingPageData">
          <div class="text-center mb-4 rt tdr">
              <div class="">
                  <h1 class="card-title rs">{{ landingPageData.title }}</h1>
              </div>
          </div>

          <div class="row">
              <div class="col-md-6 mb-4">
                  <div class="card">
                      <div class="card-body c-bd">
                          <h5 class="card-title text-center"><span class="tx-r">রেগুলার মূল্যঃ</span><span
                                  class="tx-bl"> {{ landingPageData.titles[0].title }}</span>
                              <span class="tx-r">টাকা</span></h5>
                      </div>
                  </div>
              </div>
           
              <div class="col-md-6 mb-4">
                  <div class="card">
                      <div class="card-body c-bd">
                          <h5 class="card-title text-center"><span class="tx-r">অফার মূল্যঃ</span> <span
                                  class="tx-bl"> {{ landingPageData.titles[1].title }} </span><span class="tx-r">টাকা</span></h5>
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