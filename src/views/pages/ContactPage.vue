
<script setup>
import {BannerPart} from '@/components'
import {useSetting, useContact, useNotification} from '@/stores'
import { ref, onMounted } from 'vue';


const setting         = useSetting();
const contact         = useContact();
const notify          = useNotification();
const email           = ref('')
const phone           = ref('')
const address         = ref('')
const userName        = ref('')
const userEmail       = ref('')
const userPhone       = ref('')
const userDescription = ref('')


const getSettingData = async() => {
  const vlaue1        = await setting.getData('footer_email')
        email.value   = vlaue1.data[0].value
  const vlaue2        = await setting.getData('footer_address')
        address.value = vlaue2.data[0].value
  const vlaue3        = await setting.getData('phone_number')
        phone.value   = vlaue3.data[0].value
}

const submitForm = async () => {
    const res = await contact.insertData({
        name       : userName.value,
        phone      : userEmail.value,
        email      : userPhone.value,
        description: userDescription.value,
    });

    if (res.data.success) {
        notify.Success("Your Information has been successfully submitted Thank you");
        userName.value = '';
        userEmail.value = '';
        userPhone.value = '';
        userDescription.value = '';
    }
        
}

onMounted(() => {
    getSettingData();
})

</script>

<template>
    <div>
        
        <BannerPart :title="'Contact Page'" />
        
        <section class="contact_us">
            <div class="container">
                <div class="row">
                    <div class="col-md-10 offset-md-1">
                        <div class="contact_inner">
                            <div class="row">
                                <div class="col-md-10">
                                    <div class="contact_form_inner">
                                        <div class="contact_field">
                                            <h3>Contatc Us</h3>
                                            <p>Feel Free to contact us any time. We will get back to you as soon as we can!.</p>
                                            <input type="text" class="form-control form-group" placeholder="Name"  v-model="userName"/>
                                            <input type="text" class="form-control form-group" placeholder="Phone"  v-model="userPhone"/>
                                            <input type="text" class="form-control form-group" placeholder="Email" v-model="userEmail" />
                                            <textarea class="form-control form-group" rows="10" placeholder="Message" v-model="userDescription"></textarea>
                                            <button class="contact_form_submit" @click.prevent="submitForm">Send</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="right_conatct_social_icon d-flex align-items-end">
                                    <div class="socil_item_inner d-flex">
                                        <li><a href="#"><i class="fab fa-facebook-square"></i></a></li>
                                        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                                        <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div class="contact_info_sec">
                                <h4>Contact Info</h4>
                                <div class="d-flex info_single align-items-center">
                                    <i class="fas fa-headset"></i>
                                    <span>+88{{ phone }}</span>
                                </div>
                                <div class="d-flex info_single align-items-center">
                                    <i class="fas fa-envelope-open-text"></i>
                                    <span>{{ email }}</span>
                                </div>
                                <div class="d-flex info_single align-items-center">
                                    <i class="fas fa-map-marked-alt"></i>
                                    <span>{{ address }}</span>
                                </div>
                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style>

    .right_conatct_social_icon{
        background: linear-gradient(to right, rgba(165, 36, 19, 0.8), rgba(170, 168, 27, 0.8));
    }
    .contact_us{
        background-color: var(--body);
        padding: 120px 0px;
    }

    .contact_inner{
        background-color: #fff;
        position: relative;
        box-shadow: 20px 22px 44px #cccc;
        border-radius: 25px;
    }
    .contact_field{
        padding: 60px 340px 90px 100px;
    }
    .right_conatct_social_icon{
        height: 100%;
    }

    .contact_field h3{
    color: #000;
        font-size: 40px;
        letter-spacing: 1px;
        font-weight: 600;
        margin-bottom: 10px
    }
    .contact_field p{
        color: #000;
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 1px;
        margin-bottom: 35px;
    }
    .contact_field .form-control{
        border-radius: 0px;
        border: none;
        border-bottom: 1px solid #ccc;
    }
    .contact_field .form-control:focus{
        box-shadow: none;
        outline: none;
        border-bottom: 2px solid #1325e8;
    }
    .contact_field .form-control::placeholder{
        font-size: 13px;
        letter-spacing: 1px;
    }

    .contact_info_sec {
        position: absolute;
        background-color: #2d2d2d;
        right: 1px;
        top: 18%;
        height: 340px;
        width: 340px;
        padding: 40px;
        border-radius: 25px 0 0 25px;
    }
    .contact_info_sec h4{
        letter-spacing: 1px;
        padding-bottom: 15px;
        color: #fff;
    }

    .info_single{
        margin: 30px 0px;
    }
    .info_single i{
        margin-right: 15px;
        color: #fff;
    }
    .info_single span{
        font-size: 14px;
        letter-spacing: 1px;
        color: #fff;
    }

    button.contact_form_submit {
        background: linear-gradient(to right, rgba(165, 36, 19, 0.8), rgba(170, 168, 27, 0.8));
        border: none;
        color: #fff;
        padding: 10px 15px;
        width: 100%;
        margin-top: 25px;
        border-radius: 35px;
        cursor: pointer;
        font-size: 14px;
        letter-spacing: 2px;
    }
    .socil_item_inner li{
        list-style: none;
    }
    .socil_item_inner li a{
        color: #fff;
        margin: 0px 15px;
        font-size: 14px;
    }
    .socil_item_inner{
        padding-bottom: 10px;
    }

    .map_sec{
        padding: 50px 0px;
    }
    .map_inner h4, .map_inner p{
        color: #000;
        text-align: center
    }
    .map_inner p{
        font-size: 13px;
    }
    .map_bind{
    margin-top: 50px;
        border-radius: 30px;
        overflow: hidden;
    }
    
</style>