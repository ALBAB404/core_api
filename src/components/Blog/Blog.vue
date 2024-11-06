<script setup>
/// All Import File  Code Is Here......................................................................................................
import { CartSideBar, MobileMenu } from '@/components';
import { ref, onMounted, computed } from "vue";
import { useBlog } from '@/stores'
import { storeToRefs } from 'pinia';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Pagination, Autoplay, Navigation } from "swiper/modules";

// All Variable  Code Is Here.....................................................................................................
const newSlide = ref([Navigation]);
const modules = ref([Pagination, Autoplay]);




const blog = useBlog();
// getBlogPost data start
const blogPostData = ref()
// getBlogPost data end

// getBlogPost data start
const getBlogPost = async (tagID = '', BlogPost = '') => {
    const res = await blog.getBlogPost(tagID, BlogPost); 
    if (res.success) {
        blogPostData.value = res.result.data
    }
}



// Define a computed property to format the date
const formattedDate = (createdAtString) => {
  // Convert ISO string to Date object
  const createdAtDate = new Date(createdAtString);
  
  // Check if the date is valid
  if (isNaN(createdAtDate.getTime())) {
    return ""; // Return empty string if date is invalid
  }
  
  return createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  });
};
// getBlogPost data end






onMounted(() => {
  getBlogPost();
  // blog.getBlogPost(); 
});

// API Calling Code Is Here.....................................................................................................

// All Function  Code Is Here.....................................................................................................
</script>

<template>
  <div>
  <section class="section blog-part" v-if="blogPostData?.length > 0">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="section-heading">
              {{ blogPostData }}
              <h2>Read our articles</h2>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="blog-slider slider-arrow">

              <swiper
                :slidesPerView="1"
                :sliderPerGroup="1"
                :loop="true"
                :autoplay="{
                  delay: 2000,
                }"
                :breakpoints="{ 320:{ slidesPerView:1,spaceBetweenSlides: 40  },480:{ slidesPerView:3,spaceBetweenSlides: 30  }, 790:{ slidesPerView:4,spaceBetweenSlides: 40 } }"
                :navigation="true"
                :modules="newSlide"
                class="mySwiper"
              >
                <swiper-slide v-for="(blogPost, index) in blogPostData" :key="index">
                 <div class="blog-card">
                <div class="blog-media">
                  <router-link :to="{ name: 'blogDetailsPage', params:{ postSlug: blogPost.slug} }" class="blog-img" href="#">
                      <img :src="blogPost.image" alt="blog">
                  </router-link>
                </div>
                <div class="blog-content">
                  <ul class="blog-meta">
                    <li>
                      <i class="fas fa-user"></i>
                      <span>admin</span>
                    </li>
                    <li>
                      <i class="fas fa-calendar-alt"></i>
                      <span>{{ formattedDate(blogPost.created_at) }}</span>
                    </li>
                  </ul>
                  <router-link :to="{ name: 'blogDetailsPage', params:{ postId: blogPost.id} }" class="blog-title">
                      <a href="blog-details.html">{{ blogPost.title }}</a>
                  </router-link>
                  <p class="blog-desc" v-html="$filters.textShort(blogPost.description, 100)"></p>
                  <div class="tags">
                    <ul>
                      <li v-for="(tag, index) in blogPost.tags" :key="index">{{ tag.name }}</li>
                    </ul>
                  </div>
                  <router-link :to="{ name: 'blogDetailsPage', params:{ postId: blogPost.id} }" class="blog-btn" href="#">
                      <span>read more</span>
                      <i class="icofont-arrow-right"></i>
                  </router-link>
                </div>
              </div>
                </swiper-slide>
              </swiper>  
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="section-btn-25">
              <router-link :to="{name : 'blogPage'}" class="btn btn-outline">
                <i class="fas fa-eye"></i>
                <span>view all blog</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped>

.tags {  
  box-sizing: border-box;
  margin-bottom: 10px;
}

.tags ul {
  display: flex;
  gap: 15px;
  flex-wrap: wrap; 
}

.tags ul li {
  border: 1px solid black;
  padding: 2px 5px;
  font-size: 14px;
  background-color: var(--secondary-color);
  color: var(--primary);
  border-radius: 5px;
  cursor: pointer;
  transition: .5s;
 }
.tags ul li:hover {
  background-color: var(--primary);
  color:  var(--secondary-color);
  transition: .5s;
}

.blog-part{
  margin-top: 22px !important;
}

.blog-slider {
  margin-top: -30px;
}

@media (max-width: 425px) {
  .blog-part{
    margin-top: -50px !important;
  }
  
}


</style>
