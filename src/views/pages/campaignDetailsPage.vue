
<script setup>
// All Import File  Code Is Here......................................................................................................
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFlashDeal, useCart, useNotification, useShop } from '@/stores'
import { storeToRefs } from 'pinia';
import { CartSideBar, MobileMenu, BannerPart, ProductCard, ProductView } from '@/components';
import  BeatLoader  from 'vue-spinner/src/BeatLoader.vue';
import axiosInstance from "@/services/axiosService.js";
import VueMagnifier from '@websitebeaver/vue-magnifier'
import '@websitebeaver/vue-magnifier/styles.css'

// All Variable  Code Is Here.....................................................................................................
const flashDeal = useFlashDeal()
const { campaignProductById, campaignProduct, loading, campaignVariationProduct } = storeToRefs(flashDeal)
const route = useRoute();
const shop = useShop();

const cart = useCart();
const { loadings } = storeToRefs(cart);
const isloadings = ref(loadings);
const notify = useNotification();
const price = ref()
const isloading = ref(loading);
const color = 'white';
const size = '8px';
const quantityInput = ref(1);
const sizeName = ref();

const thumbnailImage = ref(null)
const activeImage = ref(0)
const images = ref([])

const productPrices = ref()
const selectedSize = ref();
const sizeID = ref();

const socialShares = ref('')

// related product start
const relatedProducts = ref();
const categoryId = ref([]);
// related product end

const changeImage = (img, index) => {
    thumbnailImage.value = img
    activeImage.value = index
}


const campaignProductByID = () => {
    flashDeal.campaignProductById(route.params.campaignId, route.params.productId)
}

function addToCart(tProduct) {
    if (tProduct.campaign_product_prices.length > 0) {        
        cart.addToCart({
          item_id: tProduct.id,
          name: tProduct.name,
          mrp: productPrices.value.mrp,
          offer_price: productPrices.value.offer_price,
          image: tProduct.image,
          size_id: productPrices.value.size_id,
          quantity: quantityInput.value,
          free_shipping:tProduct.free_shipping,
          campaign_id:tProduct.pivot.campaign_id,
        });
    } else {
        cart.addToCart({
          item_id: tProduct.id,
          name: tProduct.name,
          mrp: tProduct.pivot.mrp,
          offer_price: tProduct.pivot.offer_price,
          image: tProduct.image,
          quantity: quantityInput.value,
          free_shipping:tProduct.free_shipping,
          campaign_id:tProduct.pivot.campaign_id,
        });
    }


  notify.Success(`${tProduct.name} Successfully Added Your Cart Item`);
  
}


let matchedPrice = ref()

const sizeByPrice = async (sizeId, campaignId) => {
    console.log(sizeId, campaignId);
    try {
        const res = await axiosInstance.get(`/campaigns/products/${campaignId}/${route.params.productId}/${sizeId}`);
        selectedSize.value = sizeId
        productPrices.value = res.data.result
    } catch (error) {
        console.log(error);   
    }

}



