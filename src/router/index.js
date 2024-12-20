import { createRouter, createWebHistory } from "vue-router";
import {
  HomePage,
  ShopPage,
  ProductDetailsPage,
  CheckoutPage,
  thankyou,
  AboutPage,
  ContactPage,
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
  CampaignBanner,
  CampaignProductList,
  CampaignProductDetails,
  Test,
  LandingPage,
} from "@/views/pages";
import NProgress from "nprogress";
import {useAuth, useCart} from '@/stores'

let brandName = "Service Key";

const routes = [
  // Auth Pages
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: " Login", guest: true },
  },
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    meta: { title: " Registration", guest: true },
  },
  {
    path: "/OtpLogin",
    name: "OtpLogin",
    component: OtpLogin,
    meta: { title: " Otp-Code", guest: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: " Profile", requiresAuth: true },
  },
  {
    path: "/order-list",
    name: "OrderList",
    component: OrderList,
    meta: { title: " OrderList", requiresAuth: true },
  },

  // Other pages
  {
    path: "/",
    name: "homePage",
    component: HomePage,
    meta: { title: " Home Page" },
  },
  {
    path: "/shop-page",
    name: "shopPage",
    component: ShopPage,
    meta: { title: " Shop Page" },
  },
  {
    path: "/product-details/:slug?",
    name: "productDetailsPage",
    component: ProductDetailsPage,
    meta: { title: " Product Details" },
  },
  {
    path: "/checkout-page",
    name: "checkoutPage",
    component: CheckoutPage,
    meta: { title: " Checkout Page" },
  },
  {
    path: "/OldCheckoutPage",
    name: "OldCheckoutPage",
    component: OldCheckoutPage,
    meta: { title: " OldCheckoutPage Page" },
  },
  {
    path: "/your-order-submited",
    name: "thankYou.page",
    component: thankyou,
    meta: { title: " Thank You" },
  },
  {
    path: "/about-us",
    name: "aboutPage",
    component: AboutPage,
    meta: { title: " About US" },
  },
  {
    path: "/contact-us",
    name: "contactPage",
    component: ContactPage,
    meta: { title: " Contact US" },
  },
  {
    path: "/campaign",
    name: "CampaignBanner",
    component: CampaignBanner,
    meta: { title: " Campaign Page" },
  },
  {
    path: "/campaign-products/:campaignId?",
    name: "CampaignProductList",
    component: CampaignProductList,
    meta: { title: " Campaign products Page" },
  },
  {
    path: "/campaign-products-details/:campaign_slug?/:product_slug?",
    name: "CampaignProductDetails",
    component: CampaignProductDetails,
    meta: { title: "Campaign Products Details Page" },
  },  
  {
    path: "/blog-page",
    name: "blogPage",
    component: BlogPage,
    meta: { title: " Blog Page" },
  },
  {
    path: "/blog-details-page/:postSlug?",
    name: "blogDetailsPage",
    component: BlogDetailsPage,
    meta: { title: " Blog Details Page" },
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
  {
    path: "/test",
    name: "test",
    component: Test,
    meta: { title: "Glossit | Test Page" },
  },
  {
    path: "/:slug",
    name: "LandingPage",
    component: LandingPage,
    meta: { title: "Anon Leather | Landing Page" },
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

router.beforeEach(async (to, from, next) => {
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
