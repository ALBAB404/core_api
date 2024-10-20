<script setup>
import { CartSideBar, MobileMenu, BannerPart, ProductView } from "@/components";
import axiosInstance from "@/services/axiosService.js";
import { useCart, useOrder, useAuth, useModal } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
// validation error
import { Form, Field } from "vee-validate";
import * as yup from "yup";

const modal                                  = useModal()
const auth                                   = useAuth();
const { isOrder }                            = storeToRefs(auth);
const cart                                   = useCart();
const { cartItem, totalPrice, campaignId }   = storeToRefs(cart);
const order                                  = useOrder();
const { storeOrder, backendErrors, loading } = storeToRefs(order);
const isLoading                              = ref(false);
const isFreeShipping                         = ref(true);


const name                = ref(auth?.user?.user?.name);
const phoneNumber         = ref(auth?.user?.user?.phone_number);
const district            = ref("");
const address             = ref("");
const payment_gateway_id  = ref(1);
const delivery_gateway_id = ref(1);
const deliverCharge       = ref();
const deliveryInfo        = ref([]);
const payment_gateways    = ref([]);
const orderNote           = ref("");

// coupon 
const showCouponForm       = ref(false);
const couponDiscountAmount = ref();
const coupon               = ref('');
const couponErrorMessage   = ref();
const couponId             = ref();
const isOpen               = ref(false);

