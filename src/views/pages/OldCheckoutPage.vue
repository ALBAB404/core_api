<script setup>
import { CartSideBar, MobileMenu, BannerPart, ProductView } from "@/components";
import axiosInstance from "@/services/axiosService.js";
import { useCart, useOrder, useAuth, useModal } from "@/stores";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
// validation error
import { Form, Field } from "vee-validate";
import * as yup from "yup";

// All Variable  Code Is Here.....................................................................................................
const modal =  useModal()
const auth = useAuth();
const { isOrder } = storeToRefs(auth);
const cart = useCart();
const { cartItem, totalPrice, campaignId } = storeToRefs(cart);
const order = useOrder();
const { storeOrder, backendErrors } = storeToRefs(order);

const name = ref(auth?.user?.user?.name);
const phoneNumber = ref(auth?.user?.user?.phone_number);
const district = ref("");
const address = ref("");
const payment_gateway_id = ref(1);
const delivery_gateway_id = ref();
const deliverCharge = ref();
const deliveryInfo = ref([]);
const payment_gateways = ref([]);

// coupon 
const showCouponForm  = ref(false);
const couponDiscountAmount  = ref();
const coupon = ref();
const couponErrorMessage = ref();
const couponId = ref();

const { emit } = defineEmits(['orderSubmitted']);

// from validation code start 

const schema = yup.object({
  name: yup.string().required("Name Feild Is Required"),
  phone: yup.string().required("Phone No Feild Is Required"),
  district: yup.string().required("District Feild Is Required"),
  address: yup.string().required("Address Feild Is Required"),
  delivery_gateway_id: yup.string().required("Delivery Gateway Feild Is Required"),
  payment_gateway_id: yup.string().required("Payment Gateway Feild Is Required"),

});

// from validation code end


const getDeliveryGateway = async () => {
  try {
    const res = await axiosInstance.get("/delivery-gateway");
    deliveryInfo.value = res.data.result;

    if (cartItem.value.some((item) => item.free_shipping === 1)) {
      delivery_gateway_id.value = 0;
      deliverCharge.value = 0;
    } else {
      delivery_gateway_id.value = res.data.result[0].id;
      deliverCharge.value = res.data.result[0].delivery_fee;
    }
  } catch (error) {
    console.log(error);
  }
};

