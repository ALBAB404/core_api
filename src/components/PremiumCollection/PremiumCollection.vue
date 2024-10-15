<script setup></script>

<template>
  <div>
    <div class="container mt-4 mb-5">
      <div class="section-heading ">
        <h2>
          <span class="section-header-text">Premium Collection For You</span>
        </h2>
        <div class="heading-line"></div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="card main-section">
            <div class="img-section">
              <img src="https://anonleather.com/wp-content/uploads/2023/10/f4c4d7be-4798-4623-ba60-1baad59bb91a.jpg" class="card-img-top" alt="...">
            </div>
            <div class="card-body text-center premiumcollection-title">
              <h5>STEADY</h5>
              <p> A journey of a thousand miles begins with a fabulous pair of shoes.</p>
              <button>Shop Now</button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card main-section">
            <div class="img-section">
              <img src="https://anonleather.com/wp-content/uploads/2023/10/f4c4d7be-4798-4623-ba60-1baad59bb91a.jpg" class="card-img-top" alt="...">
            </div>
            <div class="card-body text-center premiumcollection-title">
              <h5>TRENDY</h5>
              <p> Favorite footwear for autumn days & cool evenings. Pair with our latest styles.</p>
              <button>Shop Now</button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card main-section">
            <div class="img-section">
              <img src="https://anonleather.com/wp-content/uploads/2023/10/f4c4d7be-4798-4623-ba60-1baad59bb91a.jpg" class="card-img-top" alt="...">
            </div>
            <div class="card-body text-center premiumcollection-title">
              <h5>SPORTY</h5>
              <p> Each pair of kicks is a new story. Get out there and tell yours.</p>
              <button>Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.img-section{
  overflow: hidden;
}
.img-section img{
  transition: 0.5s;
}
.img-section:hover img{
  transform: scale(1.2);
  transition: 0.5s;
}


.main-section{
  transition: 0.5s;
}

.main-section:hover{
  box-shadow: rgba(0, 0, 0, 0.16) 0px 14px 36px;
  transition: 0.5s ;
}

.premiumcollection-title h5{
  padding: 2px;
  width: 67%;
  margin: auto;
  transform: translateY(-50px);
  background-color: white;
  padding: 25px 20px;
  font-size: 40px;
  margin-bottom: -40px;
  color: var(--primary);
  font-weight: 400;
}
.premiumcollection-title button{
  color: var(--secondary-color);
  font-weight: 700;
}

.section-header-text {
  background-color: #f5f6f7;
  padding: 10px 20px;
  border: 3px solid var(--primary) !important;
  border-top-width: 7px !important;
  border-radius: 15px / 45px !important;
  box-shadow: #ccdbe8 3px 3px 15px inset, #ffffff80 -3px -3px 12px 1px inset;
  transition: all linear 0.2s;
}

.section-header-text:hover {
  background-color: #f5f6f7;
  border: 3px solid var(--secondary-color) !important;
  border-top-width: 7px !important;
  border-radius: 15px / 45px !important;
  transition: all linear 0.2s;
}

.heading-line {
  width: 100%;
  background-color: var(--primary);
  height: 2px;
  margin-top: -25px;
}
.heading-line:hover {
  background-color: var(--secondary-color);
}
</style>
