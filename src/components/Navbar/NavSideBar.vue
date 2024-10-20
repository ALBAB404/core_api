<script setup>

import { onMounted, ref } from "vue";
import { storeToRefs } from 'pinia';
import {useSetting} from '@/stores'
const setting = useSetting();

const email = ref()
const logo = ref()
const phone = ref()
const title = ref()

const getSettingsData = async() => {
  const settingData = await setting.getData(); 
  settingData.data.map((ele)=> {
    if (ele.key == "header_logo" ) {
      logo.value = ele
    }
    if (ele.key == "footer_email" ) {
      email.value = ele
    }
    if (ele.key == "phone_number" ) {
      phone.value = ele
    }
    if (ele.key == "title" ) {
      title.value = ele
    } 
  })
}


const props = defineProps({
  isNavTrue: Boolean,
  required: true,
});



onMounted(() => {
    getSettingsData();
})


</script>

<template lang="">
  <div>
    <aside class="nav-sidebar">
      <div class="nav-header">
        <router-link :to="{ name: 'homePage'}">
            <img :src="logo?.image" alt="logo" />
        </router-link>
        <button class="nav-close"><i class="fas fa-times"></i></button>
      </div>
      <div class="nav-content">
        <ul class="nav-list">
          <li>
            <a class="nav-link dropdown-link" href="#"
              ><i class="icofont-lock"></i>authentic</a
            >
          </li>
          <li>
            <a class="nav-link dropdown-link" href="#"
              ><i class="icofont-page"></i>Campaign</a
            >
          </li>
          <li>
            <a class="nav-link dropdown-link" href="#"
              ><i class="icofont-book-alt"></i>blogs</a
            >
          </li>
           <!-- <li>
              <a class="nav-link dropdown-link" href="#"
                ><i class="icofont-bag-alt"></i>my account</a
              >
              <ul class="dropdown-list">
                <li><a href="profile.html">profile</a></li>
                <li><a href="wallet.html">wallet</a></li>
                <li><a href="wishlist.html">wishlist</a></li>
                <li><a href="compare.html">compare</a></li>
                <li><a href="checkout.html">checkout</a></li>
                <li><a href="orderlist.html">order history</a></li>
                <li><a href="invoice.html">order invoice</a></li>
                <li><a href="email-template.html">email template</a></li>
              </ul>
            </li> -->
        </ul>
        <div class="nav-info-group">
          <div class="nav-info">
            <i class="icofont-ui-touch-phone"></i>
            <p>
              <small>call us</small>
              <span>{{ phone?.value }}</span>
            </p>
          </div>
          <div class="nav-info">
            <i class="icofont-ui-email"></i>
            <p>
              <small>email us</small>
              <span>{{ email?.value }}</span>
            </p>
          </div>
        </div>
        <div class="nav-footer">
          <p>All Rights Reserved by <a href="#">{{ title?.value }}</a></p>
        </div>
      </div>
    </aside>
  </div>
</template>

<style>

</style>