const getDeliveryAmount = async () => {
  try {
    const res = await axiosInstance.get(
      `/delivery-gateway/price/${delivery_gateway_id.value}`
    );
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


const orderSubmited = async () => {
  await order.storeOrder({
      name: name.value,
      phoneNumber: phoneNumber.value,
      district: district.value,
      address: address.value,
      items: cartItem.value,
      // campaign_id: campaignId.value,
      coupon_id: couponId.value,
      totalPrice: totalPrice.value,
      payment_gateway_id: payment_gateway_id.value,
      delivery_gateway_id: delivery_gateway_id.value == 0 ? null : delivery_gateway_id.value,
    });
}

const placeOrder = async() => {
  if (Object.keys(auth.user).length > 0) {
    orderSubmited();
  }else{
    const res = await auth.login({phone_number: phoneNumber.value, name: name.value});
    if (res?.status == 200) {
      modal.toggleModal() 
    }
  }

};

const handleOrderSubmitted = () => {
  orderSubmited(); 
}

// coupon 

const toggleCouponForm = () => {
  showCouponForm.value = !showCouponForm.value;
}
const couponCalculate = async() => {
  const res = await axiosInstance.get(`/coupons/check?coupon_code=${coupon.value}&cart_total_amount=${totalPrice.value}`); 
  couponErrorMessage.value = res.data.message 
  couponDiscountAmount.value = res.data.result.discount_amount;
  couponId.value = res.data.result.coupon_id;
}

// has free shipping function 
const hasFreeShipping = () => {
      return cartItem.value.some(item => item.free_shipping === 1);
}


onMounted(() => {
  getDeliveryGateway();
  getPaymentGetway();
  modal.Modalclose()
});
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
    <BannerPart :title="'Checkout Page'" :sub_title="'Home'" />
    <!--=====================================
                    BANNER PART END
        =======================================-->

    <CartSideBar />

    <!--=====================================
                    CHECKOUT PART START
        =======================================-->
      <ProductView @orderSubmitted="handleOrderSubmitted"/>
    <!--=====================================
                    ProductView PART START
        =======================================-->
    <section class="inner-section checkout-part">
      <div class="container">
        <div class="row">
          <Form
                @submit="placeOrder"
                :validation-schema="schema"
                v-slot="{ errors, isSubmitting }"
            >
            <div class="col-lg-12">
              <div class="account-card">
                <div class="account-title">
                  <h4>Delivery Schedule</h4>
                </div>
                <div class="account-content">
                  <div class="row">
                    <div class="col-md-4">
                      <label for="">আপনার নাম লিখুন <span class="text-danger">*</span></label>
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
                    <div class="col-md-4">
                      <label for="">আপনার নাম্বার লিখুন <span class="text-danger">*</span></label>
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
                    <div class="col-md-4">
                      <label for="">শিপিং জেলা / শহর <span class="text-danger">*</span></label>
                      <Field
                        name="district"
                        type="text"
                        v-model="district"
                        class="form-control"
                        placeholder="এখানে লিখুন....."
                        :class="{ 'is-invalid': errors.district }"
                      />
                      <span class="text-danger" v-if="errors.district">{{ errors.district }}</span>
                    </div>
                    <div class="col-md-4 mt-2">
                      <label for="">আপনার বাসা নাম্বার সহ পরিপূর্ণ ঠিকানা লিখুন <span class="text-danger">*</span></label>
                      <Field
                        name="address"
                        type="text"
                        v-model="address"
                        class="form-control"
                        placeholder="এখানে লিখুন....."
                        :class="{ 'is-invalid': errors.address }"
                      />
                      <span class="text-danger" v-if="errors.address">{{ errors.address }}</span>
                    </div>


                    <div class="col-md-4 mt-2">
                      <label for="">শিপিং এরিয়া <span class="text-danger">*</span></label>

                        <Field
                          name="delivery_gateway_id"
                          v-model="delivery_gateway_id"
                          class="form-control"
                          @change="getDeliveryAmount"
                          :class="{ 'is-invalid': errors.delivery_gateway_id }"
                          as="select"
                        >
                            <option v-if="hasFreeShipping()">Free Shipping</option>
                            <option v-for="(delivery, index) in deliveryInfo" :key="index" :value="delivery.id">
                              {{ delivery.name }}
                            </option>
                        </Field>
                        <span class="text-danger" v-if="errors.delivery_gateway_id">{{ errors.delivery_gateway_id }}</span>
                    </div>

                    
                    <div class="col-md-4 mt-2">
                      <label for="">Payment Method <span class="text-danger">*</span></label>

                        <Field
                          name="payment_gateway_id"
                          v-model="payment_gateway_id"
                          class="form-control"
                          @change="getDeliveryAmount"
                          :class="{ 'is-invalid': errors.payment_gateway_id }"
                          as="select"
                        >
                            <option value="">Select Payment Option</option>
                            <option v-for="(payment_gateway, index) in payment_gateways" :key="index" :value="payment_gateway.id">
                              {{ payment_gateway.name }}
                            </option>
                        </Field>
                        <span class="text-danger" v-if="errors.payment_gateway_id">{{ errors.payment_gateway_id }}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-12">
              <div class="account-card">
                <div class="account-title">
                  <h4>Your order</h4>
                </div>
                <div class="account-content">
                  <div class="table-scroll">
                    <table class="table-list">
                      <thead>
                        <tr>
                          <th scope="col">Image</th>
                          <th scope="col">Name</th>
                          <th scope="col">Price</th>
                          <th scope="col">quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(product, index) in cartItem" :key="index">
                          <td class="table-image">
                            <img :src="product.image" alt="product" />
                          </td>
                          <td class="table-name">
                            <h6>{{ product.name }}</h6>
                          </td>
                          <td class="table-brand">
                            <h6>{{ (product.offer_price == 0 ? product.mrp : product.offer_price) * product.quantity }}</h6>
                          </td>
                          <td class="table-quantity">
                            <h6>{{ product.quantity }}</h6>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="chekout-coupon">
                      <button class="coupon-btn" @click.prevent="toggleCouponForm()">Do you have a coupon code?</button>
                      <form class="coupon-form" @submit.prevent="couponCalculate()" v-if="showCouponForm">
                          <input v-model="coupon" type="text" placeholder="Enter your coupon code">
                          <button  type="submit"><span>apply</span></button> 
                      </form>
                          <p class="text-danger">{{ couponErrorMessage }}</p>
                  </div>
                  <div class="checkout-charge">
                    <ul>
                      <li>
                        <span>Sub total</span>
                        <span>{{ totalPrice }}</span>
                      </li>
                      <li v-if="couponDiscountAmount">
                        <span>Coupon Discount</span>
                        <span>-{{ couponDiscountAmount }}</span>
                      </li>
                      <li>
                        <span>Delivery Charge</span>
                        <span>{{ deliverCharge }}</span>
                      </li>
                      <li>
                        <span>Total<small>(Incl. VAT)</small></span>
                        <span>{{(parseFloat(totalPrice) + parseFloat(deliverCharge)).toFixed(2) - (couponDiscountAmount ? parseFloat(couponDiscountAmount) : 0).toFixed(2) }}tk</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="checkout-proced">
              <button type="submit" :disabled="isSubmitting" class="btn btn-inline">
                  অর্ডার করুন
                  <span
                      v-show="isSubmitting"
                      class="spinner-border spinner-border-sm mr-1"
                  ></span>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </section>
    <!--=====================================
                    CHECKOUT PART END
        =======================================-->
  </div>
</template>


<style>
@import "@/assets/css/checkout.css";
</style>