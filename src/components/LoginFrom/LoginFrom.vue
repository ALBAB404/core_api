<script setup>
// All Import File  Code Is Here......................................................................................................
import {ProductView, Modal} from "@/components"
import { ref } from "vue";

import { useAuth, useNotification, useModal } from "@/stores";
// validation error
import { Form, Field } from "vee-validate";
import * as yup from "yup";
// router pushing
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
const {backendErrors, user} = storeToRefs(useAuth())
// All Variable  Code Is Here.....................................................................................................
const modal = useModal();
const router = useRouter();
const route = useRoute();
const auth = useAuth();
const showPassword = ref(false);
const notify = useNotification();
const phone_number = ref(user.value?.phone_number);
// API Calling Code Is Here.....................................................................................................
const onSubmit = async (values, { setErrors, resetForm }) => {
    
    try {
        const res = await auth.login(values);
        if (res?.status == 200) {
        //   modal.toggleModal() 
          resetForm();
          if (route.path === "/login") {
              router.push({ name: route.path === "/login" ? "homePage" : "" });
              }else{
              router.push({ name: "checkoutPage" });
          }
          notify.Success("Login Successfully Done");
        //   modal.Modalclose() 
        } else {
            console.error("Unexpected response:", res);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};



// const otpSubmit = async (values, { setErrors, resetForm }) => {
//   console.log('dsfdsaf');
//     const fromData = {otp: values.otp, phone_number: phone_number.value }
//   try {
//     const res = await auth.otpVerify(fromData);
//     console.log(res);
//     if (res.status == 200) {
//       modal.Modalclose() 
//       if (route.path === "/login") {
//           router.push({ name: route.path === "/login" ? "homePage" : "" });
//         }else{
//           router.push({ name: "checkoutPage" });
//       }
//       notify.Success("Login Successfully Done");
//     } else {
//       console.error("Unexpected response:", res);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };



// All Function  Code Is Here.....................................................................................................

const schema = yup.object({
  phone_number: yup.string().required("Phone Feild Is Required"),
  password: yup.string().required("Password Feild Is Required"),
});

const schemaTwo = yup.object({
  otp: yup.string().required("OPT Number Feild Is Required"),
});

</script>

<template>
    <div class="user-form-card">
        <div class="user-form-title">
            <h2>welcome!</h2>
            <p>Use your credentials to access</p>
        </div>
        <div class="user-form-group">
            <Form
                class="user-form"
                @submit="onSubmit"
                :validation-schema="schema"
                v-slot="{ errors, isSubmitting }"
            >
                <div class="form-group">
                    <Field
                    name="phone_number"
                    type="text"
                    class="form-control"
                    placeholder="phone no"
                    :class="{ 'is-invalid': errors.phone_number }"
                    />
                    <span class="text-danger" v-if="errors.phone_number">{{ errors.phone_number }}</span>
                    <template  v-if="backendErrors.phone_number">
                            <span class="text-danger" v-show="backendErrors.phone_number">{{ backendErrors.phone_number[0] }}</span>
                    </template>
                </div>
                <div class="form-group">
                    <Field
                    name="password"
                    type="text"
                    class="form-control"
                    placeholder="Password"
                    :class="{ 'is-invalid': errors.password }"
                    />
                    <span class="text-danger" v-if="errors.password">{{ errors.password }}</span>
                    <template  v-if="backendErrors.password">
                            <span class="text-danger" v-show="backendErrors.password">{{ backendErrors.password[0] }}</span>
                    </template>
                </div>
                <div class="form-button">
                    <button type="submit" :disabled="isSubmitting">login <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1" ></span></button>
                    <!-- <p>Forgot your password?<a href="reset-password.html">reset here</a></p> -->
                </div>
            </Form>
        </div>
        
<ProductView />
        <!-- <Modal>            
            <section class="user-form-part">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-12 col-sm-10 col-md-12 col-lg-12 col-xl-10">
                            <div class="user-form-logo">
                                <router-link :to="{name: 'homePage'}"><img src="@/assets/images/maxfit.png" alt="logo" /></router-link>
                            </div>
                            <div class="user-form-card my-5">
                                <div class="user-form-group">
                                    <Form
                                        class="user-form"
                                        @submit="otpSubmit"
                                        :validation-schema="schemaTwo"
                                        v-slot="{ errors, isSubmitting }"
                                    >
                                    <div class="form-group">
                                        <Field
                                        name="otp"
                                        type="text"
                                        class="form-control"
                                        placeholder="OTP CODE"
                                        :class="{ 'is-invalid': errors.otp }"
                                        />
                                        <span class="text-danger" v-if="errors.otp">{{ errors.otp }}</span>
                                        <template  v-if="backendErrors.otp">
                                                <span class="text-danger" v-show="backendErrors.otp">{{ backendErrors.otp[0] }}</span>
                                        </template>
                                    </div>
                                        <div class="form-button">
                                            <button type="submit" :disabled="isSubmitting">
                                                SEND
                                                <span
                                                    v-show="isSubmitting"
                                                    class="spinner-border spinner-border-sm mr-1"
                                                ></span>
                                            </button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Modal> -->
    </div>
</template>

<style scoped>

</style>