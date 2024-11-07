<script setup>
import { ref } from "vue";
import axiosInstance from "@/services/axiosService.js";

const props = defineProps({
  landingPageData: {
    type: Object,
    default: {},
  },
  products: {
    type: Array,
    default: () => [],
  },
});

const quantities = ref(props.products.map(() => 1));
const name = ref();
const phoneNumber = ref();
const address = ref("");
const delivery_gateway_id = ref(2);
const payment_gateway_id = ref(1);
const selectedProductIndex = ref(null);
const selectedProduct = ref();
const deliveryCharge = ref(120);
const district = ref("");
const items = ref([]);
const backEndErrors = ref({});

const selectOption = (option) => {
  if (option == "outside") {
    deliveryCharge.value = 120;
  } else {
    deliveryCharge.value = 60;
  }
  delivery_gateway_id.value = option;
};

// increment ফাংশন যা নির্দিষ্ট প্রোডাক্টের quantity বাড়াবে
const increment = (index) => {
  quantities.value[index]++;
};

// decrement ফাংশন যা নির্দিষ্ট প্রোডাক্টের quantity কমাবে, তবে ১ এর নিচে কমবে না
const decrement = (index) => {
  if (quantities.value[index] > 1) {
    quantities.value[index]--;
  }
};

const selectProduct = (index, product) => {
  selectedProductIndex.value = index;
  selectedProduct.value = product;
  items.value = [{
    product_id: product.product.id,
    name: product.product.name,
    mrp: product.mrp,
    offer_price: product.offer_price,
    sell_price: product.sell_price,
    image: product.product.img_path,
    attribute_value_id_1: product.attribute_value_id_1,
    attribute_value_id_2: product.attribute_value_id_2,
    attribute_value_id_3: product.attribute_value_id_3,
    quantity: quantities.value[index],
    free_shipping: 0,
  }];
  console.log(items.value);
};

const storeOrder = async () => {
  try {
    const response = await axiosInstance.post("/orders", {
      customer_name: name.value,
      phone_number: phoneNumber.value,
      address_details: address.value,
      items: items.value,
      delivery_gateway_id: delivery_gateway_id.value,
      payment_gateway_id: payment_gateway_id.value,
      district: district.value,
      // coupon_id: coupon_id.value,
    });
    console.log(response);
    // if (response.status === 200) {

    // }
  } catch (error) {
    backEndErrors.value = error.response.data.errors;
  }
};
</script>

