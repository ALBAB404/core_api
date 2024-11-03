<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import { Footer,  Newsletter, ChatIcon, AddtoCartIcon, Header, CoreDeveloperHeader } from '@/components'

let uniqueID = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
localStorage.setItem('uniqueVisitorID', uniqueID);

</script>

<template>
  <div>



    <ChatIcon />

    <AddtoCartIcon />

    <Header />

    <!-- <CoreDeveloperHeader />  -->

    <router-view></router-view>


    <Footer /> 

  </div>
</template>

<style >



</style>
