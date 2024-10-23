<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch, onUpdated } from "vue";
import { useRoute } from "vue-router";
import {
  useProduct,
  useCart,
  useNotification,
  useShop,
  useSetting,
} from "@/stores";
import { storeToRefs } from "pinia";
import {
  CartSideBar,
  MobileMenu,
  BannerPart,
  ProductCard,
  ProductView,
  CategorySideBar,
  NavSideBar,
  ProductVariation,
  ProductImage,
} from "@/components";
import { SingleProductPageSkeleton } from "@/components/skeleton";
import { mrpOrOfferPrice, addToCart } from "@/composables";
import axiosInstance from "@/services/axiosService.js";

const product       = useProduct();
const singleProduct = ref("");
const sizeName      = ref("");
const productPrices = ref("");
const route         = useRoute();
const shop          = useShop();
const { products }  = storeToRefs(shop);
const cart          = useCart();
const { loading }   = storeToRefs(cart);
const notify        = useNotification();
const price         = ref();
const quantityInput = ref(1);
const categoryId    = ref([]);
const setting       = useSetting();

// product variations start
const productVariations     = ref([]);
const attribute_id_1        = ref(null);
const attribute_id_2        = ref(null);
const attribute_id_3        = ref(null);
const attribute_value_id_1  = ref(null);
const attribute_value_id_2  = ref(null);
const attribute_value_id_3  = ref(null);
const productVariationData  = ref("");
const productVariationPrice = ref("");
const resetBtns             = ref(false);
const activeBtns            = ref(false);
const variationRemoveBtn    = ref(false);
const activeAttributes = ref({
  0: [],
  1: [],
  2: [],
});
// product variations end

// social Icons start
const socialShares = ref("");
// social Icons end
// Setting data start
const websiteUrl  = ref("");
const phone       = ref("");
const whatsapp    = ref("");
const messengerId = ref("");
// Setting data end
// related product start
const relatedProducts = ref("");
// related product end

const alertTimeout = ref("");



// get products start
const productByid = async () => {
  singleProduct.value = await product.productById(route.params.slug);
  productVariations.value = singleProduct.value?.variations?.attributes;
};
// get products end
// get products variation working start

async function getProductVariation(productId, attributeValue, index) {
  resetBtns.value = true;

  // variation selected section start
  if (activeAttributes.value[index] === attributeValue.attribute_value_id) {
    // যদি ক্লিক করা ভ্যালুটি ইতিমধ্যেই সক্রিয় থাকে, তাহলে নিষ্ক্রিয় করুন
    activeAttributes.value[index] = null;
  } else {
    // যদি ক্লিক করা ভ্যালুটি সক্রিয় না থাকে, তাহলে এটিকে সক্রিয় করুন এবং অন্যান্য সক্রিয়গুলো নিষ্ক্রিয় করুন
    activeAttributes.value[index] = attributeValue.attribute_value_id;
  }
  // variation selected section end

  if (index === 0) {
    attribute_id_1.value = attributeValue.attribute_id;
    attribute_value_id_1.value = attributeValue.attribute_value_id;
    productVariationData.value = {
      product_id: productId,
      attribute_id_1: attribute_id_1.value || "",
      attribute_value_id_1: attribute_value_id_1.value || "",
      attribute_id_2: "",
      attribute_value_id_2: attribute_value_id_2.value || "",
      attribute_id_3: "",
      attribute_value_id_3: attribute_value_id_3.value || "",
    };
  }

  if (index === 1) {
    attribute_id_2.value = attributeValue.attribute_id;
    attribute_value_id_2.value = attributeValue.attribute_value_id;
    productVariationData.value = {
      product_id: productId,
      attribute_id_1: "",
      attribute_value_id_1: attribute_value_id_1.value || "",
      attribute_id_2: attribute_id_2.value || "",
      attribute_value_id_2: attribute_value_id_2.value || "",
      attribute_id_3: "",
      attribute_value_id_3: attribute_value_id_3.value || "",
    };
  }
  if (index === 2) {
    attribute_id_3.value = attributeValue.attribute_id;
    attribute_value_id_3.value = attributeValue.attribute_value_id;
    productVariationData.value = {
      product_id: productId,
      attribute_id_1: "",
      attribute_value_id_1: attribute_value_id_1.value || "",
      attribute_id_2: "",
      attribute_value_id_2: attribute_value_id_2.value || "",
      attribute_id_3: attribute_id_3.value || "",
      attribute_value_id_3: attribute_value_id_3.value || "",
    };
  }

  const variations = await product.productVariations(
    productVariationData.value
  );

  productVariations.value = variations.attributes;

  // price jodi backend theke dubble na hoy eitar code start

  if (
    Object.keys(productVariations.value).length == 1 &&
    attribute_value_id_1.value != null
  ) {
    productVariationPrice.value = variations.variation_price[0];
    activeBtns.value = true;
  }
  if (
    Object.keys(productVariations.value).length == 2 &&
    attribute_value_id_2.value != null &&
    attribute_value_id_1.value != null
  ) {
    productVariationPrice.value = variations.variation_price[0];
    activeBtns.value = true;
  }
  if (
    Object.keys(productVariations.value).length == 3 &&
    attribute_value_id_3.value != null &&
    attribute_value_id_2.value != null &&
    attribute_value_id_1.value != null
  ) {
    productVariationPrice.value = variations.variation_price[0];
    activeBtns.value = true;
  }

  // price jodi backend theke dubble na hoy eitar code end
}

