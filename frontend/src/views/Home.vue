<template>
  <div class="home-page">

    <!-- Hero Section -->
    <section class="hero">

      <div class="hero-content">
        <p class="small-title">RIDE • EXPLORE • REPEAT</p>

        <h1>
          Your Journey,<br>
          Your <span>Ride.</span>
        </h1>

        <p class="hero-text">
          Rent your perfect bike and explore the city with
          freedom, comfort and style.
        </p>

        <div class="hero-buttons">
          <router-link to="/bikes" class="primary-button">
            Explore Bikes
          </router-link>

          <router-link to="/signup" class="secondary-button">
            Get Started
          </router-link>
        </div>
      </div>

      <div class="hero-image">
        <img
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39"
          alt="Bike"
        >
      </div>

    </section>


    <!-- Why RideOn -->
    <section class="features">

      <div class="section-heading">
        <p class="small-title">WHY RIDEON</p>
        <h2>Everything You Need for Your Ride</h2>
        <p>
          Simple, reliable and convenient bike rental experience.
        </p>
      </div>

      <div class="feature-grid">

        <div class="feature-card">
          <div class="feature-icon">🏍️</div>
          <h3>Quality Bikes</h3>
          <p>
            Choose from a range of well-maintained bikes
            for every type of journey.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Affordable Prices</h3>
          <p>
            Enjoy transparent and budget-friendly
            daily rental prices.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Easy Booking</h3>
          <p>
            Find your bike, select your dates and
            book your ride with ease.
          </p>
        </div>

      </div>

    </section>


    <!-- CTA -->
    <section class="cta">

      <div>
        <p class="small-title">READY TO RIDE?</p>

        <h2>
          Find Your Perfect Bike Today.
        </h2>

        <p>
          Start exploring our bikes and make your next
          journey unforgettable.
        </p>
      </div>

      <router-link to="/bikes" class="cta-button">
        Browse Bikes
      </router-link>

    </section>

  </div>
</template>


<style scoped>

.home-page {
  min-height: 100vh;
  background: #f5f7fa;
  color: #111827;
}


/* HERO */

.hero {
  min-height: 560px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 70px 7%;

  background:
    linear-gradient(
      135deg,
      #111827,
      #1f2937
    );

  color: white;
  gap: 50px;
}

.hero-content {
  max-width: 600px;
}

.small-title {
  font-size: 13px;
  letter-spacing: 3px;
  font-weight: 600;
  margin-bottom: 15px;
  opacity: 0.7;
}

.hero h1 {
  font-size: 58px;
  line-height: 1.08;
  margin: 0 0 22px;
  font-weight: 800;
}

.hero h1 span {
  color: white;
}

.hero-text {
  font-size: 18px;
  line-height: 1.7;
  color: #d1d5db;
  max-width: 520px;
  margin-bottom: 30px;
}


/* BUTTONS */

.hero-buttons {
  display: flex;
  gap: 15px;
}

.primary-button,
.secondary-button,
.cta-button {
  text-decoration: none;
  padding: 13px 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: 0.25s;
}

.primary-button {
  background: #2563eb;
  color: white;
}

.primary-button:hover {
  background: #3b82f6;
  transform: translateY(-2px);
}

.secondary-button {
  background: transparent;
  color: white;
  border: 1px solid #6b7280;
}

.secondary-button:hover {
  background: white;
  color: #111827;
}


/* HERO IMAGE */

.hero-image {
  width: 46%;
  max-width: 600px;
  height: 370px;
  overflow: hidden;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* FEATURES */

.features {
  width: 86%;
  max-width: 1300px;
  margin: auto;
  padding: 75px 0;
}

.section-heading {
  text-align: center;
  margin-bottom: 45px;
}

.section-heading .small-title {
  color: #2563eb;
  opacity: 1;
}

.section-heading h2 {
  font-size: 34px;
  margin: 8px 0 12px;
}

.section-heading > p:last-child {
  color: #6b7280;
}


/* FEATURE CARDS */

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.feature-card {
  background: white;
  padding: 32px;
  border-radius: 16px;

  border: 1px solid #e5e7eb;

  box-shadow:
    0 5px 20px rgba(0, 0, 0, 0.06);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-6px);

  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #eff6ff;
  border-radius: 12px;

  font-size: 25px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 20px;
  margin: 0 0 10px;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}


/* CTA */

.cta {
  width: 86%;
  max-width: 1300px;

  margin: 0 auto 70px;

  padding: 45px;

  border-radius: 18px;

  background: #111827;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 30px;
}

.cta .small-title {
  margin-bottom: 10px;
}

.cta h2 {
  font-size: 32px;
  margin: 0 0 10px;
}

.cta p {
  color: #d1d5db;
  margin: 0;
}

.cta-button {
  background: #2563eb;
  color: white;
  white-space: nowrap;
}

.cta-button:hover {
  background: #3b82f6;
}


/* RESPONSIVE */

@media (max-width: 900px) {

  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-image {
    width: 100%;
    max-width: none;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .cta {
    flex-direction: column;
    align-items: flex-start;
  }
}


@media (max-width: 600px) {

  .hero {
    padding: 50px 25px;
  }

  .hero h1 {
    font-size: 42px;
  }

  .hero-text {
    font-size: 16px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .hero-image {
    height: 260px;
  }

  .features {
    width: 90%;
  }

  .section-heading h2 {
    font-size: 28px;
  }

  .cta {
    width: 80%;
    padding: 30px;
  }

  .cta h2 {
    font-size: 26px;
  }
}

</style>