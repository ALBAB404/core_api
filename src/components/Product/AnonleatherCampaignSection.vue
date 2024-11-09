<script setup>
import { onMounted } from "vue";

onMounted(() => {
  //01000001 01010011
  // helper functions
  const PI2 = Math.PI * 2;
  const random = (min, max) => (Math.random() * (max - min + 1) + min) | 0;
  const timestamp = (_) => new Date().getTime();

  // container
  class Birthday {
    constructor() {
      this.resize();

      // create a lovely place to store the firework
      this.fireworks = [];
      this.counter = 0;
    }

    resize() {
      this.width = canvas.width = window.innerWidth;
      let center = (this.width / 2) | 0;
      this.spawnA = (center - center / 4) | 0;
      this.spawnB = (center + center / 4) | 0;

      this.height = canvas.height = window.innerHeight;
      this.spawnC = this.height * 0.1;
      this.spawnD = this.height * 0.5;
    }

    onClick(evt) {
      let x = evt.clientX || (evt.touches && evt.touches[0].pageX);
      let y = evt.clientY || (evt.touches && evt.touches[0].pageY);

      let count = random(3, 10);
      for (let i = 0; i < count; i++)
        this.fireworks.push(
          new Firework(
            random(this.spawnA, this.spawnB),
            this.height,
            x,
            y,
            random(0, 260),
            random(30, 110)
          )
        );

      this.counter = -1;
    }

    update(delta) {
      ctx.globalCompositeOperation = "hard-light";
      ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.globalCompositeOperation = "lighter";
      for (let firework of this.fireworks) firework.update(delta);

      // if enough time passed... create new new firework
      this.counter += delta * 3; // each second
      if (this.counter >= 1) {
        this.fireworks.push(
          new Firework(
            random(this.spawnA, this.spawnB),
            this.height,
            random(0, this.width),
            random(this.spawnC, this.spawnD),
            random(0, 360),
            random(30, 110)
          )
        );
        this.counter = 0;
      }

      // remove the dead fireworks
      if (this.fireworks.length > 1000)
        this.fireworks = this.fireworks.filter((firework) => !firework.dead);
    }
  }

  class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
      this.dead = false;
      this.offsprings = offsprings;

      this.x = x;
      this.y = y;
      this.targetX = targetX;
      this.targetY = targetY;

      this.shade = shade;
      this.history = [];
    }
    update(delta) {
      if (this.dead) return;

      let xDiff = this.targetX - this.x;
      let yDiff = this.targetY - this.y;
      if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
        // is still moving
        this.x += xDiff * 2 * delta;
        this.y += yDiff * 2 * delta;

        this.history.push({
          x: this.x,
          y: this.y,
        });

        if (this.history.length > 20) this.history.shift();
      } else {
        if (this.offsprings && !this.madeChilds) {
          let babies = this.offsprings / 2;
          for (let i = 0; i < babies; i++) {
            let targetX =
              (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
            let targetY =
              (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;

            birthday.fireworks.push(
              new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
            );
          }
        }
        this.madeChilds = true;
        this.history.shift();
      }

      if (this.history.length === 0) this.dead = true;
      else if (this.offsprings) {
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i];
          ctx.beginPath();
          ctx.fillStyle = "hsl(" + this.shade + ",100%," + i + "%)";
          ctx.arc(point.x, point.y, 1, 0, PI2, false);
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.fillStyle = "hsl(" + this.shade + ",100%,50%)";
        ctx.arc(this.x, this.y, 1, 0, PI2, false);
        ctx.fill();
      }
    }
  }

  let canvas = document.getElementById("birthday");
  let ctx = canvas.getContext("2d");
  //01000001 01010011
  let then = timestamp();

  let birthday = new Birthday();
  window.onresize = () => birthday.resize();
  document.onclick = (evt) => birthday.onClick(evt);
  document.ontouchstart = (evt) => birthday.onClick(evt);
  (function loop() {
    requestAnimationFrame(loop);

    let now = timestamp();
    let delta = now - then;

    then = now;
    birthday.update(delta / 1000);
  })();
});
</script>

