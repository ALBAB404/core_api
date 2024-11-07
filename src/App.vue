<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import { Footer,  Newsletter, ChatIcon, AddtoCartIcon, Header, CoreDeveloperHeader } from '@/components'
import { useRoute } from 'vue-router';
import LandingPage from './views/pages/LandingPage/LandingPage.vue';

const route = useRoute();
console.log(route);

// route checking for landing pages start
const isMatchingPath = () => {
  const slugPath = `/${route.params.slug}`;
  const fullPath = `${route.fullPath}`;
  return fullPath != slugPath;
};
// route checking for landing pages end 


let uniqueID = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
localStorage.setItem('uniqueVisitorID', uniqueID);


</script>

<template>
  <div>

    <span v-if="isMatchingPath()">
      <ChatIcon />
  
      <AddtoCartIcon />
  
      <Header />
  
      <!-- <CoreDeveloperHeader />  -->
  
      <router-view></router-view>
  
  
      <Footer /> 
    </span>
    <span v-else>
      <LandingPage />
    </span>

  </div>
</template>

<style >



</style>