const incrementCartItem = () => {
  if (sizeID.value !== null) {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  }
};
const decrementCartItem = () => {
  if (quantityInput.value != 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
};




// social media link  start



const socialMedia = async () => {
          try {
                const res = await axiosInstance.get('/social-medias');
                socialShares.value = res.data.result;                
            }catch (error) {
                console.log(error);
            }                 
       }


 const socialIcons = (socialType) =>{
      const iconMapping = {
        Facebook: 'fab fa-facebook-f',
        Twitter: 'fab fa-twitter', 
        Whatsapp: "fab fa-whatsapp",
        Messenger: "fab fa-facebook-messenger",
        Linkedin: "fab fa-linkedin",
        Instagram: "fab fa-instagram",
        Phone: "fas fa-phone",
        
      };
      return iconMapping[socialType] || 'default-icon-class';
 }

 
 const socialURL = (socialType,socialUrl) =>{
      const iconMapping = {
        Facebook: `https://www.facebook.com/${socialUrl}/`,
        Twitter: `https://www.twitter.com/${socialUrl}/`, 
        Whatsapp: `https://wa.me/+88${socialUrl}?text=Hello!`,
        Messenger: `https://www.messenger.com/t/${socialUrl}/`,
        Linkedin: `https://www.linkedin.com/${socialUrl}/`,
        Instagram: `https://www.instagram.com/${socialUrl}/`,
        Phone: `https://m.me/+88${socialUrl}`,
        
      };
      return iconMapping[socialType] || 'default-icon-class';
    }
    
    // social media link  end

      // Related product  start
      const getRelatedProductData = async(catId) => {
      let type = '';
      let brand = [];
      let price = [];
      let search = '';
      let paginateSize = 8;
      const res = await shop.getData(type, brand, catId, price, search, paginateSize);
      console.log(res.data);
      relatedProducts.value = res.data;
    }
    

    // Related product end

    categoryId.value.push(campaignProduct.value.category_id);


onMounted(() => {
    campaignProductByID()
    getRelatedProductData(categoryId.value)
    socialMedia();
     $(document).ready(function () {
      $('.venobox').venobox();
    });
})
</script>
<template>
  <div>
    <!--=====================================
                    MOBILE-MENU PART START
        =======================================-->
    <MobileMenu />
    <!--=====================================
                    MOBILE-MENU PART END
        =======================================-->

    <!--=====================================
                    BANNER PART START
        =======================================-->
    <BannerPart :title="campaignProduct?.name" />
    <!--=====================================
                    BANNER PART END
        =======================================-->

    <!--=====================================
                  CART SIDEBAR PART START
        =======================================-->
    <CartSideBar />
    <!--=====================================
                    CART SIDEBAR PART END
        =======================================-->

        <!--=====================================
                    PRODUCT VIEW START
        =======================================-->
    <ProductView />
    <!--=====================================
                    PRODUCT VIEW END
        =======================================-->

    <!--=====================================
                PRODUCT DETAILS PART START
        =======================================-->
    <section class="inner-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <div class="details-gallery">
              <div class="details-label-group">
                <label class="details-label new">{{ campaignProduct?.type }}</label>
                <label class="details-label off">{{ campaignProduct?.discount }}%</label>
              </div>
              <!-- card left -->
              <div class="product-imgs">
                <div class="img-display">
                  <div class="img-showcase">
                    <!-- {{ campaignProduct?.images }} -->

                    <VueMagnifier
                      :src="campaignProduct?.image"
                      width="100%"
                      mgShape="square"
                      height="auto"
                      mgWidth="300"
                      mgHeight="300"
                      className="border-radius"
                      alt="shoe image"
                      v-if="thumbnailImage == null"
                    />
                    <VueMagnifier
                      :src="thumbnailImage"
                      width="100%"
                      height="auto"
                      mgShape="square"
                      mgWidth="300"
                      mgHeight="300"
                      alt="shoe image"
                      v-else
                    />

                    <!-- <img :src="campaignProduct?.image" alt="shoe image" v-if="thumbnailImage == null" />
                    <img :src="thumbnailImage" alt="shoe image" v-else /> -->
                  </div>
                </div>
                <div class="img-select">
                  <div
                    class="img-item"
                    v-for="(img, index) in campaignProduct?.images"
                    :key="index"
                    :class="[activeImage == index ? 'active-thumb' : '']"
                  >
                    <img
                      :src="img.image"
                      alt="shoe image"
                      @click.prevent="changeImage(img.image, index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="details-content">
              <h3 class="details-name">
                <a href="#">{{ campaignProduct?.name }}</a>
              </h3>
              <div class="details-meta">
                <p v-if="campaignProduct?.sku">
                  SKU:<span>{{ campaignProduct?.sku }}</span>
                </p>
                <p>
                  BRAND:<a href="#">{{ campaignProduct?.brand }}</a>
                </p>
              </div>
              <template v-if="campaignProduct?.campaign_product_prices.length > 0">
                <h3 class="details-price" v-if="!productPrices">
                  <span v-for="(productsPrice, index) in campaignProduct?.campaign_product_prices" :key="index">
                    <span v-if="productsPrice?.pivot.is_default == 1">
                      <span v-html="$filters.productPrice(productsPrice?.pivot)"></span>
                    </span>
                  </span>
                </h3>
                <h3 class="details-price" v-else>
                  <span>{{ productPrices.offer_price ?  productPrices.offer_price : productPrices.mr }}</span>
                </h3>
              </template>
              <template v-else>
                <h3 class="details-price" v-if="campaignProduct?.offer_price == 0">
                  <span>{{ campaignProduct?.mrp }}</span>
                </h3>
                <h3 class="details-price" v-else>
                  <del>{{ campaignProduct?.mrp }}</del> <span>{{ campaignProduct?.offer_price }}</span>
                </h3>
              </template>
              <p class="details-desc" v-html="campaignProduct?.short_description"></p>
              <div class="details-list-group">
                <label class="details-list-title" v-show="campaignProduct?.campaign_product_prices.length > 0"
                  >Weight:</label
                >
                <ul class="details-tag-list">
                  <li v-for="(size, index) in campaignProduct.campaign_product_prices" :key="index"><a href="#" @click.prevent="sizeByPrice(size.id, size.pivot.campaign_id)" :class="{ 'selectedSizeColor': size.id === selectedSize }">{{ size.name }}</a></li>
                </ul>
              </div>
              <div class="details-list-group">
                <label class="details-list-title" v-show="socialShares.length > 0"
                  >Share:</label
                >
                <ul class="details-share-list">
                  <li v-for="(socialShare, index) in socialShares" :key="index">
                    <a :href="socialURL(socialShare.type, socialShare.contact)" target="_blank" title=""
                      ><i :class="socialIcons(socialShare.type)"></i
                    ></a>
                  </li>
                </ul>
              </div>
              <div class="details-add-group" v-if="campaignProduct?.campaign_product_prices.length > 0">
                <div class="row">
                  <span
                    class="row d-block text-center text-danger"
                    v-if="productPrices == null"
                    >Choose a Variations First then Click Add to Cart or Buy Now
                    Button</span
                  >
                  <div class="col-md-12">
                    <div class="quentyDefaultClass">
                      <button
                        class="action-minus"
                        :disabled="productPrices == null ? true : false"
                        @click.prevent="decrementCartItem"
                        title="Quantity Minus"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input
                        class="action-input text-center"
                        :class="selectedSize == null ? 'disabled' : ''"
                        title="Quantity Number"
                        type="text"
                        name="quantity"
                        v-model="quantityInput"
                      />
                      <button
                        class="action-plus"
                        :disabled="productPrices == null ? true : false"
                        @click.prevent="incrementCartItem"
                        title="Quantity Plus"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="row mt-lg-3 mt-0">
                  <div class="col-md-6 mt-2" v-if="selectedSize">
                    <router-link
                      :to="{ name: 'checkoutPage' }"
                      :disabled="productPrices == null ? true : false"
                      class="product-add"
                      @click.prevent="addToCart(campaignProduct)"
                      :class="selectedSize == null ? 'disabled' : ''"
                    >
                      <i class="fas fa-shopping-basket"></i>
                      <span>অর্ডার করুন</span>
                    </router-link>
                  </div>
                  <div class="col-md-6 mt-2">
                    <button
                      class="product-add"
                      title="Add to Cart"
                      :disabled="productPrices == null ? true : false"
                      :class="selectedSize == null ? 'disabled' : ''"
                      @click.prevent="addToCart(campaignProduct)"
                    >
                      <template v-if="isloading">
                        <beat-loader
                          :loading="loading"
                          :color="color"
                          :size="size"
                        ></beat-loader>
                      </template>
                      <template v-else><i class="fas fa-shopping-basket"></i></template>
                      <span>কার্টে যোগ করুন</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="details-add-group" v-else>
                <div class="row">
                  <div class="col-md-12">
                    <div class="quentyDefaultClass">
                      <button
                        class="action-minus"
                        @click.prevent="decrementCartItem"
                        title="Quantity Minus"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input
                        class="action-input text-center"
                        title="Quantity Number"
                        type="text"
                        name="quantity"
                        v-model="quantityInput"
                      />
                      <button
                        class="action-plus"
                        @click.prevent="incrementCartItem"
                        title="Quantity Plus"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  
                </div>
                <div class="row mt-2">

                  <div class="col-md-6 mt-2">
                    <router-link
                      :to="{ name: 'checkoutPage' }"
                      class="product-add bg-dark"
                      title="Add to Cart"
                      @click.prevent="addToCart(campaignProduct)"
                    >
                      <i class="fas fa-shopping-basket"></i>
                      <span>অর্ডার করুন</span>
                    </router-link>
                  </div>

                  <div class="col-md-6 mt-2">
                    <button
                      class="product-add"
                      title="Add to Cart"
                      @click.prevent="addToCart(campaignProduct)"
                    >
                      <template v-if="isloading">
                        <beat-loader
                          :loading="loading"
                          :color="color"
                          :size="size"
                        ></beat-loader>
                      </template>
                      <template v-else><i class="fas fa-shopping-basket"></i></template>
                      <span>কার্টে যোগ করুন</span>
                    </button>
                  </div>

                </div>
              </div>

              <div class="row mt-2">
                <div class="col-md-6 mt-2">
                  <a :href="`https://wa.me/+8801791580400?text=Product%20Details%0A%0AWebsite:%20https://ponnorokom.com/single-product/${campaignProduct?.id}%0AProduct%20Name:%20${campaignProduct?.name}%0AProduct%20Size:%20${sizeName}%0AOffer%20Price:%20${productPrices ? productPrices?.offer_price : campaignProduct?.offer_price}৳%0ARegular%20Price:%20${productPrices ? productPrices?.mrp : campaignProduct?.mrp}৳`" 
                    class="product-add bg-success" target="_blank">
                    <i class="fab fa-whatsapp"></i><span>হোয়াটসঅ্যাপ</span>
                  </a>
                </div>
                <div class="col-md-6 mt-2">
                    <a href="tel:+8801791580400" class="product-add bg-success"><i class="fas fa-phone-alt"></i><span>ফোন করুন</span></a>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
    <!--=====================================
                PRODUCT DETAILS PART END
        =======================================-->

    <!--=====================================
                  PRODUCT TAB PART START
        =======================================-->
    <section class="inner-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <ul class="nav nav-tabs">
              <li v-if="campaignProduct?.description">
                <a href="#tab-desc" class="tab-link active" data-bs-toggle="tab"
                  >descriptions</a
                >
              </li>
              <li>
                <a href="#tab-spec" class="tab-link" data-bs-toggle="tab"
                  >Specifications</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="tab-pane fade show active" id="tab-desc">
          <div class="row">
            <div class="col-lg-6 order-lg-1 order-2" v-if="campaignProduct?.description">
              <div class="product-details-frame">
                <div class="tab-descrip" v-html="campaignProduct?.description"></div>
              </div>
            </div>
            <div class="col-lg-6 order-lg-2 order-1" v-if="campaignProduct?.video_url">
              <div class="product-details-frame">
                <div class="tab-descrip">
                  <div class="videoHW">
                    <iframe class="mt-5"  :src="getEmbedUrl(campaignProduct?.video_url)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>              
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="tab-spec">
          <div class="row">
            <div class="col-lg-12">
              <div class="product-details-frame">
                <table class="table table-bordered">
                  <tbody>
                    <tr v-if="campaignProduct?.sku">
                      <th scope="row">Product code</th>
                      <td>SKU: {{ campaignProduct?.sku }}</td>
                    </tr>
                    <tr v-if="campaignProduct?.category">
                      <th scope="row">Category</th>
                      <td>{{ campaignProduct?.category }}</td>
                    </tr>
                    <tr v-if="campaignProduct?.brand">
                      <th scope="row">Brand</th>
                      <td>{{ campaignProduct?.brand }}</td>
                    </tr>
                    <tr v-if="campaignProduct?.type">
                      <th scope="row">Type</th>
                      <td>{{ campaignProduct?.type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--=====================================
                    PRODUCT TAB PART END
        =======================================-->

    <!--=====================================
                 PRODUCT Up Sale Product PART START
        =======================================-->

    <!--=====================================
                 PRODUCT Up Sale Product PART END
        =======================================-->
    <!--=====================================
                 PRODUCT RELATED PART START
        =======================================-->
    <section class="inner-section" v-if="relatedProducts?.length > 0">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="section-heading">
              <h2>Related Products</h2>
            </div>
          </div>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4">
          <div
            class="col"
            v-for="(relatedProduct, index) in relatedProducts"
            :key="index"
          >
            <ProductCard :product="relatedProduct" />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="section-btn-25">
              <router-link
                :to="{ name: 'shopPage', query: { category: categoryId } }"
                class="btn btn-outline"
              >
                <i class="fas fa-eye"></i>
                <span>view all related</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--=====================================
                 PRODUCT RELATED PART END
        =======================================-->
  </div>
</template>

<style scoped>
@import "@/assets/css/product-details.css";

/* video section start */
.videoHW iframe{
  width: 560px !important;
  height: 315px !important;
}
/* video section end */


.singlePGAddbtn{
  background-color: #000000;
  color: white;
  padding: 10px 74px;
  border-radius: 5px;
}

.singlePGOrderbtn{
  background-color: #ff0000;
  color: white;
  padding: 10px 74px;
  border-radius: 5px;
}

.product-add, .action-input{
  width: 100% !important;
}


.disabled {
  background: #c48b8b !important;
}

.border-radius {
  border-radius: 12px;
}

img {
  width: 100%;
  display: block;
}

.img-display {
  overflow: hidden;
}

.img-showcase {
  display: flex;
  width: 100%;
  transition: all 0.5s ease;
}

.img-showcase img {
  min-width: 100%;
}

.img-select {
  display: flex;
}

.img-item {
  margin: 0.3rem;
}

.img-item:nth-child(1),
.img-item:nth-child(2),
.img-item:nth-child(3) {
  margin-right: 0;
}

.img-item:hover {
  opacity: 0.8;
}

.active-thumb {
  border: 2px solid #119744;
}

.img-item {
  width: 23%;
}

.img-select {
  margin-top: 10px;
}

.selectedSizeColor {
  color: white !important;
  background-color: #ff0000 !important;
}

.quentyDefaultClass {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quentyDefaultClass button {
  font-size: 28px;
}

.quentyDefaultClass input {
  margin: 0px 8px;
  border-radius: 5px;
}

@media (max-width: 1024px) {

.videoHW iframe{
  width: 383px !important;
  height: 190px!important;
}

}


@media (max-width: 768px) {

.videoHW iframe{
  width: auto !important;
  height: auto !important;
}

}



@media (max-width: 425px) {

  .videoHW iframe{
    width: 355px !important;
    height: 220px !important;
  }

  .quentyDefaultClass {
    margin: 16px 0px;
  }

  .quentyDefaultClass input {
    width: 260px;
  }
}

@media (max-width: 375px) {

  .videoHW iframe{
    width: 305px !important;
    height: 170px !important;
  }

  .quentyDefaultClass {
    margin: 16px 0px;
  }

  .quentyDefaultClass input {
    width: 200px;
  }
}

@media (max-width: 320px) {

  .videoHW iframe{
    width: 251px !important;
    height: 150px !important;
  }

  .quentyDefaultClass {
    margin: 16px 0px;
  }

  .quentyDefaultClass input {
    width: 150px;
  }
}
</style>