<template>
  <div>
    <section class="section deals-part campaign-homepage-section">
      <div class="container">
        <canvas id="birthday"></canvas>
        <div class="row pt-4">
          <div class="col-lg-4">
            <div class="section-heading">
              <h2 class="text-light">best deals on items</h2>
            </div>
          </div>
          <div class="col-lg-1"></div>
          <div class="col-lg-7 ps-3">
            <div class="countdown deals-clock" data-countdown="2021/12/31">
              <span class="countdown-time"
                ><span>00</span><small>days</small></span
              >
              <span class="countdown-time"
                ><span>00</span><small>hours</small></span
              >
              <span class="countdown-time"
                ><span>00</span><small>minutes</small></span
              >
              <span class="countdown-time"
                ><span>00</span><small>seconds</small></span
              >
            </div>
          </div>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4">
          <div class="col">
            <div class="product-card">
              <div class="product-media">
                <div class="product-label">
                  <label class="label-text off">-10%</label>
                </div>
                <button class="product-wish wish">
                  <i class="fas fa-heart"></i>
                </button>
                <a class="product-image" href="product-video.html">
                  <img src="@/assets/images/default.png" alt="product" />
                </a>
                <div class="product-widget">
                  <a
                    title="Product Compare"
                    href="compare.html"
                    class="fas fa-random"
                  ></a>
                  <a
                    title="Product Video"
                    href="https://youtu.be/9xzcVxSBbG8"
                    class="venobox fas fa-play vbox-item"
                    data-autoplay="true"
                    data-vbtype="video"
                  ></a>
                  <a
                    title="Product View"
                    href="#"
                    class="fas fa-eye"
                    data-bs-toggle="modal"
                    data-bs-target="#product-view"
                  ></a>
                </div>
              </div>
              <div class="product-content">
                <div class="product-rating">
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="icofont-star"></i>
                  <a href="product-video.html">(3)</a>
                </div>
                <h6 class="product-name">
                  <a href="product-video.html">fresh green chilis</a>
                </h6>
                <h6 class="product-price">
                  <del>$34</del>
                  <span>$28<small>/piece</small></span>
                </h6>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="product-card">
              <div class="product-media">
                <div class="product-label">
                  <label class="label-text off">-10%</label>
                </div>
                <button class="product-wish wish">
                  <i class="fas fa-heart"></i>
                </button>
                <a class="product-image" href="product-video.html">
                  <img src="@/assets/images/default.png" alt="product" />
                </a>
                <div class="product-widget">
                  <a
                    title="Product Compare"
                    href="compare.html"
                    class="fas fa-random"
                  ></a>
                  <a
                    title="Product Video"
                    href="https://youtu.be/9xzcVxSBbG8"
                    class="venobox fas fa-play vbox-item"
                    data-autoplay="true"
                    data-vbtype="video"
                  ></a>
                  <a
                    title="Product View"
                    href="#"
                    class="fas fa-eye"
                    data-bs-toggle="modal"
                    data-bs-target="#product-view"
                  ></a>
                </div>
              </div>
              <div class="product-content">
                <div class="product-rating">
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="icofont-star"></i>
                  <a href="product-video.html">(3)</a>
                </div>
                <h6 class="product-name">
                  <a href="product-video.html">fresh green chilis</a>
                </h6>
                <h6 class="product-price">
                  <del>$34</del>
                  <span>$28<small>/piece</small></span>
                </h6>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="product-card">
              <div class="product-media">
                <div class="product-label">
                  <label class="label-text off">-10%</label>
                </div>
                <button class="product-wish wish">
                  <i class="fas fa-heart"></i>
                </button>
                <a class="product-image" href="product-video.html">
                  <img src="@/assets/images/default.png" alt="product" />
                </a>
                <div class="product-widget">
                  <a
                    title="Product Compare"
                    href="compare.html"
                    class="fas fa-random"
                  ></a>
                  <a
                    title="Product Video"
                    href="https://youtu.be/9xzcVxSBbG8"
                    class="venobox fas fa-play vbox-item"
                    data-autoplay="true"
                    data-vbtype="video"
                  ></a>
                  <a
                    title="Product View"
                    href="#"
                    class="fas fa-eye"
                    data-bs-toggle="modal"
                    data-bs-target="#product-view"
                  ></a>
                </div>
              </div>
              <div class="product-content">
                <div class="product-rating">
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="icofont-star"></i>
                  <a href="product-video.html">(3)</a>
                </div>
                <h6 class="product-name">
                  <a href="product-video.html">fresh green chilis</a>
                </h6>
                <h6 class="product-price">
                  <del>$34</del>
                  <span>$28<small>/piece</small></span>
                </h6>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="product-card">
              <div class="product-media">
                <div class="product-label">
                  <label class="label-text off">-10%</label>
                </div>
                <button class="product-wish wish">
                  <i class="fas fa-heart"></i>
                </button>
                <a class="product-image" href="product-video.html">
                  <img src="@/assets/images/default.png" alt="product" />
                </a>
                <div class="product-widget">
                  <a
                    title="Product Compare"
                    href="compare.html"
                    class="fas fa-random"
                  ></a>
                  <a
                    title="Product Video"
                    href="https://youtu.be/9xzcVxSBbG8"
                    class="venobox fas fa-play vbox-item"
                    data-autoplay="true"
                    data-vbtype="video"
                  ></a>
                  <a
                    title="Product View"
                    href="#"
                    class="fas fa-eye"
                    data-bs-toggle="modal"
                    data-bs-target="#product-view"
                  ></a>
                </div>
              </div>
              <div class="product-content">
                <div class="product-rating">
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="active icofont-star"></i>
                  <i class="icofont-star"></i>
                  <a href="product-video.html">(3)</a>
                </div>
                <h6 class="product-name">
                  <a href="product-video.html">fresh green chilis</a>
                </h6>
                <h6 class="product-price">
                  <del>$34</del>
                  <span>$28<small>/piece</small></span>
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="section-btn-25">
              <a href="shop-4column.html" class="btn btn-inline">
                <i class="fas fa-eye"></i>
                <span>view all deals</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* testing */
