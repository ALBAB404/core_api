<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import { TopHeader, Navbar,  Footer,  Newsletter, ChatIcon, AddtoCartIcon } from '@/components'


</script>

<template>
  <div>



    <!-- <ChatIcon /> -->

    <AddtoCartIcon />

    <TopHeader />

    <Navbar />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <Footer /> 

  </div>
</template>

<style >
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>
