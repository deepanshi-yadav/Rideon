<template>
  <div class="bikes-page">

    <!-- Page Header -->
    <section class="page-header">
      <div>
        <p class="small-title">RIDE • EXPLORE • REPEAT</p>

        <h1>Choose Your Ride</h1>

        <p class="subtitle">
          Find the perfect bike for your next journey.
        </p>
      </div>
    </section>


    <!-- Bikes Section -->
    <section class="bikes-section">

      <div class="section-top">

        <div>
          <h2>Available Bikes</h2>

          <p>
            {{ filteredBikes.length }} bikes available for booking
          </p>
        </div>


        <!-- Filters -->
        <div class="filters">

          <!-- City Filter -->
          <select
            v-model="selectedCity"
            class="filter"
          >
            <option value="All">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
            <option value="Gurugram">Gurugram</option>
          </select>


          <!-- Type Filter -->
          <select
            v-model="selectedType"
            class="filter"
          >
            <option value="All">All Types</option>
            <option value="Cruiser">Cruiser</option>
            <option value="Roadster">Roadster</option>
            <option value="Scooter">Scooter</option>
            <option value="Sports">Sports</option>
            <option value="Street">Street</option>
          </select>

        </div>

      </div>


      <!-- Loading -->
      <div
        v-if="loading"
        class="message"
      >
        Loading bikes...
      </div>


      <!-- Error -->
      <div
        v-else-if="error"
        class="message error"
      >
        {{ error }}
      </div>


      <!-- Bike Cards -->
      <div
        v-else
        class="bike-grid"
      >

        <div
          v-for="bike in filteredBikes"
          :key="bike._id"
          class="bike-card"
        >

          <!-- Bike Image -->
          <div class="image-container">

            <img
              :src="bike.image"
              :alt="bike.name"
            />

            <span class="type-badge">
              {{ bike.type }}
            </span>

            <span
              class="availability"
              :class="{ unavailable: !bike.available }"
            >
              {{ bike.available ? 'Available' : 'Unavailable' }}
            </span>

          </div>


          <!-- Card Content -->
          <div class="card-content">

            <div class="bike-title">
              <div>
                <p class="brand">
                  {{ bike.brand }}
                </p>

                <h3>
                  {{ bike.name }}
                </h3>
              </div>
            </div>


            <p class="description">
              {{ bike.description }}
            </p>


            <!-- Bike Info -->
            <div class="bike-info">

              <div class="info-item">
                <span>📍</span>
                <span>{{ bike.location }}</span>
              </div>

              <div class="info-item">
                <span>🏍️</span>
                <span>{{ bike.stock }} available</span>
              </div>

            </div>


            <!-- Price + Button -->
            <div class="card-bottom">

              <div class="price">
                <span>
                  ₹{{ bike.pricePerDay }}
                </span>

                <small>
                  / day
                </small>
              </div>


              <button
                class="book-button"
                :disabled="!bike.available || bike.stock <= 0"
                @click="bookBike(bike._id)"
              >
                {{
                  bike.available && bike.stock > 0
                    ? 'Book Now'
                    : 'Unavailable'
                }}
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>

  </div>
</template>


<script setup>