.product-image img{
    width: 100%;
}

/* testing */

.btn-inline {
  color: var(--primary);
  background: var(--secondary-color);
}

.section-heading {
  text-align: center;
  margin-top: 20px;
}

.countdown-time {
  color: white;
  border: 2px solid white;
}

.countdown-time span {
  color: white;
}

.deals-clock::before {
  position: absolute;
  content: "";
  top: 50%;
  left: 0px;
  width: 100%;
  z-index: -1;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  border-top: 2px dashed var(--primary);
}

.deals-clock::after {
  width: 0px !important;
  background: none;
}

.deals-clock::before {
  border-top: none;
}

#birthday {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 72vh; /* Ensure the canvas takes full height */
  z-index: -1; /* Put canvas behind the content */
}

.section {
  position: relative;
  margin: 0px 0 25px 0;
  z-index: 1; /* Ensure content stays above canvas */
}

#testbutton {
  width: 150px;
  height: 50px;
  border-radius: 180px;
  position: absolute;
  left: calc(50% - 75px);
  top: calc(50% - -125px);
  background: linear-gradient(
    60deg,
    #f79533,
    #f37055,
    #ef4e7b,
    #a166ab,
    #5073b8,
    #1098ad,
    #07b39b,
    #6fba82
  );
  cursor: pointer;
  line-height: 12px;
}

#testbutton:before {
  content: "";
  z-index: 1;
  position: absolute;
  display: block;
  width: 80%;
  height: 70%;
  top: 15%;
  left: 10%;
  transition: 0.3s opacity ease-in-out;
  filter: blur(15px);
  opacity: 0;
  background: linear-gradient(
    60deg,
    #f79533,
    #f37055,
    #ef4e7b,
    #a166ab,
    #5073b8,
    #1098ad,
    #07b39b,
    #6fba82
  );
}

#testbutton:hover:before {
  opacity: 1;
  transition: 0.3s opacity ease-in-out;
  filter: blur(25px);
  background: linear-gradient(
    60deg,
    #f79533,
    #f37055,
    #ef4e7b,
    #a166ab,
    #5073b8,
    #1098ad,
    #07b39b,
    #6fba82
  );
  /*143*/
}

#testbutton:after {
  content: "CLICK Anywhere!";
  text-align: center;
  line-height: 40px;
  font-size: 15px;
  color: rgba(235, 235, 235, 1);
  font-weight: bold;
  z-index: 5;
  position: absolute;
  display: block;
  border-radius: 180px;
  width: 92%;
  height: 80%;
  top: 10%;
  left: 4%;
}

@media (max-width: 1440px) {
    #birthday {
        height: 78vh; 
      }
      
      .section {
        position: relative;
        margin: 0px 0 25px 0;
        z-index: 1; /* Ensure content stays above canvas */
      }
    
}

@media (max-width: 1399px) {
    #birthday {
        height: 74vh; 
      }
    
}

@media (max-width: 1199px) {
    #birthday {
        height: 67vh; 
      }
    
}

@media (max-width: 1024px) {
    #birthday {
        height: 68vh; 
      }
    
}

@media (max-width: 991px) {
    #birthday {
        height: 122vh; 
      }
    
}

@media (max-width: 768px) {
    #birthday {
        height: 115vh; 
      }

      .section-heading {
        margin-top: 0px;
    }
    .section-heading {
        margin-bottom: 25px;
    }
    
}

@media (max-width: 767px) {
    #birthday {
        height: 120vh; 
        }
}

@media (max-width: 575px) {
    #birthday {
        height: 125vh; 
    }
}


@media (max-width: 425px) {
    #birthday {
        height: 107vh; 
    }
}


@media (max-width: 375px) {
    #birthday {
        height: 102vh; 
    }
}

@media (max-width: 320px) {
    #birthday {
        height: 95vh; 
    }
}

</style>
