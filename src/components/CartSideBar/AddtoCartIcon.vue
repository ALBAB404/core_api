<script setup>
import {useCart} from '@/stores'
import { storeToRefs } from 'pinia';
const cart = useCart();
const { cartItemCount, totalPrice } = storeToRefs(cart);
</script>

<template>
    <div>

        

        <div class="addtocart-main-section cart-btn">
            <div class="top-section text-center">
                <i class="fas fa-cart-arrow-down"></i>
                <p><span class="me-2">{{ cartItemCount }}</span><span>ITEMS</span></p>
                <div class="triangle triangle-5"></div>
            </div> 
            <div class="buttom-section text-center">
                <span>{{ $filters.currencySymbol(totalPrice) }}</span>
            </div> 
        </div>
    </div>
</template>

<style scoped>
.addtocart-main-section{
    position: absolute;
    position: fixed;
    top: 46%;
    right: 0%;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    z-index: 9;    
    cursor: pointer;
}

.top-section{
    background-color: rgb(255, 0, 0);
    padding: 8px;
    color: white;  

}
.top-section i{
    font-size: 20px;
    margin-top: 5px;
}
.top-section p{
    font-size: 15px;
}
.buttom-section{
    background-color: white;
    padding: 5px;
    color: black;
    font-weight: 600;
}

.buttom-section span{
    font-size: 14px;
}

.triangle {
    display: inline-block;
    margin: 0 5px;
    vertical-align: middle;
  }

  .triangle-5 {
    position: absolute;
    border-top: solid 10px rgb(255, 0, 0);
    border-left: solid 10px transparent;
    border-right: solid 10px transparent;
    top: 62%;
    left: 32%;
  }

</style>