const removeAllVariation = () => {
  // Reset the product variations
  productVariations.value = [];
  quantityInput.value = 1;

  // Reset the attribute value IDs
  attribute_value_id_1.value = null;
  attribute_value_id_2.value = null;
  attribute_value_id_3.value = null;

  // Reset the product variation data
  productVariationData.value = "";

  // Reset the product variation price
  productVariationPrice.value = "";

  // Reset the active buttons state
  activeBtns.value = false;

  // Reset the active attributes
  activeAttributes.value = {
    0: [],
    1: [],
    2: [],
  };

  productVariations.value = singleProduct.value?.variations?.attributes;

  resetBtns.value = false;
};

// get products variation working end

const incrementCartItem = () => {
  quantityInput.value = parseInt(quantityInput.value) + 1;
};
const decrementCartItem = () => {
  if (quantityInput.value != 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
};

// setting data start
const getSettingsData = async () => {
  const settingData = await setting.getData();
  settingData.data.map((ele) => {
    if (ele.key == "phone_number") {
      phone.value = ele;
    }
    if (ele.key == "whatsapp_number") {
      whatsapp.value = ele;
    }
    if (ele.key == "website_url") {
      websiteUrl.value = ele;
    }
    if (ele.key == "messenger_id") {
      messengerId.value = ele;
    }
  });
};
// setting data end

// footer navbar Start

const stickyFooter = () => {
  const innerSection = document.querySelector(".inner-section");
  const mainFooterNavSection = document.querySelector(
    ".main-footer-nav-section"
  );

  window.addEventListener("scroll", () => {
    const scrollTopWindow = window.pageYOffset;
    if (scrollTopWindow > 80) {
      mainFooterNavSection.style.bottom = "0px";
      mainFooterNavSection.style.transition = "all .5s ease";
      mainFooterNavSection.style.opacity = "1";
    } else {
      mainFooterNavSection.style.bottom = "-115px";
      mainFooterNavSection.style.transition = "all .5s ease";
      mainFooterNavSection.style.opacity = "0";
    }
  });

  if (innerSection) {
    innerSection.addEventListener("scroll", () => {
      const scrollTopInnerSection = innerSection.scrollTop;
      if (scrollTopInnerSection > 80) {
        mainFooterNavSection.style.bottom = "0px";
        mainFooterNavSection.style.transition = "all .5s ease";
        mainFooterNavSection.style.opacity = "1";
      } else {
        mainFooterNavSection.style.bottom = "-115px";
        mainFooterNavSection.style.transition = "all .5s ease";
        mainFooterNavSection.style.opacity = "0";
      }
    });
  }
};

// footer navbar end

// social media link  start

const socialMedia = async () => {
  try {
    const res = await axiosInstance.get("/social-medias");
    socialShares.value = res.data.result;
  } catch (error) {
    console.log(error);
  }
};

const socialIcons = (socialType) => {
  const iconMapping = {
    Facebook: "fab fa-facebook-f",
    Twitter: "fab fa-twitter",
    Whatsapp: "fab fa-whatsapp",
    Messenger: "fab fa-facebook-messenger",
    Linkedin: "fab fa-linkedin",
    Instagram: "fab fa-instagram",
    Phone: "fas fa-phone",
  };
  return iconMapping[socialType] || "default-icon-class";
};

const socialURL = (socialType, socialUrl) => {
  const iconMapping = {
    Facebook: `https://www.facebook.com/${socialUrl}/`,
    Twitter: `https://www.twitter.com/${socialUrl}/`,
    Whatsapp: `https://wa.me/+88${socialUrl}?text=Hello!`,
    Messenger: `https://www.messenger.com/t/${socialUrl}/`,
    Linkedin: `https://www.linkedin.com/${socialUrl}/`,
    Instagram: `https://www.instagram.com/${socialUrl}/`,
    Phone: `https://m.me/+88${socialUrl}`,
  };
  return iconMapping[socialType] || "default-icon-class";
};

// social media link  end

const backgroundImageUrl = ref("https://wpmet.com/plugin/elementskit/popup-modal/wp-content/uploads/sites/9/2022/06/big_offer_item_02.png");

const handleBeforeUnload = (event) => {

  event.preventDefault();
  event.returnValue = 'fdsfsdf'; 
  

  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('product-view'));
    modal.show();
  }, 10); 
};



