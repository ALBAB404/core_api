<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import { TopHeader, Navbar,  Footer,  Newsletter, ChatIcon } from '@/components'


</script>

<template>
  <div>



    <!-- <ChatIcon /> -->

    <!-- <TopHeader /> -->

    <Navbar />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- <Footer /> -->

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
