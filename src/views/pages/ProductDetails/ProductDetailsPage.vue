<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useProduct, useCart, useNotification, useShop } from "@/stores";
import { storeToRefs } from "pinia";
import { CartSideBar, MobileMenu, BannerPart, ProductCard, ProductView, CategorySideBar, NavSideBar } from "@/components";
import axiosInstance from "@/services/axiosService.js";
import { mrpOrOfferPrice, addToCart } from '@/composables'

const product       = useProduct();
const singleProduct = ref('');
const route         = useRoute();
const shop          = useShop();
const { products }  = storeToRefs(shop);
const cart          = useCart();
const { loading }   = storeToRefs(cart);
const notify        = useNotification();
const price         = ref();
const quantityInput = ref(1);
const categoryId    = ref([]);

// product variations start
const productVariations     = ref([]);
const attribute_id_1        = ref(null);
const attribute_id_2        = ref(null);
const attribute_id_3        = ref(null);
const attribute_value_id_1  = ref(null);
const attribute_value_id_2  = ref(null);
const attribute_value_id_3  = ref(null);
const productVariationData  = ref('');
const productVariationPrice = ref('');
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
// related product start
const relatedProducts = ref('');
// related product end

// image working start
  
    const thumbnailImage = ref(null);
    const activeImage    = ref(0);
    const images         = ref([]);

    const changeImage = (img, index) => {
        thumbnailImage.value = img;
        activeImage.value = index;
    };
// image working end

// get products start
  const productByid = async () => {
    singleProduct.value     = await product.productById(route.params.slug);
    productVariations.value = singleProduct.value?.variations?.attributes
  };
// get products end
// get products variation working start

   async function getProductVariation(productId,attributeValue, index) {
    
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
                "product_id"          : productId,
                "attribute_id_1"      : attribute_id_1.value || '',
                "attribute_value_id_1": attribute_value_id_1.value || '',
                "attribute_id_2"      : '',
                "attribute_value_id_2": attribute_value_id_2.value || '',
                "attribute_id_3"      : '',
                "attribute_value_id_3": attribute_value_id_3.value || ''
            };
       } 
       
       if (index === 1) {
            attribute_id_2.value = attributeValue.attribute_id;
            attribute_value_id_2.value = attributeValue.attribute_value_id
            productVariationData.value = {
                "product_id"          : productId,
                "attribute_id_1"      : '',
                "attribute_value_id_1": attribute_value_id_1.value || '',
                "attribute_id_2"      : attribute_id_2.value || '',
                "attribute_value_id_2": attribute_value_id_2.value || '',
                "attribute_id_3"      : '',
                "attribute_value_id_3": attribute_value_id_3.value || ''
            };
       } 
       if (index === 2) {     
           attribute_id_3.value = attributeValue.attribute_id;
           attribute_value_id_3.value = attributeValue.attribute_value_id
           productVariationData.value = {
                "product_id"          : productId,
                "attribute_id_1"      : '',
                "attribute_value_id_1": attribute_value_id_1.value || '',
                "attribute_id_2"      : '',
                "attribute_value_id_2": attribute_value_id_2.value || '',
                "attribute_id_3"      : attribute_id_3.value || '',
                "attribute_value_id_3": attribute_value_id_3.value || ''
            };
       } 
       

       const variations =  await product.productVariations(productVariationData.value); 

       productVariations.value =  variations.attributes;
             
       

       // price jodi backend theke dubble na hoy eitar code start 
       
       if ((Object.keys(productVariations.value).length == 1) && (attribute_value_id_1.value != null)) {
          productVariationPrice.value = variations.variation_price[0];
          activeBtns.value            = true;
       }
       if ((Object.keys(productVariations.value).length == 2) && (attribute_value_id_2.value != null && attribute_value_id_1.value != null)) {
          productVariationPrice.value = variations.variation_price[0];
          activeBtns.value            = true;
       }
       if ((Object.keys(productVariations.value).length == 3) && (attribute_value_id_3.value != null && attribute_value_id_2.value != null && attribute_value_id_1.value != null)) {
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
        productVariationData.value = '';
        
        // Reset the product variation price
        productVariationPrice.value = '';
        
        // Reset the active buttons state
        activeBtns.value = false;
        
        // Reset the active attributes
        activeAttributes.value = {
            0: [],
            1: [],
            2: [],
        };

        productVariations.value = singleProduct.value?.variations?.attributes

        resetBtns.value =false;

    };

