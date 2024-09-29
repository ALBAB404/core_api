<script setup>

import { useCampaign } from '@/stores'
import { onMounted, ref } from 'vue'; 
const campaign = useCampaign();
const campaignBanners = ref('');


const getCampaignBanners = async() =>{
  const res =  await campaign.getCampaignBanner();
  campaignBanners.value = res.data;  
}

onMounted(() => {
  getCampaignBanners();
})

</script>

<template>
  <div class="my-5">
    <div class="main-campaign-section container m-auto">
      <div class="campaign-title text-center">
        <h1>All Campaigns</h1>
      </div>
      <div class="campaign-banner mt-5">
         <div class="row">
           <div class="col-md-6 mt-4" v-for="(campaignBanner, index) in campaignBanners" :key="index">
              <router-link :to="{name: 'CampaignProductList', params: { campaignId: campaignBanner?.id } }">
                <img :src="campaignBanner.image" alt="" style="width: 100%;">
              </router-link>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

.main-campaign-section{
  background-color: var(--white);
  padding: 30px;
}

</style>