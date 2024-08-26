import { createRouter, createWebHistory } from "vue-router";
import {
  HomePage,
  ShopPage,
  ProductDetailsPage,
  CheckoutPage,
  thankyou,
  AboutPage,
  ContactPage,
  FlashDealPage,
  FlashDealDetailsPage,
  campaignPage,
  campaignDetailsPage,
  BlogPage,
  BlogDetailsPage,
  Login,
  Registration,
  OtpLogin,
  OrderList,
  Profile,
  OldCheckoutPage,
  TermsConditions,
  PrivacyPolicy,
  ReturnRefund,
} from "@/views/pages";
import NProgress from "nprogress";
import {useAuth} from '@/stores'

const routes = [
  // Auth Pages
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Maxfit Food | Login", guest: true },
  },
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    meta: { title: "Maxfit Food | Registration", guest: true },
  },
  {
    path: "/OtpLogin",
    name: "OtpLogin",
    component: OtpLogin,
    meta: { title: "Maxfit Food | Otp-Code", guest: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "Maxfit Food | Profile", requiresAuth: true },
  },
  {
    path: "/order-list",
    name: "OrderList",
    component: OrderList,
    meta: { title: "Maxfit Food | OrderList", requiresAuth: true },
  },

  // Other pages
  {
    path: "/",
    name: "homePage",
    component: HomePage,
    meta: { title: "Maxfit Food | Home Page" },
  },
  {
    path: "/shop-page",
    name: "shopPage",
    component: ShopPage,
    meta: { title: "Maxfit Food | Shop Page" },
  },
  {
    path: "/product-details/:slug?",
    name: "productDetailsPage",
    component: ProductDetailsPage,
    meta: { title: "Maxfit Food | Product Details" },
  },
  {
    path: "/checkout-page",
    name: "checkoutPage",
    component: CheckoutPage,
    meta: { title: "Maxfit Food | Checkout Page" },
  },
  {
    path: "/OldCheckoutPage",
    name: "OldCheckoutPage",
    component: OldCheckoutPage,
    meta: { title: "Maxfit Food | OldCheckoutPage Page" },
  },
  {
    path: "/your-order-submited",
    name: "thankYou.page",
    component: thankyou,
    meta: { title: "Maxfit Food | Thank You" },
  },
  {
    path: "/about-us",
    name: "aboutPage",
    component: AboutPage,
    meta: { title: "Maxfit Food | About US" },
  },
  {
    path: "/contact-us",
    name: "contactPage",
    component: ContactPage,
    meta: { title: "Maxfit Food | Contact US" },
  },
  {
    path: "/flash-deal",
    name: "flashDealPage",
    component: FlashDealPage,
    meta: { title: "Maxfit Food | Flash Deals" },
  },
  {
    path: "/flash-deal-details/:campaignId/:productId",
    name: "FlashDealDetailsPage",
    component: FlashDealDetailsPage,
    meta: { title: "Maxfit Food | Flash Deals Details" },
  },
  {
    path: "/campaign-page",
    name: "campaignPage",
    component: campaignPage,
    meta: { title: "Maxfit Food | Campaign Page" },
  },
  {
    path: "/campaign-details-page/:campaignId/:productId",
    name: "campaignDetailsPage",
    component: campaignDetailsPage,
    meta: { title: "Maxfit Food | Campaign Details Page" },
  },
  {
    path: "/blog-page",
    name: "blogPage",
    component: BlogPage,
    meta: { title: "Maxfit Food | Blog Page" },
  },
  {
    path: "/blog-details-page/:postId",
    name: "blogDetailsPage",
    component: BlogDetailsPage,
    meta: { title: "Maxfit Food | Blog Details Page" },
  },
  {
    path: "/terms-and-conditions",
    name: "TermsConditions",
    component: TermsConditions,
    meta: { title: "Glossit | Terms & Conditions Page" },
  },
  {
    path: "/Privacy-Policy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
    meta: { title: "Glossit | Privacy & Policy Page" },
  },
  {
    path: "/Privacy-Policy",
    name: "ReturnRefund",
    component: ReturnRefund,
    meta: { title: "Glossit | Return & Refund Page" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  //dynamiclly scroll behavior start
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
  //dynamiclly scroll behavior end
});

const DEFAULT_TITLE = "404";

router.beforeEach((to, from, next) => {
  // dynamiclly page title start
  document.title = to.meta.title || DEFAULT_TITLE;
  // dynamiclly page title end

  //dynamiclly scroll behavior start
  window.scrollTo(0, 0);
  //dynamiclly scroll behavior end

  // dynamiclly page progress bar start
  NProgress.start();
  // dynamiclly page progress bar end

  // dynamiclly Auth Checking Start
  const isLogin = useAuth();
  if(to.matched.some((record)=> record.meta.requiresAuth)){
    if (!isLogin.user.user) {
      next({name: 'Login'})  
    }else{
      next()
    }
  }else if(to.matched.some((record)=> record.meta.guest)){
    if (isLogin.user.user) {
      next({name: 'homePage'})  
    }else{
      next()
    }
  }else{
    next()
  }
// dynamiclly Auth Checking End
});

// dynamiclly page progress bar start
router.afterEach(() => {
  NProgress.done();
});
// dynamiclly page progress bar end


export default router;