// video url setup start

const getEmbedUrl = (watchUrl) => {
  const videoIdMatch = watchUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  const videoId = (videoIdMatch && videoIdMatch[1]) || '';
  
  return `https://www.youtube.com/embed/${videoId}`;
}

// video url setup end


onMounted(() => {
  stickyFooter();
  productByid();
  socialMedia();
  window.addEventListener('beforeunload', handleBeforeUnload);
  // alertTimeout.value = setTimeout(() => {
  //   handleBeforeUnload();
  // }, 1000);

});



onBeforeUnmount(() => {
  if (alertTimeout.value) {
    clearTimeout(alertTimeout.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

</script>

<template>
  <div>
    <!--=====================================
                CART SIDEBAR PART START
    =======================================-->
    <CartSideBar />
    <!--=====================================
                    CART SIDEBAR PART END
    =======================================-->

    <section class="inner-section mt-4" v-if="singleProduct">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <ProductImage :singleProduct="singleProduct" :type="'details'" />
          </div>
          <div class="col-lg-6">
            <div class="details-content">
              <h3 class="details-name">
                <a href="#">{{ singleProduct?.name }}</a>
              </h3>
              <div class="details-meta">
                <p>SKU:<span>1234567</span></p>
                <p v-if="singleProduct?.brand">
                  BRAND:<a href="#">{{ singleProduct?.brand?.name }}</a>
                </p>
              </div>
              <div class="details-meta">
                <p v-if="singleProduct?.category">
                  Category:<a href="#">{{ singleProduct?.category?.name }}</a>
                </p>
                <p v-if="singleProduct?.sub_category">
                  Sub Category:<a href="#">{{
                    singleProduct?.sub_category?.name
                  }}</a>
                </p>
              </div>
              <!-- Price Section start -->
              <!-- Product Variation Price Section start -->
              <span v-if="singleProduct?.variations?.data.length > 0">
                <h3 class="details-price" v-if="productVariationPrice == ''">
                  <span
                    >{{
                      $filters.currencySymbol(
                        singleProduct.variation_price_range.min_price
                      )
                    }}
                    -
                    {{
                      $filters.currencySymbol(
                        singleProduct.variation_price_range.max_price
                      )
                    }}</span
                  >
                </h3>
                <h3 class="details-price" v-else>
                  <span>{{
                    $filters.currencySymbol(productVariationPrice.sell_price)
                  }}</span>
                </h3>
              </span>
              <!-- Product Variation Price Section end -->
              <span v-else>
                <h3 class="details-price">
                  <del>{{ $filters.currencySymbol(singleProduct.mrp) }}</del>
                  <span>{{
                    $filters.currencySymbol(
                      mrpOrOfferPrice(
                        singleProduct.mrp,
                        singleProduct.offer_price
                      )
                    )
                  }}</span>
                  <a
                    class="discout_amount"
                    v-if="singleProduct.offer_price != 0"
                    >Save
                    {{ Math.round(singleProduct.mrp - singleProduct.offer_price) }} ৳</a
                  >
                </h3>
              </span>
              <!-- Price Section end -->

              <p
                class="details-desc mt-2"
                v-if="singleProduct.short_description"
                v-html="singleProduct.short_description"
              ></p>

              <!-- Product Variation Price Section start -->

              <span v-if="singleProduct?.variations?.data.length > 0">
                <div
                  class="details-list-group"
                  v-for="(attribute, key, index) in productVariations"
                  :key="index"
                >
                  <label class="details-list-title">{{ key }}:</label>
                  <ul class="details-tag-list">
                    <li
                      v-for="(attributeValue, indexAttributeValue) in attribute"
                      :key="indexAttributeValue"
                    >
                      <a
                        href="#"
                        :class="{
                          'is-active':
                            activeAttributes[index] ===
                            attributeValue.attribute_value_id,
                        }"
                        @click.prevent="
                          getProductVariation(
                            singleProduct.id,
                            attributeValue,
                            index
                          )
                        "
                      >
                        {{ attributeValue.attribute_value }}
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  class="variationRemoveBtn"
                  v-show="resetBtns"
                  @click.prevent="removeAllVariation()"
                >
                  X clear
                </button>
              </span>

              <!-- ...............................................

              <ProductVariation :productVariations="productVariations" :allVariations="singleProduct?.variations?.data" /> -->

              <!-- Product Variation Price Section end -->

              <div class="details-list-group">
                <label
                  class="details-list-title"
                  v-show="socialShares?.data?.length > 0"
                  >Share:</label
                >
                <ul class="details-share-list">
                  <li
                    v-for="(socialShare, index) in socialShares?.data"
                    :key="index"
                  >
                    <a
                      :href="socialURL(socialShare.title, socialShare.link)"
                      target="_blank"
                      title=""
                      ><i :class="socialIcons(socialShare.title)"></i
                    ></a>
                  </li>
                </ul>
              </div>

              <div class="details-list-group mt-3">
                <div
                  class="quantity"
                  :class="{
                    'quantity-disabled':
                      activeBtns === false &&
                      singleProduct?.variations?.data.length > 0,
                  }"
                >
                  <button
                    class="minus"
                    :disabled="
                      activeBtns === false &&
                      singleProduct?.variations?.data.length > 0
                    "
                    aria-label="Decrease"
                    @click.prevent="decrementCartItem"
                  >
                    &minus;
                  </button>
                  <input
                    type="number"
                    class="input-box"
                    min="1"
                    max="10"
                    v-model="quantityInput"
                  />
                  <button
                    class="plus"
                    :disabled="
                      activeBtns === false &&
                      singleProduct?.variations?.data.length > 0
                    "
                    aria-label="Increase"
                    @click.prevent="incrementCartItem"
                  >
                    &plus;
                  </button>
                </div>
              </div>

              <div class="details-add-group">
                <div
                  class="row"
                  v-if="singleProduct?.variations?.data.length > 0"
                >
                  <div class="col-md-6 mt-lg-0 mt-3">
                    <button
                      class="product-add"
                      :disabled="
                        activeBtns === false &&
                        singleProduct?.variations?.data.length > 0
                      "
                      :class="{ singleProductBtn: activeBtns === false }"
                      title="Add to Cart"
                      @click.prevent="
                        addToCart(
                          singleProduct,
                          quantityInput,
                          productVariationData,
                          productVariationPrice
                        )
                      "
                    >
                      <i
                        :class="
                          loading == singleProduct.id
                            ? 'fa-solid fa-spinner fa-spin'
                            : 'fas fa-shopping-basket'
                        "
                      ></i>
                      <span>add to cart</span>
                    </button>
                  </div>
                  <div class="col-md-6 mt-lg-0" v-if="activeBtns === false">
                    <a
                      class="product-add main-order-btn"
                      :class="{ 'singleProductBtn ': activeBtns === false }"
                      title="Add to Cart"
                    >
                      <i class="fas fa-cart-plus"></i>
                      <span>Buy Now</span>
                    </a>
                  </div>
                  <div class="col-md-6 mt-lg-0 mt-3" v-else>
                    <router-link
                      :to="{ name: 'checkoutPage' }"
                      class="product-add main-order-btn"
                      :class="{ 'singleProductBtn ': activeBtns === false }"
                      title="Add to Cart"
                      @click.prevent="
                        addToCart(
                          singleProduct,
                          quantityInput,
                          productVariationData,
                          productVariationPrice
                        )
                      "
                    >
                      <i class="fas fa-cart-plus"></i>
                      <span>Buy Now</span>
                    </router-link>
                  </div>
                </div>
                <div class="row" v-else>
                  <div class="col-md-6 mt-lg-0 mt-3">
                    <button
                      class="product-add"
                      title="Add to Cart"
                      @click.prevent="addToCart(singleProduct, quantityInput)"
                    >
                      <i
                        :class="
                          loading == singleProduct.id
                            ? 'fa-solid fa-spinner fa-spin'
                            : 'fas fa-shopping-basket'
                        "
                      ></i>
                      <span>add to cart</span>
                    </button>
                  </div>
                  <div class="col-md-6 mt-lg-0 mt-3">
                    <router-link
                      :to="{ name: 'checkoutPage' }"
                      class="product-add main-order-btn"
                      title="Add to Cart"
                      @click.prevent="addToCart(singleProduct, quantityInput)"
                    >
                      <i class="fas fa-cart-plus"></i>
                      <span>Buy Now</span>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="details-action-group">
                <a
                  :href="`https://wa.me/+88${whatsapp}?text=Product%20Details%0A%0AWebsite:%20${websiteUrl}/single-product/${
                    singleProduct?.id
                  }%0AProduct%20Name:%20${
                    singleProduct?.name
                  }%0AProduct%20Size:%20${sizeName}%0AOffer%20Price:%20${
                    productPrices
                      ? productPrices?.offer_price
                      : singleProduct?.offer_price
                  }৳%0ARegular%20Price:%20${
                    productPrices ? productPrices?.mrp : singleProduct?.mrp
                  }৳`"
                  class="product-add bg-success text-light"
                  target="_blank"
                >
                  <i class="fab fa-whatsapp"></i><span>হোয়াটসঅ্যাপ</span>
                </a>
                <a
                  :href="`https://m.me/${messengerId}?ref=Product%20Details%0A%0AWebsite:%20${websiteUrl}/single-product/${
                    singleProduct?.id
                  }%0AProduct%20Name:%20${
                    singleProduct?.name
                  }%0AProduct%20Size:%20${sizeName}%0AOffer%20Price:%20${
                    productPrices
                      ? productPrices?.offer_price
                      : singleProduct?.offer_price
                  }৳%0ARegular%20Price:%20${
                    productPrices ? productPrices?.mrp : singleProduct?.mrp
                  }৳`"
                  class="product-add bg-primary text-light"
                  target="_blank"
                >
                  <i class="fab fa-facebook-messenger"></i
                  ><span>মেসেঞ্জার</span>
                </a>
                <a
                  class="details-wish wish bg-warning text-dark"
                  :href="`tel:+88${phone}`"
                  title="Add Your Wishlist"
                >
                  <i class="fas fa-phone-alt"></i>
                  <span>Phone</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="inner-section mt-4" v-else>
      <div class="container">
        <SingleProductPageSkeleton />
      </div>
    </section>

    <!-- description feild  -->

    <section class="inner-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <ul class="nav nav-tabs">
              <li>
                <a href="#tab-desc" class="tab-link active" data-bs-toggle="tab"
                  >descriptions</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="tab-pane fade show active" id="tab-desc">
          <div class="row">
            <div class="col-lg-12">
              <div class="product-details-frame">
                <div class="tab-descrip">
                  <p v-html="singleProduct?.description"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Modal Start -->

    <div
      class="modal fade"
      id="product-view"
      style="display: none"
      aria-hidden="true"
      v-if="singleProduct.coupon"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <button class="modal-close icofont-close" data-bs-dismiss="modal">
            <i class="fas fa-times"></i>
          </button>
          <div class="product-view">
            <div class="row">
              <div class="col-md-6 col-lg-6">
                <div class="view-gallery">
                    <div class="product-imgs">
                      <div class="img-display">
                          <div class="img-showcase">
                              <img :src="backgroundImageUrl" />
                          </div>
                      </div>
                    </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-6">
                <div class="view-details">
                  <h3 class="view-name">
                      <a href="product-video.html">{{ singleProduct.name }}</a>
                  </h3>
                  <h3 class="view-price">
                    <span v-if="singleProduct.coupon.variations.length > 0">
                      <del>$38.00</del>
                      <span>$24.00<small>/per kilo</small></span>
                    </span>
                    <span v-else>
                      <span v-if="singleProduct.coupon.offer_price != 0">
                        <del>{{ $filters.currencySymbol(singleProduct.coupon.mrp) }}</del>
                        <span>{{ $filters.currencySymbol(singleProduct.coupon.offer_price) }}</span>
                      </span>
                      <span v-else>
                        <del>{{ $filters.currencySymbol(singleProduct.coupon.mrp) }}</del>
                      </span>
                    </span>
                  </h3>
                  <div class="view-add-group">
                      <div class="row">
                        <div class="col-lg-6 mt-2">
                          <button class="product-add" title="Add to Cart">
                            <i class="fas fa-shopping-basket"></i>
                            <span>add to cart</span>
                          </button>
                        </div>
                        <div class="col-lg-6 mt-2">
                          <button class="product-add" title="Add to Cart">
                            <i class="fas fa-shopping-basket"></i>
                            <span>Order Now</span>
                          </button>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Modal End  -->

    <!-- Sticky Footer Start -->
    <div class="main-footer-nav-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-5 col-md-4">
            <div class="footer-nav-left">
              <img :src="singleProduct?.image" alt="" />
              <p>{{ singleProduct?.name }}</p>
            </div>
          </div>
          <div class="col-lg-7 col-md-8 d-flex align-center main-nav-footer">
            <div class="footer-nav-right">
              <div
                class="price me-2"
                v-if="singleProduct?.variations?.data.length > 0"
              >
                <template v-if="!productPrices">
                  <span
                    v-for="(
                      productPrice, index
                    ) in singleProduct?.product_prices"
                    :key="index"
                  >
                    <span v-if="productPrice?.is_default == 1">
                      <del
                        class="text-danger"
                        style="font-size: 16px"
                        v-if="productPrice?.offer_price != 0"
                        >{{
                          $filters.currencySymbol(
                            productPrice?.mrp * quantityInput
                          )
                        }}</del
                      ><span class="text-danger">{{
                        $filters.currencySymbol(
                          productPrice?.offer_price
                            ? productPrice?.offer_price * quantityInput
                            : productPrice?.mrp * quantityInput
                        )
                      }}</span>
                    </span>
                  </span>
                </template>
                <template v-else>
                  <span v-html="$filters.productPrice(productPrices)"></span>
                </template>
              </div>
              <div class="price me-2" v-else>
                <h3 class="details-price">
                  <del>{{ $filters.currencySymbol(singleProduct.mrp) }}</del>
                  <span>{{
                    $filters.currencySymbol(
                      mrpOrOfferPrice(
                        singleProduct.mrp,
                        singleProduct.offer_price
                      )
                    )
                  }}</span>
                </h3>
              </div>
              <div
                class="quantity"
                :class="{
                  'quantity-disabled':
                    activeBtns === false &&
                    singleProduct?.variations?.data.length > 0,
                }"
              >
                <button
                  class="minus"
                  :disabled="
                    activeBtns === false &&
                    singleProduct?.variations?.data.length > 0
                  "
                  aria-label="Decrease"
                  @click.prevent="decrementCartItem"
                >
                  &minus;
                </button>
                <input
                  type="number"
                  class="input-box"
                  min="1"
                  max="10"
                  v-model="quantityInput"
                />
                <button
                  class="plus"
                  :disabled="
                    activeBtns === false &&
                    singleProduct?.variations?.data.length > 0
                  "
                  aria-label="Increase"
                  @click.prevent="incrementCartItem"
                >
                  &plus;
                </button>
              </div>
              <router-link
                :to="{ name: 'checkoutPage' }"
                @click.prevent="addToCart(singleProduct)"
                type="button"
                class="mx-2 btnColor"
                >অর্ডার করুন</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Sticky Footer End -->
  </div>
</template>

<style scoped>
@import "@/assets/css/product-details.css";

/* image zooming start*/
.image-container {
  position: relative;
  width: 400px;
  overflow: hidden;
  cursor: crosshair;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-lens {
    position: absolute;
    width: 250px;
    height: 250px;
    border: 2px solid #000;
    background-repeat: no-repeat;
    visibility: hidden;
    pointer-events: none;
    z-index: 10;
    border-radius: 10px;
}
/* image zooming end*/


/* MOdla css */
.view-price {
  margin-bottom: 0px !important;
}

.view-add-group {
  margin: 20px 0px 15px;
}

/* MOdla css */

/* Define the keyframes for the pulse animation */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Base button styling */

.main-order-btn {
  animation: pulse 1s infinite;
  margin: 0px;
  border: var(--primary);
}
.main-order-btn:hover {
  border: var(--primary);
}

.discout_amount {
  border: 1px solid var(--primary);
  margin-left: 20px;
  padding: 0px 8px;
  border-radius: 5px;
  background-color: var(--primary);
  color: var(--white) !important;
  font-size: 18px;
  margin-bottom: 5px;
  border-top: 2px solid var(--primary);
  border-left: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  border-right: 2px solid var(--primary);
  border-top-left-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
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

.image-gallery {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 5px;
}

.is-active {
  color: var(--white) !important;
  background: var(--primary) !important;
}

.singleProductBtn {
  background: rgb(199, 40, 40);
  color: white;
  border: 0;
  cursor: pointer;
  padding: 1em;
  opacity: 0.5;
  cursor: not-allowed;
}

.variationRemoveBtn {
  padding: 1px 10px;
  background-color: white;
  color: rgb(255, 0, 0);
  border-radius: 5px;
  border: 2px solid rgb(255, 0, 0);
}
.variationRemoveBtn:hover {
  background-color: rgb(255, 0, 0);
  color: white;
  border: 2px solid rgb(255, 0, 0);
}

.is-disabled {
  pointer-events: none;
  opacity: 0.5;
}

.quantity {
  display: flex;
  border: 2px solid var(--primary);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quantity-disabled {
  background: rgb(199, 40, 40);
  color: white;
  cursor: pointer;
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity button {
  background-color: var(--primary);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 20px;
  width: 30px;
  height: auto;
  text-align: center;
  transition: background-color 0.2s;
}

.quantity button:hover {
  background-color: rgb(172, 16, 16);
  color: white;
}

.input-box {
  width: 40px;
  text-align: center;
  border: none;
  padding: 8px 10px;
  font-size: 16px;
  outline: none;
}

/* Hide the number input spin buttons */
.input-box::-webkit-inner-spin-button,
.input-box::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-box[type="number"] {
  -moz-appearance: textfield;
}

/* sticky footer start */

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

.btnColor {
  animation: pulse 1s infinite;
  background-color: var(--primary);
  color: rgb(255, 255, 255);
  padding: 9px 32px;
  border-radius: 5px;
}

.main-footer-nav-section {
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0px -7px 16px -4px rgba(0, 0, 0, 0.69);
  -webkit-box-shadow: 8px -9px 24px -12px rgba(5, 19, 3, 0.69);
  -moz-box-shadow: 0px -7px 16px -4px rgba(0, 0, 0, 0.69);
  position: fixed;
  bottom: -115px;
  transition: all 0.5s ease;
  width: 100%;
  z-index: 9999;
}

.main-nav-footer {
  justify-content: end;
}

/* right */

.footer-nav-right {
  display: flex;
  justify-content: center;
  align-items: center;
}
.price {
  display: flex;
}

.price h3 {
  font-size: 22px;
  margin-right: 5px;
}

.footer-nav-cart {
  display: flex;
  align-items: center;
}
.footer-nav-cart input {
  /* width: 57px; */
  border: 1px solid #494b51;
  height: 40px;
  padding: 9px;
  margin-right: 10px;
}
.footer-nav-cart button {
  padding: 6px 9px;
  border: 1px solid var(--primary);
  background-color: var(--primary);
  color: var(--white);
  border-radius: 5px;
}

/* left */
.footer-nav-left {
  display: flex;
  align-items: center;
}
.footer-nav-left img {
  width: 50px;
  margin-right: 10px;
}
.footer-nav-left p {
  font-size: 20px;
  align-items: center;
  margin: 0;
}

input[type="number"]::-webkit-inner-spin-button {
  color: #8bc4a1;
}


@media (max-width: 991px) {
  .btnColor {
    padding: 10px 15px;
    white-space: nowrap !important;
  }

  .price h3 {
    font-size: 20px;
    white-space: nowrap;
  }

  .footer-nav-left p {
    font-size: 19px;
  }

  .details-price del {
    color: var(--red);
    margin-right: 12px;
  }

  .quantity {
    border: 1px solid var(--primary);
  }
}

@media (max-width: 768px) {
  .videoHW iframe {
    width: 519px !important;
    height: 400px !important;
  }

  .btnColor {
    padding: 10px 15px;
    white-space: nowrap !important;
  }

  .price h3 {
    font-size: 20px;
    white-space: nowrap;
  }

  .footer-nav-left p {
    font-size: 19px;
  }

  .details-price del {
    color: var(--red);
    margin-right: 12px;
  }

  .quantity {
    border: 1px solid var(--primary);
  }
}

@media (max-width: 767px) {
  .footer-nav-left {
    display: none;
  }

  .price {
    display: none;
  }

  .main-nav-footer {
    justify-content: center;
  }

  .quantity {
    margin-right: 15px;
  }
}

@media (max-width: 375px) {
  .discout_amount {
    margin-left: 0px;
  }
}
</style>