import {
  ref,
  computed,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'


const router = useRouter()


// =========================
// STATE
// =========================

const bikes = ref([])

const loading = ref(true)

const error = ref('')

const selectedCity = ref('All')

const selectedType = ref('All')


// =========================
// FETCH BIKES
// =========================

const fetchBikes = async () => {

  try {

    const response = await fetch(
      'http://localhost:4000/api/bikes'
    )


    if (!response.ok) {

      throw new Error(
        'Failed to fetch bikes'
      )

    }


    bikes.value =
      await response.json()


  } catch (err) {

    error.value =
      'Unable to load bikes. Please try again.'

    console.error(err)


  } finally {

    loading.value = false

  }

}


// =========================
// FILTER BIKES
// =========================

const filteredBikes = computed(() => {

  return bikes.value.filter((bike) => {

    const cityMatch =
      selectedCity.value === 'All' ||
      bike.location === selectedCity.value


    const typeMatch =
      selectedType.value === 'All' ||
      bike.type === selectedType.value


    return cityMatch && typeMatch

  })

})


// =========================
// BOOK BIKE
// =========================

const bookBike = (bikeId) => {

  router.push({

    path: '/booking',

    query: {
      bike: bikeId
    }

  })

}


// =========================
// PAGE LOAD
// =========================

onMounted(() => {

  fetchBikes()

})

</script>


<style scoped>


/* =========================
   PAGE
========================= */

.bikes-page {

  min-height: 100vh;

  background: #f5f7fa;

  color: #111827;

}


/* =========================
   PAGE HEADER
========================= */

.page-header {

  padding: 70px 7%;

  background:
    linear-gradient(
      135deg,
      #111827,
      #1f2937
    );

  color: white;

}


.small-title {

  font-size: 13px;

  letter-spacing: 3px;

  font-weight: 600;

  margin-bottom: 15px;

  color: #d1d5db;

}


.page-header h1 {

  font-size: 46px;

  line-height: 1.08;

  margin: 0 0 12px;

  font-weight: 800;

  letter-spacing: -1px;

}


.subtitle {

  margin: 0;

  font-size: 17px;

  color: #d1d5db;

}


/* =========================
   BIKES SECTION
========================= */

.bikes-section {

  width: 86%;

  max-width: 1300px;

  margin: auto;

  padding: 75px 0 80px;

}


/* =========================
   SECTION TOP
========================= */

.section-top {

  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 35px;

}


.section-top h2 {

  margin: 0;

  font-size: 30px;

  color: #111827;

}


.section-top p {

  margin: 7px 0 0;

  color: #6b7280;

}


/* =========================
   FILTERS
========================= */

.filters {

  display: flex;

  gap: 12px;

  align-items: center;

}


.filter {

  padding: 11px 16px;

  border: 1px solid #d1d5db;

  border-radius: 8px;

  background: white;

  color: #374151;

  font-size: 14px;

  cursor: pointer;

  outline: none;

  box-shadow:
    0 3px 10px
    rgba(0, 0, 0, 0.04);

}


.filter:focus {

  border-color: #2563eb;

}


/* =========================
   BIKE GRID
========================= */

.bike-grid {

  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 28px;

}


/* =========================
   BIKE CARD
========================= */

.bike-card {

  background: white;

  border-radius: 16px;

  overflow: hidden;

  border: 1px solid #e5e7eb;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.06);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

}


.bike-card:hover {

  transform: translateY(-6px);

  box-shadow:
    0 15px 35px
    rgba(0, 0, 0, 0.12);

}


/* =========================
   IMAGE
========================= */

.image-container {

  height: 230px;

  position: relative;

  overflow: hidden;

  background: #e5e7eb;

}


.image-container img {

  width: 100%;

  height: 100%;

  object-fit: cover;

  transition:
    transform 0.4s ease,
    filter 0.3s ease;

}


.bike-card:hover
.image-container img {

  transform: scale(1.05);

  filter: brightness(1.04);

}


/* =========================
   TYPE BADGE
========================= */

.type-badge {

  position: absolute;

  top: 14px;

  left: 14px;

  background:
    rgba(17, 24, 39, 0.90);

  color: white;

  padding: 6px 11px;

  border-radius: 5px;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.2px;

}


/* =========================
   AVAILABILITY
========================= */

.availability {

  position: absolute;

  top: 14px;

  right: 14px;

  background:
    rgba(220, 252, 231, 0.96);

  color: #166534;

  padding: 6px 11px;

  border-radius: 5px;

  font-size: 12px;

  font-weight: 600;

}


.availability.unavailable {

  background:
    rgba(254, 226, 226, 0.96);

  color: #991b1b;

}


/* =========================
   CARD CONTENT
========================= */

.card-content {

  padding: 25px;

}


.brand {

  margin: 0 0 4px;

  color: #6b7280;

  font-size: 13px;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 0.7px;

}


.bike-title h3 {

  margin: 0;

  font-size: 23px;

  color: #111827;

  font-weight: 700;

}


.description {

  color: #6b7280;

  font-size: 14px;

  line-height: 1.6;

  min-height: 45px;

  margin: 15px 0 18px;

}


/* =========================
   BIKE INFO
========================= */

.bike-info {

  display: flex;

  gap: 20px;

  border-top:
    1px solid #e5e7eb;

  border-bottom:
    1px solid #e5e7eb;

  padding: 14px 0;

  margin-bottom: 20px;

}


.info-item {

  display: flex;

  align-items: center;

  gap: 6px;

  font-size: 13px;

  color: #6b7280;

}


/* =========================
   PRICE + BUTTON
========================= */

.card-bottom {

  display: flex;

  justify-content: space-between;

  align-items: center;

}


.price span {

  font-size: 24px;

  font-weight: 800;

  color: #111827;

}


.price small {

  color: #6b7280;

  font-size: 13px;

}


/* =========================
   BOOK BUTTON
========================= */

.book-button {

  border: none;

  background: #2563eb;

  color: white;

  padding: 12px 19px;

  border-radius: 8px;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.25s;

}


.book-button:hover {

  background: #3b82f6;

  transform: translateY(-2px);

}


.book-button:disabled {

  background: #d1d5db;

  color: #6b7280;

  cursor: not-allowed;

  transform: none;

}


/* =========================
   LOADING / ERROR
========================= */

.message {

  background: white;

  padding: 35px;

  border-radius: 16px;

  text-align: center;

  color: #6b7280;

  border: 1px solid #e5e7eb;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.06);

}


.message.error {

  color: #dc2626;

}


/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1000px) {

  .bike-grid {

    grid-template-columns:
      repeat(2, 1fr);

  }

}


@media (max-width: 650px) {

  .page-header {

    padding: 50px 25px;

  }


  .page-header h1 {

    font-size: 36px;

  }


  .bikes-section {

    width: 90%;

    padding: 55px 0;

  }


  .section-top {

    flex-direction: column;

    align-items: flex-start;

    gap: 18px;

  }


  .filters {

    width: 100%;

    flex-direction: column;

    align-items: stretch;

  }


  .filter {

    width: 100%;

  }


  .bike-grid {

    grid-template-columns: 1fr;

  }


  .image-container {

    height: 230px;

  }


  .card-content {

    padding: 22px;

  }

}

</style>