<template>
  <div>
    <section class="body-field" v-if="landingPageData">
      <div class="container pt-5 ct-title">
        <div class="border-sec">
          <div class="w-title">
            <div class="title-sec">
              <p>{{ landingPageData.title }}</p>
            </div>
          </div>
          
          <div><h6 class="fw-bold pt-4">সাইজ সিলেক্ট করুনঃ</h6></div>
          
          <div class="row pt-3">
            <div
              class="col-md-6 mb-4"
              v-for="(product, index) in products"
              :key="index"
              @click="selectProduct(index, product)"
              style="cursor: pointer"
            >
              <div class="card">
                <div class="demo-card d-flex gap-3">
                  <div>
                    <input
                      type="radio"
                      name="radios"
                      :checked="selectedProductIndex === index"
                    />
                    <img
                      :src="product.product.img_path"
                      alt=""
                      width="60px"
                      height="60px"
                      class="ms-2"
                    />
                  </div>
                  <div>
                    <span>{{ product.product.name }} (Size-5/39)</span>
                    <div class="d-flex gap-3 align-items-center">
                      <div class="wrapper">
                        <button
                          class="btn-pls btn--minus"
                          @click="decrement(index)"
                          type="button"
                          name="button"
                        >
                          -
                        </button>
                        <input
                          class="quantity"
                          type="text"
                          name="name"
                          :value="quantities[index]"
                          readonly
                        />
                        <button
                          class="btn-mns btn--plus"
                          @click="increment(index)"
                          type="button"
                          name="button"
                        >
                          +
                        </button>
                      </div>
                      <div>{{ product.sell_price }} ৳</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span class="text-danger" v-if="backEndErrors.items">{{ backEndErrors.items[0] }}</span>
          </div>
          <br /><br />
          <div class="row billing">
            <div class="col-md-6 mb-4">
              <span class="fw-bold">Billing details</span>
              <div>
                <div class="bill-dtl">
                  <form>
                    <div class="mb-3">
                      <label for="name" class="form-label"
                        >আপনার নাম লিখুন *</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder=" সম্পূর্ণ নাম লিখুন "
                        id="name"
                        aria-describedby="nameHelp"
                        v-model="name"
                      />
                      <span
                        class="text-danger"
                        v-if="backEndErrors.customer_name"
                        >{{ backEndErrors.customer_name[0] }}</span
                      >
                    </div>

                    <div class="mb-3">
                      <label for="mobile" class="form-label"
                        >মোবাইল নাম্বার *</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder=" মোবাইল নাম্বার "
                        id="mobile"
                        aria-describedby="mobileHelp"
                        v-model="phoneNumber"
                      />
                      <span
                        class="text-danger"
                        v-if="backEndErrors.phone_number"
                        >{{ backEndErrors.phone_number[0] }}</span
                      >
                    </div>

                    <div class="mb-3">
                      <label for="address" class="form-label"
                        >আপনার ঠিকানা *</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        placeholder="বাসা/থানা সহ ঠিকানা লিখুন"
                        id="address"
                        aria-describedby="addressHelp"
                        v-model="address"
                      />
                      <span
                        class="text-danger"
                        v-if="backEndErrors.address_details"
                        >{{ backEndErrors.address_details[0] }}</span
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="col-md-6 mb-4">
              <span class="fw-bold">Your order</span>
              <div>
                <div class="bill-dtl">
                  <div class="d-flex justify-content-between">
                    <span>Product</span>
                    <span>Subtotal</span>
                  </div>
                  <hr class="dash" />

                  <div class="select-item" v-if="selectedProduct">
                    <img
                      src="@/assets/images/cr-a.png"
                      alt=""
                      width="50px"
                      height="50px"
                    />
                    <p>{{ selectedProduct?.product?.name }} (Size-5/39)</p>
                    <label>{{ selectedProduct?.sell_price }} ৳</label>
                  </div>
                  <hr class="dash" v-if="selectedProduct" />

                  <div
                    class="d-flex justify-content-between"
                    v-if="selectedProduct?.sell_price"
                  >
                    <span>Subtotal</span>
                    <span>{{ selectedProduct?.sell_price }} ৳</span>
                  </div>
                  <br />

                  <hr class="dash" v-if="selectedProduct?.sell_price" />

                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div>Shipping</div>
                    <div>
                      <div
                        class="form-check"
                        @click="selectOption('outside')"
                        :class="{ selected: delivery_gateway_id === 1 }"
                        style="cursor: pointer"
                      >
                        <input
                          type="radio"
                          name="radios-op"
                          :checked="delivery_gateway_id === 'outside'"
                        />
                        <label class="form-check-label ms-2"
                          >Outside Dhaka (120)৳</label
                        >
                      </div>

                      <div
                        class="form-check"
                        @click="selectOption('inside')"
                        :class="{ selected: delivery_gateway_id === 2 }"
                        style="cursor: pointer"
                      >
                        <input
                          type="radio"
                          name="radios-op"
                          :checked="delivery_gateway_id === 'inside'"
                        />
                        <label class="form-check-label ms-2"
                          >Inside Dhaka (60)৳</label
                        >
                      </div>
                    </div>
                  </div>

                  <hr class="dash" />

                  <div class="d-flex justify-content-between">
                    <span>Total</span>
                    <span v-if="selectedProduct?.sell_price"
                      >{{
                        Math.round(selectedProduct?.sell_price) + deliveryCharge
                      }}
                      ৳</span
                    >
                    <span v-else>00 ৳</span>
                  </div>
                  <br />
                  <hr />

                  <!-- <div>
                    <form id="couponForm">
                      <div id="slider" class="collapsed">
                        <input
                          class="txt-input"
                          type="button"
                          id="toggle"
                          value="Have a coupon ?"
                        />
                        <input
                          class="aft-input"
                          type="text"
                          id="input"
                          tabindex="-1"
                          placeholder="Coupon Number"
                          size="8"
                        />
                        <input
                          class="copn-submt"
                          type="submit"
                          id="ok"
                          tabindex="-1"
                          value="Submit"
                        />
                      </div>
                    </form>
                  </div> -->

                  <hr />
                  <span>Cash on delivery</span><br />
                  <div>
                    <div class="triangle triangle-top-left-2"></div>
                    <div class="pop">Pay with cash upon delivery.</div>
                  </div>
                  <div class="d-grid pt-5">
                    <button
                      class="ordr-submt"
                      type="button"
                      @click="storeOrder"
                    >
                      অর্ডার করুন 1,150.00৳
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* আপনার প্রয়োজনীয় CSS কোড এখানে লিখুন */
</style>
