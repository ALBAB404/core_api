import { ref } from 'vue'
import { useCart, useNotification } from "@/stores";

export function addToCart(tProduct, quantity = 1) {
  console.log(tProduct);
  
    const cart           = useCart();
    const notify         = useNotification();  

    if(tProduct.variations.length > 0){
      // cart.addToCart({
      //   item_id      : tProduct.id,
      //   name         : tProduct.name,
      //   slug         : tProduct.slug,
      //   mrp          : sizeMrp,
      //   offer_price  : sizeOfferPrice,
      //   image        : tProduct.image,
      //   size_id      : sizeId.value,
      //   quantity     : quantity,
      //   free_shipping: tProduct.free_shipping,
      // });
      
    }else{
      cart.addToCart({
        product_id   : tProduct.id,
        name         : tProduct.name,
        slug         : tProduct.slug,
        mrp          : tProduct.mrp,
        offer_price  : tProduct.offer_price,
        image        : tProduct.image,
        size_id      : '',
        quantity     : quantity,
        free_shipping: tProduct.free_shipping,
      });
  
    }
  
     notify.Success(`${tProduct.name} Successfully Added Your Cart Item`);
  }