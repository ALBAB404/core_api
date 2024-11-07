<script setup>
import { ref } from "vue";

const props = defineProps({
  landingPageData: {
    type: Object,
    default: {},
  },
});

// video url setup start

const getEmbedUrl = (watchUrl) => {
  const videoIdMatch = watchUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  const videoId = (videoIdMatch && videoIdMatch[1]) || "";

  return `https://www.youtube.com/embed/${videoId}`;
};

// video url setup end
</script>

<template>
  <div>
    <section class="container text-center" v-if="landingPageData">
      <div class="pd-b">
        <div class="top-title-b container">
          <p>{{ landingPageData.title }}</p>
        </div>
        <div class="videoHW">
          <iframe
            class="mt-5"
            :src="getEmbedUrl(landingPageData?.video_url)"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>

        <div class="border-a">
          <div class="seb-title">
            <span class="tx-c" >{{ landingPageData.sub_title }}</span
            >
          </div>
          <div class="list-section">
            <ul>
              <li v-for="(title, index) in landingPageData.titles" :key="index">
                <span class="check-mark">&#10003;</span>
                <span>{{ title.title }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="pd-c text-center">
          <a href="#" class="order-btn-d">অর্ডার করুন</a>
        </div>
      </div>
    </section>
  </div>
</template>


<style scoped>
.list-section ul {
  list-style: none;
}
.list-section span {
  font-weight: 800;
  margin-left: 10px;
}

/* video section start */
.videoHW iframe{
  width: 800px !important;
  height: 450px !important;
}
/* video section end */


@media (max-width: 1024px) {

  .videoHW iframe{
    width: 530px !important;
    height: 299px !important;
  }
  
}

@media (max-width: 768px) {
  .videoHW iframe {
    width: 519px !important;
    height: 400px !important;
  }

}



@media (max-width: 425px) {

  .videoHW iframe{
    width: 355px !important;
    height: 220px !important;
  }

}

@media (max-width: 375px) {

  .videoHW iframe{
    width: 305px !important;
    height: 170px !important;
  }

}

@media (max-width: 320px) {

  .videoHW iframe{
    width: 251px !important;
    height: 150px !important;
  }

}

</style>
