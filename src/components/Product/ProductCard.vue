<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCart, useNotification, useAuth, useModal } from "@/stores";
import axiosInstance from "@/services/axiosService.js";
import { addToCart } from '@/composables'

// All Variable  Code Is Here.....................................................................................................
const modal         = useModal()
const auth          = useAuth();
const cart          = useCart();
const { loading }   = storeToRefs(cart);
const notify        = useNotification();
const isloading     = ref(loading);
const color         = "white";
const size          = "8px";
const quantityInput = ref(1);
const props = defineProps({
  product: Object,
  types: String,
  product_prices: Number,
  required: true,
});

const price          = ref();
const route          = useRoute();
const router         = useRouter();

const sizeMrp        = ref();
const sizeOfferPrice = ref();
const sizeId         = ref();
const productPrices  = ref();
const sizeName       = ref();
const selectedSize   = ref();


const isButtonDisabled = ref(true);


// sizes start

const sizeByPrice = (mrp, offerPrice, sizeID) => {
  sizeMrp.value        = mrp;
  sizeOfferPrice.value = offerPrice;
  sizeId.value         = sizeID;
  isButtonDisabled.value = false;
}

// sizes end

// auth login part start 
const isLogin = (product) => {
  if (Object.keys(auth.user).length > 0) {
    addToCart(product)
    router.push({ name: "checkoutPage" });
  }else{
    // $("#login-modal").modal("show")
    modal.toggleModal();
    addToCart(product)
  }
}
// auth login part end

onMounted(() => {
  $(document).ready(function () {
    $(".venobox").venobox();
  });


});
</script>

<template>
  <div>
    <div class="product-card" :class="product?.current_stock == 0 ? 'product-disable' : ''">
      <div class="product-media">
        <div class="product-label">
            <label class="label-text off"  v-if="product?.offer_percent != 0.00">-{{ product?.offer_percent }}%</label>
            <label class="label-text" :class="product?.type === 'feature-product'? 'feat': product?.type === 'top-product'? 'sale': product?.type === 'recent-product'? 'new': ''">{{ product?.type }}</label>
          </div>
          <button class="product-wish wish">
              <i class="fas fa-heart"></i>
          </button>

          <router-link :to="{name: 'productDetailsPage',params: { id: product?.id ? product?.id : 0, slug: product?.slug ? product?.slug : 0 },}" class="hover14 column hover01 column">
            <div class="product-image">
              <figure><img :src="product?.image"></figure>
            </div>
          </router-link>

          <div class="product-widget" v-show="product?.video_url">
            <a title="Product Video" :href="product?.video_url" class="venobox fas fa-play" data-vbtype="video" data-autoplay="true"></a>
          </div>
      </div>
      <div class="product-content">
          <div class="product-rating">
              <i class="active icofont-star"></i>
              <i class="active icofont-star"></i>
              <i class="active icofont-star"></i>
              <i class="active icofont-star"></i>
              <i class="icofont-star"></i>
              <router-link :to="{name: 'productDetailsPage',params: { id: product?.id ? product?.id : 0, slug: product?.slug ? product?.slug : 0 },}">(3)</router-link>
          </div>
          <h6 class="product-name">
              <router-link :to="{name: 'productDetailsPage',params: { id: product?.id ? product?.id : 0, slug: product?.slug ? product?.slug : 0 },}" >{{ product?.name }}</router-link>
          </h6>


          <h6 class="product-price" v-if="product?.variations?.data?.length > 0">
            <span>{{ product?.variation_price_range.min_price }} - {{ product?.variation_price_range.max_price }}</span>
          </h6>
          <h6 class="product-price" v-else>
            <span v-html="$filters.productPrice(product)"></span>
          </h6>


          <button class="product-add" title="Add to Cart" @click.prevent="addToCart(product)">
              <i :class="loading == product.id ? 'fa-solid fa-spinner fa-spin' : 'fas fa-shopping-basket'"></i>
              <span>add</span>
          </button>
      </div>
  </div>


  </div>
</template>

<style scoped>

/* Shine */
.hover14 figure {
	position: relative;
}
.hover14 figure::before {
	position: absolute;
	top: 0;
	left: -75%;
	z-index: 2;
	display: block;
	content: '';
	width: 50%;
	height: 100%;
	background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
	background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
	-webkit-transform: skewX(-25deg);
	transform: skewX(-25deg);
}
.hover14 figure:hover::before {
	-webkit-animation: shine .75s;
	animation: shine .75s;
}
@-webkit-keyframes shine {
	100% {
		left: 125%;
	}
}
@keyframes shine {
	100% {
		left: 125%;
	}
}

/* Zoom In #1 */
.hover01 figure img {
	-webkit-transform: scale(1);
	transform: scale(1);
	-webkit-transition: .3s ease-in-out;
	transition: .3s ease-in-out;
}
.hover01 figure:hover img {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}


.product-name a {
  width: 204px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* product variation start */

.details-list-group {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-pack: start;
      -ms-flex-pack: start;
          justify-content: flex-start;
  margin-bottom: 25px;
}


.details-list-group label{
  margin-right: 20px;
}

.details-list-group:last-child {
  margin-bottom: 0px;
}

.details-tag-list {
    display: block;
  }
  .details-tag-list li{
    display: inline-block;
    margin: 5px;
  }

.details-tag-list li a {
  font-size: 14px;
  line-height: 12px;
  padding: 8px 10px;
  border-radius: 5px;
  letter-spacing: 0.3px;
  text-transform: capitalize;
  color: var(--text);
  background: var(--chalk);
  transition: all linear .3s;
  -webkit-transition: all linear .3s;
  -moz-transition: all linear .3s;
  -ms-transition: all linear .3s;
  -o-transition: all linear .3s;
}

.details-tag-list li a:hover {
  color: var(--white);
  background: var(--primary);
}

.selectedSizeColor {
  color: white !important;
  background-color: #ff0000 !important;
}

.btnColorOrder{
  background-color: #000000 !important;
  color: #fff !important;
}

.product-card:hover .btnColorOrder{
  background-color: #e8e8e8 !important;
  color: #000000 !important;
}
/* product variation end */

@media (max-width: 576px) {
  .standard-wishs {
    margin-top: 8px;
  }
}


@media (max-width: 425px) {
  .details-tag-list {
    display: block;
  }
  .details-tag-list li{
    display: inline-block;
    margin-top: 10px;
  }
  .product-name a {
    width: 167px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}


</style>