// Refs for the input fields
const nameFieldRef        = ref(null);
const phoneNumberFieldRef = ref(null);
const districtFieldRef    = ref(null);
const addressFieldRef     = ref(null);
const deliveryGatewayRef  = ref(null);
const paymentGatewayRef   = ref(null);

    const isOpenCoupon = () =>{
      isOpen.value = !isOpen.value;
    }

    const getDeliveryGateway = async () => {
      try {
        const res = await axiosInstance.get("/delivery-gateway");
        deliveryInfo.value = res.data.result;

        if (cartItem.value.some((item) => item.free_shipping === 1)) {
          delivery_gateway_id.value = 0;
          deliverCharge.value = 0;
        } else {
          delivery_gateway_id.value = res.data.result.data[0].id;
          deliverCharge.value = res.data.result.data[0].delivery_fee;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getDeliveryAmount = async () => {
      try {
        const res = await axiosInstance.get(`/delivery-gateway/price/${delivery_gateway_id.value}`);
        deliverCharge.value = res.data.result.delivery_fee;
      } catch (error) {
        console.log(error);
      }
    };

    const getPaymentGetway = async () => {
      try {
        const res = await axiosInstance.get(`/payment-gateway`);
        payment_gateways.value = res.data.result;
      } catch (error) { }
    };

// order work start here 

    const orderSubmited = async () => {
      await order.storeOrder({
          name               : name.value,
          phoneNumber        : phoneNumber.value,
          district           : district.value,
          address            : address.value,
          orderNote          : orderNote.value,
          items              : cartItem.value,
          coupon_id          : couponId.value,
          totalPrice         : totalPrice.value,
          payment_gateway_id : payment_gateway_id.value,
          delivery_gateway_id: delivery_gateway_id.value == 0 ? null    : delivery_gateway_id.value,
          deliverCharge      : deliverCharge.value ? deliverCharge.value: null,
          // campaign_id: campaignId.value,
        });
    }

    const placeOrder = async() => {
      isLoading.value = true;
      try {
        await orderSubmited();
        // Handle successful order submission
      } catch (error) {
        // Handle error
        console.error("Order submission failed:", error);
      } finally {
        isLoading.value = false; // Hide the preloader
      }


      // if (Object.keys(auth.user).length > 0) {
      // }else{
      //   const res = await auth.login({phone_number: phoneNumber.value, name: name.value});
      //   if (res?.status == 200) {
      //     modal.toggleModal() 
      //   }
      // }

    };



    const handleOrderSubmitted = () => {
      orderSubmited(); 
    }

// order work end here 

// Scroll to the first error field
    const scrollToErrorField = () => {
      if (!name.value) {
        nameFieldRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
        nameFieldRef.value?.focus();
        return;
      }
      if (!phoneNumber.value) {
        phoneNumberFieldRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
        phoneNumberFieldRef.value?.focus();
        return;
      }
      if (!district.value) {
        districtFieldRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
        districtFieldRef.value?.focus();
        return;
      }
      if (!address.value) {
        addressFieldRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
        addressFieldRef.value?.focus();
        return;
      }
      if (!delivery_gateway_id.value) {
        deliveryGatewayRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
        deliveryGatewayRef.value?.focus();
        return;
      }
      if (!payment_gateway_id.value) {
        paymentGatewayRef.value?.scrollIntoView({ behavior: "smooth", block: "center" });
        paymentGatewayRef.value?.focus();
        return;
      }
    };


// cart delete 

    const deleteCart = (index) => {
      cart.destroy(index);
    };

    const cartIncrement = (index) => {
      cart.increment(index);
    };

    const cartDecrement = (index) => {
      cart.decrement(index);
    };

// coupon 


    const couponCalculate = async() => {
      try {

          const res = await axiosInstance.get(`/coupons/check?coupon_code=${coupon.value}&cart_total_amount=${totalPrice.value}`);   
          if (res.status == 200) {
          couponDiscountAmount.value = res.data.result.discount_amount;
          couponId.value = res.data.result.coupon_id;
          isOpen.value = false

        }else{
          couponErrorMessage.value = res.data.message 
        }
      } catch (error) {
        couponErrorMessage.value = error.response.data.message      
      }
    }


// validation error
    const schema = yup.object({
      name               : yup.string().required("আপনার নাম IS REQUIRED"),
      phone              : yup.string().required("আপনার মোবাইল নাম্বার IS REQUIRED"),
      district           : yup.string().required("District Feild Is Required"),
      address            : yup.string().required("আপনার সম্পূর্ণ ঠিকানা IS REQUIRED"),
      delivery_gateway_id: yup.string().required("Delivery Gateway Feild Is Required"),
      payment_gateway_id : yup.string().required("Payment Gateway Feild Is Required"),
    });

// has free shipping function 
    const hasFreeShipping = () => {
      return cartItem.value.some(item => item.free_shipping === 1);
    }


// total price section hide and show 

    const showTotalPriceSection = () => {
      const hideAndShowTopSection    = document.querySelector('.hide_and_show_top_section');
      const hideAndShowButtomSection = document.querySelector('.hide_and_show_bottam_section');
      const scrollScreenSize         = window.screen.width;
      
      if (scrollScreenSize < 768) {            
        hideAndShowTopSection.classList.add('price_section_hide');
        hideAndShowButtomSection.classList.remove('price_section_show');
      }else{
        hideAndShowButtomSection.classList.add('price_section_hide');
        hideAndShowTopSection.classList.remove('price_section_show');
      }
    }

// total price section hide and show 


    onMounted(() => {
      getDeliveryGateway();
      getPaymentGetway();
      modal.Modalclose();
      showTotalPriceSection();
    });
</script>

<template>
  <div class="testing">
    <!-- pre loader -->
    <div v-if="isLoading" class="preloader">
      <div class="loader"></div>
    </div>
     

    <!-- pre loader -->
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
    <BannerPart :title="'Checkout Page'" :sub_title="'Home'" />
    <!--=====================================
                    BANNER PART END
        =======================================-->

    <CartSideBar />

    <!--=====================================
                    CHECKOUT PART START
        =======================================-->
        <ProductView @orderSubmitted="handleOrderSubmitted"/>
        
    <div class="container my-5 checkoutBorder">
        <div class="row">
            <div class="col-lg-8">
                <div class="table-responsive">
                    <table class="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">SL</th>
                        <th scope="col">Image</th>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, index) in cartItem" :key="index" class="checkoutTable">
                          <th scope="row">{{ 1 + index }}</th>
                          <td class="align-items-center"><a href="" class="img"><img :src="product.image" class="" alt=""></a></td>
                          <td class="text-wrap align-items-center">{{ product.name }}</td>
                          <td>{{ Math.round(product.offer_price == 0 ? product.mrp : product.offer_price) }}</td>
                          <td class="w-25">
                            <div class="checkout-page-action">
                                <button
                                  class=""
                                  title="Quantity Minus"
                                  @click.prevent="cartDecrement(index)"
                                >
                                  <i class="fas fa-minus"></i>
                                </button>
                                <input
                                  class=""
                                  title="Quantity Number"
                                  type="text"
                                  name="quantity"
                                  :disabled="product.quantity === 1 ? true : false"
                                  :value="product.quantity"
                                />
                                <button
                                  class=""
                                  title="Quantity Plus"
                                  @click.prevent="cartIncrement(index)"
                                >
                                  <i class="fas fa-plus"></i>
                                </button>
                            </div>
                          </td>
                          <td>{{ (Math.round(product.offer_price == 0 ? product.mrp : product.offer_price)) * product.quantity }}</td>
                          <td>
                            <button class="cart-delete" @click.prevent="deleteCart(index)">
                              <i class="far fa-trash-alt text-danger"></i>
                            </button>
                          </td>
                        </tr>
                    </tbody>
                    </table>
                    <div class="continue-shopping" v-if="isFreeShipping && cartItem.length > 1 || (cartItem.length > 0 && cartItem[0].quantity > 1)">
                      <router-link :to="{ name: 'shopPage'}"> <i class="fas fa-arrow-left"></i> Continue Shopping</router-link>
                    </div>
                    <div class="is-free-shipping" v-if="isFreeShipping && cartItem.length > 1 || (cartItem.length > 0 && cartItem[0].quantity > 1)">
                      <p>Add 1 more product to get free shipping!</p>
                    </div>
                    <div class="left my-3 p-0">
                      <div class="d-flex justify-content-between is-coupon" @click="isOpenCoupon">
                        <h6>Do you have any coupon ?</h6>
                        <button class="btn-danger btn-sm" ><i class="fas fa-chevron-down " :class="{'isRoted' : isOpen}"></i></button>
                      </div>
                      <div class="input-group p-3" :class="{'d-none' : !isOpen}">
                        <input type="text" class="form-control" placeholder="Apply Your Coupon Here" aria-label="Input group example" aria-describedby="btnGroupAddon" v-model="coupon">
                        <div class="input-group-text btn-danger" id="btnGroupAddon" @click.prevent="couponCalculate()">Apply</div>
                      </div>
                      <span v-if="couponErrorMessage" class="text-danger ps-3">{{ couponErrorMessage }}</span>
                  </div>
                  <div class="left my-3 hide_and_show_top_section">
                    <h5 class="text-wrap">Order Summery</h5>
                    <div class="d-flex justify-content-between my-2">
                      <p class="">Sub Total</p>
                      <p class="text-dark">{{ cart.totalPrice }} <span class="font-weight-bold">TK</span></p>
                    </div>
                    <div class="d-flex justify-content-between my-2">
                      <p class="">Delivary Charge</p>
                      <p class="text-dark">{{ deliverCharge }}<span class="font-weight-bold">TK</span></p>
                    </div>
                    <div class="d-flex justify-content-between my-2" v-if="couponDiscountAmount">
                      <p class="text-danger">Coupon Discount</p>
                      <p class="text-danger"> -({{ couponDiscountAmount ?  cart.totalPrice - couponDiscountAmount : 0 }})<span class="font-weight-bold">TK</span></p>
                    </div>
                    <div class="line"></div>
                    <div class="d-flex justify-content-between my-2">
                      <p class="text-dark">Total</p>
                      <p class="text-dark"><span class="flag-discount me-4">30% Save</span> {{ couponDiscountAmount ?  Number(deliverCharge) + couponDiscountAmount : cart.totalPrice + Number(deliverCharge) }}  <span class="font-weight-bold">TK</span></p>
                    </div>
                  </div>
                </div>
            </div>
            <div class="col-lg-4">
              <Form
                @submit.prevent="placeOrder"
                :validation-schema="schema"
                v-slot="{ errors, isSubmitting }"
              >
                <div class="left">
                    <h5 class="text-wrap text-center">অর্ডার কনফার্ম করতে আপনার নাম, মোবাইল নাম্বর, ঠিকানা লিখে অর্ডার করুন" বাটনে ক্লিক করুন।</h5>
                    <div class="form-group">
                        <label for="exampleInputEmail1" class="fw-bold">নামঃ</label>
                        <Field
                        name="name"
                        type="text"
                        v-model="name"
                        class="form-control"
                        placeholder="এখানে লিখুন....."
                        :class="{ 'is-invalid': errors.name }"
                      />
                      <span class="text-danger" v-if="errors.name">{{ errors.name }}</span>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1" class="fw-bold">মোবাইল নম্বরঃ</label>
                        <Field
                        name="phone"
                        type="text"
                        v-model="phoneNumber"
                        class="form-control"
                        placeholder="এখানে লিখুন....."
                        :class="{ 'is-invalid': errors.phone }"
                      />
                      <span class="text-danger" v-if="errors.phone">{{ errors.phone }}</span>
                      <span class="text-danger" v-if="backendErrors?.phone_number">{{ backendErrors.phone_number[0] }}</span>
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1" class="fw-bold">ঠিকানা:</label>
                        <Field
                        name="address"
                        type="text"
                        v-model="address"
                        class="form-control PlaceHolderColorChange"
                        placeholder="বাসা নং, রোড নং, থানা/উপজেলা, জেলা"
                        :class="{ 'is-invalid': errors.address }"
                      />
                      <span class="text-danger" v-if="errors.address">{{ errors.address }}</span>
                    </div>
                    <h6 class="delivary-charge text-center mb-3" >ডেলিভারি চার্জ</h6>
                    <div class="formRadioControl" v-for="(delivery, index) in deliveryInfo.data" :key="index" @click="delivery_gateway_id = delivery.id">
                      <input
                        class="form-check-input me-2"
                        type="radio"
                        :id="'deliveryGateway_' + index"
                        name="delivery_gateway_id"
                        :value="delivery.id"
                        v-model="delivery_gateway_id"
                        @change="getDeliveryAmount"
                      >
                      <label class="form-check-label" :for="'deliveryGateway_' + index">{{ delivery.name + ' - ' + Number(delivery.delivery_fee) }} টাকা </label>
                    </div>
                </div>
                <div class="secend-box p-2 bg-light mt-3">
                    <div class="">
                      <div class="right-text fw-bolder text-dark text-center"><i class="fa-solid fa-lock"></i>সম্পূর্ণ নিরাপদ পেমেন্ট</div>
                    </div>
                        <div class="formRadioControl" v-for="(payment_gateway, index) in payment_gateways.data" :key="index" @click="payment_gateway_id = payment_gateway.id">
                          <input
                            class="form-check-input me-2"
                            type="radio"
                            :id="'paymentGateway_' + index"
                            name="payment_gateway_id"
                            :value="payment_gateway.id"
                            v-model="payment_gateway_id"
                          >
                          <label class="form-check-label" :for="'paymentGateway_' + index">{{ payment_gateway.name }}</label>
                        </div>
                    </div>
                    <div class="left my-3 hide_and_show_bottam_section ">
                      <h5 class="text-wrap">Order Summery</h5>
                      <div class="d-flex justify-content-between my-2">
                        <p class="text-danger">Sub Total</p>
                        <p class="text-danger">{{ cart.totalPrice }} <span class="font-weight-bold">TK</span></p>
                      </div>
                      <div class="d-flex justify-content-between my-2">
                        <p class="text-danger">Delivary Charge</p>
                        <p class="text-danger">{{ deliverCharge }}<span class="font-weight-bold">TK</span></p>
                      </div>
                      <div class="d-flex justify-content-between my-2" v-if="couponDiscountAmount">
                        <p class="text-danger">Coupon Discount</p>
                        <p class="text-danger"> -({{ couponDiscountAmount ?  cart.totalPrice - couponDiscountAmount : 0 }})<span class="font-weight-bold">TK</span></p>
                      </div>
                      <div class="line"></div>
                      <div class="d-flex justify-content-between my-2">
                        <p class="text-danger">Total</p>
                        <p class="text-danger"><span class="flag-discount me-4">30% Save</span> {{ couponDiscountAmount ?  Number(deliverCharge) + couponDiscountAmount : cart.totalPrice + Number(deliverCharge) }}  <span class="font-weight-bold">TK</span></p>
                      </div>
                    </div>
                    <div class="text-note mt-3">
                      <p class="">প্রয়োজনীয় কোনো তথ্য দিতে এই এখানে লিখুনঃ </p>
                        <textarea class="p-2" name="" id="" cols="35" rows="5" placeholder="দয়া করে আপনার অর্ডারের জন্য যে কোনও বিশেষ নির্দেশিকা বা পছন্দ দিন এখানে বলতে পারেন ।" v-model="orderNote"></textarea>
                    </div>
                    <div v-if="isLoading" class="preloader"></div>
                  <button type="submit"  class="text-center orderBTN mt-3 w-100" @click="placeOrder()">
                    <span v-if="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    <span v-else>Place Order</span>
                  </button>
              </Form>
            </div>
        </div>
    </div>


    <!--=====================================
                    CHECKOUT PART END
        =======================================-->
  </div>
</template>


<style>
@import "@/assets/css/checkout.css";

/* checkoutTable start*/
.checkoutTable th,
.checkoutTable td {
  text-align: center !important; /* Horizontal alignment */
  vertical-align: middle !important; /* Vertical alignment */
}
/* checkoutTable end*/


/* is free shipping start*/

.continue-shopping a{
  border: 2px solid var(--secondary-color);
  padding: 8px 20px;
  margin-bottom: 20px;
  color: var(--secondary-color);
  font-weight: 500;
  transition: .2s;
}

.continue-shopping a:hover{
  color: var(--black);
  border: 2px solid var(--black);
  transition: .2s;
}

.is-free-shipping{
  border: 2px solid var(--primary);
  border-radius: 5px;
  padding: 10px;
  text-align: center;
}
.is-free-shipping p{
  font-size: 20px;
  color: var(--red);
}
/* is free shipping end*/

/* pre loader start*/
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m:
    conic-gradient(#0000 10%, #000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite linear;
}

@keyframes l3 {
  to {
    transform: rotate(1turn)
  }
}

/* pre loader end*/

.price_section_show{
  display: block;
}
.price_section_hide{
  display: none;
}

.formRadioControl{
  border: 1px solid rgb(192, 192, 192);
  border-radius: 5px;
  padding: 5px 10px;
  margin: 10px 0;
}

.text-note textarea {
    border-color: var(--primary);
    border-radius: 5px;
    margin-top: 5px;
}

.form-control.PlaceHolderColorChange::placeholder {
    color: var(--black) !important;
}

/* Define the keyframes for the pulse animation */
@keyframes pulse {
  0% {
    transform: scale(0.2);
    opacity: 1;
  }
  50% {
    transform: scale(0.5);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.2);
    opacity: 1;
  }
}

/* Base button styling */

.orderBTN {
  background-color: var(--primary);
  border-top: 3px solid var(--primary);
  border-left: 3px solid var(--primary);
  border-bottom: 3px solid var(--primary);
  border-right: 3px solid var(--primary);
  color: #fff;
  padding: 10px;
  border-top-left-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
  transition: .3s ease-in-out;
  font-weight: 500;
  font-size: 23px;
  animation: pulse 1s infinite; 
}
.orderBTN:hover{
  background-color: var(--secondary-color);
  border-top: 3px solid var(--secondary-color);
  border-left: 3px solid var(--secondary-color);
  border-bottom: 3px solid var(--secondary-color);
  border-right: 3px solid var(--secondary-color);
  color: var(--white);
}

.img{
    width: 50px;
}
.img img{
    width: 100%;
    border-radius: 0% !important;
}

.left {
  border: 1px solid var(--primary);
  padding: 15px;
  border-top: 4px solid var(--primary) !important;
  border-left: 4px solid var(--primary) !important;
  border-bottom: 1px solid var(--primary) !important;
  border-right: 2px solid var(--primary) !important;
  border-top-left-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}

.delivary-charge {
    padding: 7px 0px;
    border: 1px solid black;
    color: var(--primary);
}
.left-text h5{
  font-weight: 800;
  font-size: 15px;
}

.line{
  border-bottom: 2px solid var(--primary);
}

.secend-box{
  box-shadow: 3px 5px 9px -3px rgba(0,0,0,0.7);
-webkit-box-shadow: 3px 5px 9px -3px rgba(0,0,0,0.7);
-moz-box-shadow: 3px 5px 9px -3px rgba(0,0,0,0.7);
padding: 15px;
border-top: 4px solid var(--primary) !important;
border-left: 4px solid var(--primary) !important;
border-bottom: 1px solid var(--primary) !important;
border-right: 2px solid var(--primary) !important;
border-top-left-radius: 20px !important;
border-bottom-right-radius: 20px !important;
border: 1px solid var(--primary) !important;
}

.right-text i {
  margin: 0px 5px;
  border: 1px solid var(--primary);
  padding: 5px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
}
.payment-text i {
  border: 1px solid var(--primary);
  padding: 2px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  font-size: 12px;
  margin-right: 6px;
}

.flag-discount {
    border-radius: 6px 0 0 6px;
    color: #fff;
    display: block;
    float: left;
    padding: 0px 5px;
    background: var(--primary);
    font-size: 15px;
    font-weight: 400;
    position: relative;
}
.flag-discount::before,
.flag-discount::after {
    content: "";
    position: absolute;
    left: 100%;
    width: 0;
    height: 0;
    border-style: solid;
    display: block;
}
.flag-discount::before {
    top: 0;
    border-width: 22px 15px 0 0;
    border-color: var(--primary) transparent transparent transparent;
}
.flag-discount::after {
    bottom: 0;
    border-width: 0 15px 22px 0;
    border-color: transparent transparent var(--primary) transparent;
}


/* input quantity start */


.checkout-page-action{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
}

.checkout-page-action button i {
  width: 35px;
  height: 35px;
  font-size: 14px;
  line-height: 35px;
  border-radius: 6px;
  text-align: center;
  display: inline-block;
  color: var(--text);
  background: var(--chalk);
  text-shadow: var(--primary-tshadow);
  transition: all linear .3s;
  -webkit-transition: all linear .3s;
  -moz-transition: all linear .3s;
  -ms-transition: all linear .3s;
  -o-transition: all linear .3s;
}

.checkout-page-action button i:hover {
  color: var(--white);
  background: var(--primary);
}

.checkout-page-action input {
  width: 17% !important;
  font-size: 15px;
  margin: 0px 5px;
  padding: 6px 0px;
  border-radius: 6px;
  text-align: center;
  color: var(--white);
  background: var(--primary);
  text-shadow: var(--primary-tshadow);
}

/* input quantity end */



.is-coupon{
  padding: 10px;
}
.isRoted{
  transform: rotate(180deg);
  transition: all 0.5s;
}
.fa-chevron-down{
  transition: all 0.5s;
}

#btnGroupAddon{
  cursor: pointer;
}

.checkoutBorder{
    padding: 20px;
    border: 1px solid var(--primary);
    border-top: 7px solid var(--primary);
    border-bottom: 7px solid var(--primary);
    border-radius: 15px;
}

</style>