// get products variation working end

    const incrementCartItem = () => {        
        quantityInput.value = parseInt(quantityInput.value) + 1;
        // if (sizeId.value !== null) {
        // }
    };
    const decrementCartItem = () => {
        if (quantityInput.value != 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    };

    
    onMounted(() => {
        productByid();
        let imageZoom = document.getElementById('imageZoom');
            imageZoom.addEventListener('mousemove', (event) => {
                imageZoom.style.setProperty('--display', 'block');
                let pointer = {
                    x:  (event.offsetX * 100) / imageZoom.offsetWidth,
                    y:  (event.offsetY * 100) / imageZoom.offsetHeight
                }
                imageZoom.style.setProperty('--zoom-x', pointer.x + '%');
                imageZoom.style.setProperty('--zoom-y', pointer.y + '%');
            })
            imageZoom.addEventListener('mouseout', () => {
                imageZoom.style.setProperty('--display', 'none');
            })

       
    })

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

    <section class="inner-section mt-5">
      <div class="container">
          <div class="row">
              <div class="col-lg-6">
                  <div class="details-gallery">
                      <div class="details-label-group">
                          <label class="details-label new" v-if="singleProduct.type">{{ singleProduct.type }}</label>
                          <label class="details-label off" v-if="singleProduct.offer_percent">-{{ singleProduct.offer_percent }}%</label>
                      </div>
                      <div class="product-imgs">
                        <div class="img-display">
                            <!-- <div class="img-showcase">
                                <img :src="singleProduct?.image" alt="shoe image" v-if="thumbnailImage == null" />
                                <img :src="thumbnailImage" alt="shoe image" v-else />
                            </div> -->
                            <div id="imageZoom" style="--url: url(/src/assets/images/product/04.jpg); --zoom-x: 0%; --zoom-y: 0%; --display: none ">
                                <img src="/src/assets/images/product/04.jpg" alt="">
                            </div>
                        </div>
                        <!-- <div class="img-select">
                            <div class="img-item" v-for="(img, index) in singleProduct?.images" :key="index" :class="[activeImage == index ? 'active-thumb' : '']" >
                                <img :src="img.image" alt="shoe image" @click.prevent="changeImage(img.image, index)" />
                            </div>
                        </div> -->
                        <div class="image-gallery">
                            <div class="img-item" v-for="(img, index) in singleProduct?.images" :key="index" :class="[activeImage == index ? 'active-thumb' : '']" >
                                <img :src="img.image" alt="shoe image" @click.prevent="changeImage(img.image, index)" />
                            </div>
                        </div>
                      </div>
                  </div>
              </div>
              <div class="col-lg-6">
                  <div class="details-content">
                      <h3 class="details-name"><a href="#">{{ singleProduct?.name }}</a></h3>
                      <div class="details-meta">
                          <p>SKU:<span>1234567</span></p>
                          <p v-if="singleProduct?.brand">BRAND:<a href="#">{{ singleProduct?.brand?.name }}</a></p>
                      </div>
                      <div class="details-meta">
                          <p v-if="singleProduct?.category">Category:<a href="#">{{ singleProduct?.category?.name }}</a></p>
                          <p v-if="singleProduct?.sub_category">Sub Category:<a href="#">{{ singleProduct?.sub_category?.name }}</a></p>
                      </div>
                      <div class="details-rating">
                          <i class="active icofont-star"></i>
                          <i class="active icofont-star"></i>
                          <i class="active icofont-star"></i>
                          <i class="active icofont-star"></i>
                          <i class="icofont-star"></i>
                          <a href="#">(3 reviews)</a>
                      </div>
                      <!-- Price Section Start -->

                      <!-- Product Variation Price Section start -->
                        <span v-if="singleProduct?.variations?.data.length > 0">
                            <h3 class="details-price" v-if="productVariationPrice == ''">
                                <span>{{  $filters.currencySymbol(singleProduct.variation_price_range.min_price) }} - {{  $filters.currencySymbol(singleProduct.variation_price_range.max_price) }}</span> 
                            </h3>
                            <h3 class="details-price" v-else>
                                <span>{{  $filters.currencySymbol(productVariationPrice.sell_price) }}</span> 
                            </h3>
                        </span>
                      <!-- Product Variation Price Section end -->
                        <span v-else>
                            <h3 class="details-price">
                                <del>{{  $filters.currencySymbol(singleProduct.mrp) }}</del>
                                <span>{{  $filters.currencySymbol(mrpOrOfferPrice(singleProduct.mrp, singleProduct.offer_price)) }}</span>
                            </h3>
                        </span>
                      <!-- Price Section end -->

                      <p class="details-desc" v-if="singleProduct.short_description" v-html="singleProduct.short_description"></p>

                      <!-- Product Variation Price Section start -->

                        <span v-if="singleProduct?.variations?.data.length > 0">
                            <div class="details-list-group" v-for="(attribute, key, index) in productVariations" :key="index">
                                <label class="details-list-title">{{ key }}:</label>
                                <ul class="details-tag-list">
                                    <li v-for="(attributeValue, indexAttributeValue) in attribute" :key="indexAttributeValue">
                                        <a href="#" 
                                        :class="{ 'is-active': activeAttributes[index] === attributeValue.attribute_value_id }"
                                        @click.prevent="getProductVariation(singleProduct.id, attributeValue, index)">
                                        {{ attributeValue.attribute_value }}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <button class="variationRemoveBtn" v-show="resetBtns" @click.prevent="removeAllVariation()">X clear</button>
                        </span>
                    

                      <!-- Product Variation Price Section end -->

                      <div class="details-list-group mt-3">
                          <label class="details-list-title">Share:</label>
                          <ul class="details-share-list">
                              <li><a href="#" class="icofont-facebook" title="Facebook"></a></li>
                              <li><a href="#" class="icofont-twitter" title="Twitter"></a></li>
                              <li><a href="#" class="icofont-linkedin" title="Linkedin"></a></li>
                              <li><a href="#" class="icofont-instagram" title="Instagram"></a></li>
                          </ul>
                      </div>
                      <div class="details-list-group mt-3">
                        <div class="quantity" :class="{'quantity-disabled' : (activeBtns === false) && (singleProduct?.variations?.data.length > 0)}">
                            <button class="minus" :disabled="(activeBtns === false) && (singleProduct?.variations?.data.length > 0)"  aria-label="Decrease" @click.prevent="decrementCartItem">&minus;</button>
                            <input type="number" class="input-box"  min="1" max="10" v-model="quantityInput">
                            <button class="plus" :disabled="(activeBtns === false) && (singleProduct?.variations?.data.length > 0)" aria-label="Increase" @click.prevent="incrementCartItem">&plus;</button>
                        </div>
                      </div>
                      <div class="details-add-group">
                        <div class="row" v-if="singleProduct?.variations?.data.length > 0">
                            <div class="col-md-6 mt-lg-0 mt-3">
                                <button class="product-add" :class="{'singleProductBtn' : activeBtns === false}" title="Add to Cart"   @click.prevent="addToCart(singleProduct, quantityInput, productVariationData, productVariationPrice)">
                                    <i :class="loading == singleProduct.id ? 'fa-solid fa-spinner fa-spin' : 'fas fa-shopping-basket'"></i>
                                    <span>add to cart</span>
                                </button>
                            </div>
                            <div class="col-md-6 mt-lg-0 mt-3">
                                <router-link :to="{ name: 'checkoutPage' }" class="product-add" :class="{'singleProductBtn' : activeBtns === false}" title="Add to Cart"   @click.prevent="addToCart(singleProduct, quantityInput, productVariationData, productVariationPrice)">
                                    <i class="fas fa-cart-plus"></i>
                                    <span>অর্ডার করুন</span>
                                </router-link>
                            </div>
                        </div>    
                        <div class="row" v-else>
                            <div class="col-md-6 mt-lg-0 mt-3">
                                <button class="product-add"  title="Add to Cart"   @click.prevent="addToCart(singleProduct, quantityInput)">
                                    <i :class="loading == singleProduct.id ? 'fa-solid fa-spinner fa-spin' : 'fas fa-shopping-basket'"></i>
                                    <span>add to cart</span>
                                </button>
                            </div>
                            <div class="col-md-6 mt-lg-0 mt-3">
                                <router-link :to="{ name: 'checkoutPage' }" class="product-add" title="Add to Cart" @click.prevent="addToCart(singleProduct, quantityInput)" >
                                    <i class="fas fa-cart-plus"></i>
                                    <span>অর্ডার করুন</span>
                                </router-link>
                            </div>
                        </div>    
                      </div>
                      <div class="details-action-group">
                          <a class="details-wish wish" href="#" title="Add Your Wishlist">
                              <i class="fas fa-phone-alt"></i>
                              <span>Phone</span>
                          </a>
                          <a class="details-compare" href="compare.html" title="Compare This Item">
                              <i class="fab fa-whatsapp"></i>
                              <span>Whats App</span>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </section>

  <!-- description feild  -->

  <section class="inner-section">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <ul class="nav nav-tabs">
                    <li><a href="#tab-desc" class="tab-link active" data-bs-toggle="tab">descriptions</a></li>
                    <li><a href="#tab-spec" class="tab-link" data-bs-toggle="tab">Specifications</a></li>
                    <li><a href="#tab-reve" class="tab-link" data-bs-toggle="tab">reviews (2)</a></li>
                </ul>
            </div>
        </div>
        <div class="tab-pane fade show active" id="tab-desc">
            <div class="row">
                <div class="col-lg-6">
                    <div class="product-details-frame">
                        <div class="tab-descrip">
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae delectus natus quasi aperiam. Nulla perspiciatis ullam ipsa, magni animi eligendi quis mollitia dolor omnis alias ut aspernatur est voluptatem illo totam iste consequatur vitae laborum ipsam facilis! Ipsa, voluptatum neque dolor facere autem maiores pariatur, eveniet veritatis vero iure obcaecati</p>
                            <ul>
                                <li>Lorem ipsum dolor sit amet consectetur adipisicing.</li>
                                <li>labore possimus architecto, saepe nobis ex mollitia</li>
                                <li>mollitia soluta magni placeat. Eaque sit praesentium</li>
                                <li>distinctio ab a exercitationem officiis labore possimus</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="product-details-frame">
                        <div class="tab-descrip">
                            <img src="@/assets/images/video.jpg" alt="video">
                            <a title="Product Video" href="https://youtu.be/9xzcVxSBbG8" class="venobox fas fa-play vbox-item" data-autoplay="true" data-vbtype="video"></a>
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
                                <tr>
                                    <th scope="row">Product code</th>
                                    <td>SKU: 101783</td>
                                </tr>
                                <tr>
                                    <th scope="row">Weight</th>
                                    <td>1kg, 2kg</td>
                                </tr>
                                <tr>
                                    <th scope="row">Styles</th>
                                    <td>@Girly</td>
                                </tr>
                                <tr>
                                    <th scope="row">Properties</th>
                                    <td>Short Dress</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="tab-reve">
            <div class="row">
                <div class="col-lg-12">
                    <div class="product-details-frame">
                        <ul class="review-list">
                            <li class="review-item">
                                <div class="review-media">
                                    <a class="review-avatar" href="#">
                                        <img src="@/assets/images/avatar/01.jpg" alt="review">
                                    </a>
                                    <h5 class="review-meta">
                                        <a href="#">miron mahmud</a>
                                        <span>June 02, 2020</span>
                                    </h5>
                                </div>
                                <ul class="review-rating">
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rate-blank"></li>
                                </ul>
                                <p class="review-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus hic amet qui velit, molestiae suscipit perferendis, autem doloremque blanditiis dolores nulla excepturi ea nobis!</p>
                                <form class="review-reply">
                                    <input type="text" placeholder="reply your thoughts">
                                    <button><i class="icofont-reply"></i>reply</button>
                                </form>
                                <ul class="review-reply-list">
                                    <li class="review-reply-item">
                                        <div class="review-media">
                                            <a class="review-avatar" href="#">
                                                <img src="@/assets/images/avatar/02.jpg" alt="review">
                                            </a>
                                            <h5 class="review-meta">
                                                <a href="#">labonno khan</a>
                                                <span><b>author -</b> June 02, 2020</span>
                                            </h5>
                                        </div>
                                        <p class="review-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus hic amet qui velit, molestiae suscipit perferendis, autem doloremque blanditiis dolores nulla excepturi ea nobis!</p>
                                        <form class="review-reply">
                                            <input type="text" placeholder="reply your thoughts">
                                            <button><i class="icofont-reply"></i>reply</button>
                                        </form>
                                    </li>
                                    <li class="review-reply-item">
                                        <div class="review-media">
                                            <a class="review-avatar" href="#">
                                                <img src="@/assets/images/avatar/03.jpg" alt="review">
                                            </a>
                                            <h5 class="review-meta">
                                                <a href="#">tahmina bonny</a>
                                                <span>June 02, 2020</span>
                                            </h5>
                                        </div>
                                        <p class="review-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus hic amet qui velit, molestiae suscipit perferendis, autem doloremque blanditiis dolores nulla excepturi ea nobis!</p>
                                        <form class="review-reply">
                                            <input type="text" placeholder="reply your thoughts">
                                            <button><i class="icofont-reply"></i>reply</button>
                                        </form>
                                    </li>
                                </ul>
                            </li>
                            <li class="review-item">
                                <div class="review-media">
                                    <a class="review-avatar" href="#">
                                        <img src="@/assets/images/avatar/04.jpg" alt="review">
                                    </a>
                                    <h5 class="review-meta">
                                        <a href="#">shipu shikdar</a>
                                        <span>June 02, 2020</span>
                                    </h5>
                                </div>
                                <ul class="review-rating">
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rating"></li>
                                    <li class="icofont-ui-rate-blank"></li>
                                </ul>
                                <p class="review-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus hic amet qui velit, molestiae suscipit perferendis, autem doloremque blanditiis dolores nulla excepturi ea nobis!</p>
                                <form class="review-reply">
                                    <input type="text" placeholder="reply your thoughts">
                                    <button><i class="icofont-reply"></i>reply</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                    <div class="product-details-frame">
                        <h3 class="frame-title">add your review</h3>
                        <form class="review-form">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="star-rating">
                                        <input type="radio" name="rating" id="star-1"><label for="star-1"></label>
                                        <input type="radio" name="rating" id="star-2"><label for="star-2"></label>
                                        <input type="radio" name="rating" id="star-3"><label for="star-3"></label>
                                        <input type="radio" name="rating" id="star-4"><label for="star-4"></label>
                                        <input type="radio" name="rating" id="star-5"><label for="star-5"></label>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <textarea class="form-control" placeholder="Describe"></textarea>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="form-group">
                                        <input type="text" class="form-control" placeholder="Name">
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="form-group">
                                        <input type="email" class="form-control" placeholder="Email">
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <button class="btn btn-inline">
                                        <i class="icofont-water-drop"></i>
                                        <span>drop your review</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
  </div>
</template>

<style scoped>
@import "@/assets/css/product-details.css";

#imageZoom{
    position: relative;
}
#imageZoom img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 0 0;
}
#imageZoom::after{
    display: var(--display);
    content: '';
    width: 100%;
    height: 100%;
    background-color: black;
    background-image: var(--url);
    background-size: 200%;
    background-position: var(--zoom-x) var(--zoom-y);
    position: absolute;
    left: 0;
    top: 0;
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

.image-gallery{
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: 5px;
}

.is-active{
    color: var(--white) !important;
    background: var(--primary) !important;
}

.singleProductBtn{
    background: rgb(199, 40, 40);
    color: white;
    border: 0;
    cursor: pointer;
    padding: 1em;
    opacity: 0.5;
    cursor: not-allowed;
}


.variationRemoveBtn{
    padding: 1px 10px;
    background-color: white;
    color: rgb(255, 0, 0);
    border-radius: 5px;
    border: 2px solid rgb(255, 0, 0);
}
.variationRemoveBtn:hover{
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

  .quantity-disabled{
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
  

</style>
