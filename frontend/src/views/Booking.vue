<template>
  <div class="booking-page">

    <div class="overlay"></div>

    <div class="booking-box">

      <!-- BIKE IMAGE -->
      <div class="bike-preview">

        <img
          v-if="selectedBike"
          :src="selectedBike.image"
          :alt="selectedBike.name"
        />

        <div v-else class="image-placeholder">
          Loading bike...
        </div>

        <div
          v-if="selectedBike"
          class="bike-overlay"
        >
          <p>{{ selectedBike.brand }}</p>

          <h2>
            {{ selectedBike.name }}
          </h2>

          <span>
            ₹{{ selectedBike.pricePerDay }} / day
          </span>
        </div>

      </div>


      <!-- BOOKING FORM -->
      <div class="booking-content">

        <router-link
          to="/bikes"
          class="close-button"
        >
          ×
        </router-link>

        <p class="auth-label">
          RIDEON
        </p>

        <h1>
          Book Your Ride
        </h1>

        <p class="auth-subtitle">
          Choose your dates and pickup location.
        </p>


        <form @submit.prevent="continueToPayment">

          <!-- SELECTED BIKE -->

          <div class="form-group">

            <label>
              Selected Bike
            </label>

            <select
              v-model="booking.bike"
              required
              @change="updateSelectedBike"
            >

              <option value="">
                Select a bike
              </option>

              <option
                v-for="bike in bikes"
                :key="bike._id"
                :value="bike._id"
              >
                {{ bike.brand }} {{ bike.name }}
              </option>

            </select>

          </div>


          <!-- DATES -->

          <div class="date-row">

            <div class="form-group">

              <label>
                Start Date
              </label>

              <input
                v-model="booking.startDate"
                type="date"
                required
              />

            </div>


            <div class="form-group">

              <label>
                End Date
              </label>

              <input
                v-model="booking.endDate"
                type="date"
                required
              />

            </div>

          </div>


          <!-- PICKUP LOCATION -->

          <div class="location-section">

            <div class="section-title">
              Pickup Location
            </div>


            <!-- PICKUP CITY -->

            <div class="form-group">

              <label>
                City
              </label>

              <select
                v-model="booking.pickupCity"
                required
              >

                <option value="">
                  Select city
                </option>

                <option value="Delhi">
                  Delhi
                </option>

                <option value="Noida">
                  Noida
                </option>

                <option value="Ghaziabad">
                  Ghaziabad
                </option>

                <option value="Gurugram">
                  Gurugram
                </option>

              </select>

            </div>


            <!-- PICKUP AREA -->

            <div
              v-if="booking.pickupCity"
              class="form-group"
            >

              <label>
                Area
              </label>

              <select
                v-model="booking.pickupArea"
                required
              >

                <option value="">
                  Select area
                </option>

                <option
                  v-for="area in pickupAreas"
                  :key="area"
                  :value="area"
                >
                  {{ area }}
                </option>

              </select>

            </div>


            <!-- PICKUP EXACT POINT -->

            <div
              v-if="booking.pickupArea"
              class="form-group"
            >

              <label>
                Pickup Point
              </label>

              <input
                v-model="booking.pickupPoint"
                type="text"
                list="pickup-points"
                placeholder="Search or enter pickup point"
                required
              />

              <datalist id="pickup-points">

                <option
                  v-for="point in pickupPoints"
                  :key="point"
                  :value="point"
                />

              </datalist>

            </div>

          </div>


          <!-- DROP-OFF LOCATION -->

          <div class="location-section">

            <div class="dropoff-header">

              <div class="section-title">
                Drop-off Location
              </div>

              <label class="same-location">

                <input
                  v-model="sameAsPickup"
                  type="checkbox"
                  @change="handleSameAsPickup"
                />

                <span>
                  Drop-off same as pickup
                </span>

              </label>

            </div>


            <!-- DROP-OFF FIELDS -->

            <div v-if="!sameAsPickup">

              <!-- DROP-OFF CITY -->

              <div class="form-group">

                <label>
                  City
                </label>

                <select
                  v-model="booking.dropoffCity"
                  required
                >

                  <option value="">
                    Select city
                  </option>

                  <option value="Delhi">
                    Delhi
                  </option>

                  <option value="Noida">
                    Noida
                  </option>

                  <option value="Ghaziabad">
                    Ghaziabad
                  </option>

                  <option value="Gurugram">
                    Gurugram
                  </option>

                </select>

              </div>


              <!-- DROP-OFF AREA -->

              <div
                v-if="booking.dropoffCity"
                class="form-group"
              >

                <label>
                  Area
                </label>

                <select
                  v-model="booking.dropoffArea"
                  required
                >

                  <option value="">
                    Select area
                  </option>

                  <option
                    v-for="area in dropoffAreas"
                    :key="area"
                    :value="area"
                  >
                    {{ area }}
                  </option>

                </select>

              </div>


              <!-- DROP-OFF EXACT POINT -->

              <div
                v-if="booking.dropoffArea"
                class="form-group"
              >

                <label>
                  Drop-off Point
                </label>

                <input
                  v-model="booking.dropoffPoint"
                  type="text"
                  list="dropoff-points"
                  placeholder="Search or enter drop-off point"
                  required
                />

                <datalist id="dropoff-points">

                  <option
                    v-for="point in dropoffPoints"
                    :key="point"
                    :value="point"
                  />

                </datalist>

              </div>

            </div>

          </div>


          <!-- PRICE SUMMARY -->

          <div
            v-if="selectedBike && totalDays > 0"
            class="price-summary"
          >

            <div class="price-row">

              <span>
                Price per day
              </span>

              <strong>
                ₹{{ selectedBike.pricePerDay }}
              </strong>

            </div>


            <div class="price-row">

              <span>
                Number of days
              </span>

              <strong>
                {{ totalDays }}
              </strong>

            </div>


            <div class="price-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{{ totalAmount }}
              </strong>

            </div>

          </div>


          <!-- ERROR -->

          <p
            v-if="error"
            class="error"
          >
            {{ error }}
          </p>


          <!-- BUTTON -->

          <button
            type="submit"
            class="booking-button"
          >
            Continue to Payment
          </button>

        </form>

      </div>

    </div>

  </div>
</template>


<script setup>

import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'


const route = useRoute()
const router = useRouter()


const bikes = ref([])
const selectedBike = ref(null)

const error = ref('')

const sameAsPickup = ref(false)


/*
  CITY-WISE AREAS
*/

const cityAreas = {

  Delhi: [
    'Dwarka',
    'Connaught Place',
    'Rohini',
    'Saket',
    'Karol Bagh',
    'Lajpat Nagar',
    'Rajouri Garden'
  ],

  Noida: [
    'Sector 18',
    'Sector 62',
    'Sector 15',
    'Sector 16',
    'Sector 27',
    'Sector 50',
    'Sector 137'
  ],

  Ghaziabad: [
    'Indirapuram',
    'Vaishali',
    'Kaushambi',
    'Raj Nagar',
    'Crossings Republik',
    'Vasundhara'
  ],

  Gurugram: [
    'Cyber City',
    'MG Road',
    'Golf Course Road',
    'Sohna Road',
    'Sector 14',
    'Sector 29',
    'DLF Phase 1'
  ]

}


/*
  CITY-WISE PICKUP POINTS
*/

const cityPickupPoints = {

  Delhi: {
    Dwarka: [
      'Dwarka Sector 10 Metro Station',
      'Dwarka Sector 21 Metro Station',
      'Dwarka Sector 12',
      'Dwarka Sector 6'
    ],

    'Connaught Place': [
      'Rajiv Chowk Metro Station',
      'Barakhamba Road',
      'Palika Bazaar',
      'Connaught Place Central Park'
    ],

    Rohini: [
      'Rohini West Metro Station',
      'Rohini East Metro Station',
      'Rohini Sector 7',
      'Rohini Sector 10'
    ],

    Saket: [
      'Saket Metro Station',
      'Select Citywalk',
      'Saket District Centre'
    ],

    'Karol Bagh': [
      'Karol Bagh Metro Station',
      'Ajmal Khan Road',
      'Pusa Road'
    ],

    'Lajpat Nagar': [
      'Lajpat Nagar Metro Station',
      'Central Market Lajpat Nagar',
      'Amar Colony'
    ],

    'Rajouri Garden': [
      'Rajouri Garden Metro Station',
      'Rajouri Garden Main Market',
      'Tagore Garden'
    ]
  },


  Noida: {

    'Sector 18': [
      'Noida Sector 18 Metro Station',
      'Atta Market',
      'DLF Mall of India'
    ],

    'Sector 62': [
      'Noida Sector 62 Metro Station',
      'Fortis Hospital Noida',
      'Electronic City'
    ],

    'Sector 15': [
      'Noida Sector 15 Metro Station',
      'Sector 15 Market'
    ],

    'Sector 16': [
      'Noida Sector 16 Metro Station',
      'Sector 16 Market'
    ],

    'Sector 27': [
      'Noida Sector 27 Market',
      'Sector 27 Metro Area'
    ],

    'Sector 50': [
      'Noida Sector 50 Market',
      'Sector 50 Metro Area'
    ],

    'Sector 137': [
      'Noida Sector 137 Metro Station',
      'Sector 137 Market'
    ]
  },


  Ghaziabad: {

    Indirapuram: [
      'Shipra Mall',
      'Indirapuram Habitat Centre',
      'Indirapuram Main Road'
    ],

    Vaishali: [
      'Vaishali Metro Station',
      'Mahagun Mall',
      'Vaishali Sector 4'
    ],

    Kaushambi: [
      'Kaushambi Metro Station',
      'Anand Vihar Border',
      'Kaushambi Main Road'
    ],

    'Raj Nagar': [
      'Raj Nagar District Centre',
      'Raj Nagar Extension',
      'RDC Ghaziabad'
    ],

    'Crossings Republik': [
      'Crossings Republik Main Gate',
      'Crossings Republik Market'
    ],

    Vasundhara: [
      'Vasundhara Sector 5',
      'Vasundhara Main Market'
    ]
  },


  Gurugram: {

    'Cyber City': [
      'Cyber City Metro Station',
      'Cyber Hub',
      'DLF Cyber City'
    ],

    'MG Road': [
      'MG Road Metro Station',
      'MG Road Market',
      'Sikanderpur Metro Station'
    ],

    'Golf Course Road': [
      'Golf Course Road Metro Area',
      'Sector 54 Metro Station',
      'Gurugram-Faridabad Road'
    ],

    'Sohna Road': [
      'Sohna Road Market',
      'Sector 47',
      'Sector 48'
    ],

    'Sector 14': [
      'Gurugram Sector 14 Market',
      'Sector 14 Main Road'
    ],

    'Sector 29': [
      'Leisure Valley Park',
      'Sector 29 Market',
      'IFFCO Chowk'
    ],

    'DLF Phase 1': [
      'DLF Phase 1 Metro Station',
      'DLF Phase 1 Market',
      'Golf Course Road'
    ]

  }

}


/*
  BOOKING DATA
*/

const booking = ref({

  bike:
    route.query.bikeId ||
    route.query.bike ||
    '',

  startDate:
    '',

  endDate:
    '',

  pickupCity:
    '',

  pickupArea:
    '',

  pickupPoint:
    '',

  dropoffCity:
    '',

  dropoffArea:
    '',

  dropoffPoint:
    ''

})


/*
  PICKUP AREAS
*/

const pickupAreas = computed(() => {

  return cityAreas[
    booking.value.pickupCity
  ] || []

})


/*
  DROP-OFF AREAS
*/

const dropoffAreas = computed(() => {

  return cityAreas[
    booking.value.dropoffCity
  ] || []

})


/*
  PICKUP POINTS
*/

const pickupPoints = computed(() => {

  return (
    cityPickupPoints[
      booking.value.pickupCity
    ]?.[
      booking.value.pickupArea
    ] || []
  )

})


/*
  DROP-OFF POINTS
*/

const dropoffPoints = computed(() => {

  return (
    cityPickupPoints[
      booking.value.dropoffCity
    ]?.[
      booking.value.dropoffArea
    ] || []
  )

})


/*
  RESET PICKUP AREA/POINT
  WHEN CITY CHANGES
*/

watch(
  () => booking.value.pickupCity,
  () => {

    booking.value.pickupArea = ''
    booking.value.pickupPoint = ''

  }
)


/*
  RESET PICKUP POINT
  WHEN AREA CHANGES
*/

watch(
  () => booking.value.pickupArea,
  () => {

    booking.value.pickupPoint = ''

  }
)


/*
  RESET DROPOFF AREA/POINT
  WHEN CITY CHANGES
*/

watch(
  () => booking.value.dropoffCity,
  () => {

    if (!sameAsPickup.value) {

      booking.value.dropoffArea = ''
      booking.value.dropoffPoint = ''

    }

  }
)


/*
  RESET DROPOFF POINT
  WHEN AREA CHANGES
*/

watch(
  () => booking.value.dropoffArea,
  () => {

    if (!sameAsPickup.value) {

      booking.value.dropoffPoint = ''

    }

  }
)


/*
  SAME AS PICKUP
*/

const handleSameAsPickup = () => {

  if (sameAsPickup.value) {

    booking.value.dropoffCity =
      booking.value.pickupCity

    booking.value.dropoffArea =
      booking.value.pickupArea

    booking.value.dropoffPoint =
      booking.value.pickupPoint

  } else {

    booking.value.dropoffCity = ''
    booking.value.dropoffArea = ''
    booking.value.dropoffPoint = ''

  }

}


/*
  KEEP DROPOFF SAME
  WHEN PICKUP CHANGES
*/

watch(
  [
    () => booking.value.pickupCity,
    () => booking.value.pickupArea,
    () => booking.value.pickupPoint
  ],
  () => {

    if (sameAsPickup.value) {

      booking.value.dropoffCity =
        booking.value.pickupCity

      booking.value.dropoffArea =
        booking.value.pickupArea

      booking.value.dropoffPoint =
        booking.value.pickupPoint

    }

  }
)


/*
  FETCH BIKES
*/

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

    updateSelectedBike()

  } catch (err) {

    error.value =
      'Unable to load bikes.'

    console.error(err)

  }

}


/*
  SELECTED BIKE
*/

const updateSelectedBike = () => {

  selectedBike.value =
    bikes.value.find(
      bike =>
        bike._id === booking.value.bike
    ) || null

}


/*
  NUMBER OF DAYS
*/

const totalDays = computed(() => {

  if (
    !booking.value.startDate ||
    !booking.value.endDate
  ) {

    return 0

  }

  const start =
    new Date(
      booking.value.startDate
    )

  const end =
    new Date(
      booking.value.endDate
    )

  const difference =
    end - start

  if (difference < 0) {

    return 0

  }

  const millisecondsPerDay =
    1000 * 60 * 60 * 24

  return Math.max(
    1,
    Math.ceil(
      difference /
      millisecondsPerDay
    )
  )

})


/*
  TOTAL AMOUNT
*/

const totalAmount = computed(() => {

  if (!selectedBike.value) {

    return 0

  }

  return (
    totalDays.value *
    selectedBike.value.pricePerDay
  )

})


/*
  CONTINUE TO PAYMENT
*/

const continueToPayment = () => {

  error.value = ''


  if (!selectedBike.value) {

    error.value =
      'Please select a bike.'

    return

  }


  if (
    !booking.value.startDate ||
    !booking.value.endDate
  ) {

    error.value =
      'Please select your dates.'

    return

  }


  if (
    new Date(
      booking.value.endDate
    ) <
    new Date(
      booking.value.startDate
    )
  ) {

    error.value =
      'End date cannot be before start date.'

    return

  }


  if (
    !booking.value.pickupCity ||
    !booking.value.pickupArea ||
    !booking.value.pickupPoint
  ) {

    error.value =
      'Please complete the pickup location.'

    return

  }


  if (
    !booking.value.dropoffCity ||
    !booking.value.dropoffArea ||
    !booking.value.dropoffPoint
  ) {

    error.value =
      'Please complete the drop-off location.'

    return

  }


  if (totalAmount.value <= 0) {

    error.value =
      'Unable to calculate payment amount.'

    return

  }


  /*
    We are NOT creating the booking here.

    Booking will be created after
    successful payment.
  */

  const pickupLocation =
    `${booking.value.pickupCity}, ${booking.value.pickupArea}, ${booking.value.pickupPoint}`

  const dropoffLocation =
    `${booking.value.dropoffCity}, ${booking.value.dropoffArea}, ${booking.value.dropoffPoint}`


  router.push({

    name: 'Payment',

    query: {

      bikeId:
        selectedBike.value._id,

      bikeName:
        selectedBike.value.name,

      brand:
        selectedBike.value.brand,

      location:
        pickupLocation,

      pickupLocation:
        pickupLocation,

      dropoffLocation:
        dropoffLocation,

      startDate:
        booking.value.startDate,

      endDate:
        booking.value.endDate,

      amount:
        totalAmount.value

    }

  })

}


/*
  LOAD
*/

onMounted(() => {

  fetchBikes()

})

</script>


<style scoped>

.booking-page {
  min-height: calc(100vh - 72px);

  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 50px 20px;

  background-image:
    url('https://images.unsplash.com/photo-1558981806-ec527fa84c39');

  background-size: cover;

  background-position: center;
}


.overlay {
  position: absolute;

  inset: 0;

  background:
    rgba(0, 0, 0, 0.68);
}


.booking-box {
  position: relative;

  z-index: 2;

  width: 100%;

  max-width: 900px;

  display: grid;

  grid-template-columns:
    0.9fr 1.1fr;

  background:
    linear-gradient(
      135deg,
      #111827,
      #1f2937
    );

  border: 1px solid #374151;

  border-radius: 12px;

  overflow: hidden;

  box-shadow:
    0 20px 60px
    rgba(0, 0, 0, 0.55);
}


/* BIKE IMAGE */

.bike-preview {
  position: relative;

  min-height: 570px;

  background: #111827;

  overflow: hidden;
}

.bike-preview img {
  width: 100%;

  height: 100%;

  position: absolute;

  inset: 0;

  object-fit: cover;

  transition:
    transform 0.4s ease;
}

.booking-box:hover
.bike-preview img {
  transform: scale(1.03);
}

.bike-preview::after {
  content: '';

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.82),
      rgba(0, 0, 0, 0.05)
    );
}


.bike-overlay {
  position: absolute;

  z-index: 2;

  left: 28px;

  right: 28px;

  bottom: 28px;

  color: white;
}

.bike-overlay p {
  margin: 0 0 5px;

  color: #60a5fa;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 2px;

  text-transform: uppercase;
}

.bike-overlay h2 {
  margin: 0 0 8px;

  font-size: 30px;

  font-weight: 800;
}

.bike-overlay span {
  color: #e5e7eb;

  font-size: 14px;
}


.image-placeholder {
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #9ca3af;

  font-size: 14px;
}


/* CONTENT */

.booking-content {
  position: relative;

  padding: 42px 36px 35px;
}


.close-button {
  position: absolute;

  top: 17px;

  right: 22px;

  color: white;

  text-decoration: none;

  font-size: 34px;

  font-weight: 300;

  line-height: 1;

  transition: 0.2s;
}

.close-button:hover {
  color: #d1d5db;
}


.auth-label {
  margin: 0 0 8px;

  color: white;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 3px;
}


.booking-content h1 {
  margin: 0 0 8px;

  color: white;

  font-size: 30px;

  font-weight: 700;
}


.auth-subtitle {
  margin: 0 0 27px;

  color: #d1d5db;

  font-size: 14px;
}


/* FORM */

.form-group {
  margin-bottom: 17px;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  color: white;

  font-size: 13px;
}


.form-group input,
.form-group select {
  width: 100%;

  box-sizing: border-box;

  height: 47px;

  padding: 0 14px;

  background: #1f2937;

  border: 1px solid #4b5563;

  color: white;

  font-size: 14px;

  outline: none;

  border-radius: 6px;

  transition: 0.2s;
}


.form-group input::placeholder {
  color: #9ca3af;
}


.form-group select option {
  background: #1f2937;

  color: white;
}


.form-group input:focus,
.form-group select:focus {
  border-color: #60a5fa;

  background: #243247;
}


/* DATES */

.date-row {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 14px;
}


/* LOCATION */

.location-section {
  margin-top: 22px;

  padding: 18px;

  background: #182234;

  border: 1px solid #374151;

  border-radius: 8px;
}


.section-title {
  margin-bottom: 17px;

  color: white;

  font-size: 14px;

  font-weight: 700;
}


.dropoff-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;

  margin-bottom: 17px;
}


.dropoff-header .section-title {
  margin-bottom: 0;
}


.same-location {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #cbd5e1;

  font-size: 12px;

  cursor: pointer;

  white-space: nowrap;
}


.same-location input {
  width: 15px;

  height: 15px;

  accent-color: #2563eb;

  cursor: pointer;
}


/* PRICE SUMMARY */

.price-summary {
  margin: 20px 0 18px;

  padding: 15px;

  background: #182234;

  border: 1px solid #374151;

  border-radius: 7px;
}


.price-row {
  display: flex;

  justify-content: space-between;

  padding: 7px 0;

  color: #cbd5e1;

  font-size: 13px;
}


.price-row strong {
  color: white;
}


.price-total {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-top: 7px;

  padding-top: 12px;

  border-top: 1px solid #374151;

  color: white;

  font-size: 14px;

  font-weight: 700;
}


.price-total strong {
  color: #60a5fa;

  font-size: 21px;
}


/* ERROR */

.error {
  padding: 10px;

  margin: 0 0 14px;

  background: #3b2020;

  border: 1px solid #704040;

  color: #ffb4b4;

  font-size: 13px;

  border-radius: 6px;
}


/* BUTTON */

.booking-button {
  width: 100%;

  height: 53px;

  border: none;

  background: #2563eb;

  color: white;

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 0.5px;

  cursor: pointer;

  border-radius: 7px;

  transition: 0.25s;
}


.booking-button:hover {
  background: #3b82f6;

  transform:
    translateY(-2px);
}


/* MOBILE */

@media (max-width: 750px) {

  .booking-box {
    grid-template-columns: 1fr;
  }


  .bike-preview {
    min-height: 300px;

    height: 300px;
  }


  .booking-content {
    padding:
      35px 25px 30px;
  }


  .dropoff-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 10px;
  }

}


@media (max-width: 500px) {

  .booking-page {
    padding: 30px 15px;
  }


  .date-row {
    grid-template-columns: 1fr;

    gap: 0;
  }


  .bike-preview {
    min-height: 250px;

    height: 250px;
  }


  .bike-overlay h2 {
    font-size: 25px;
  }


  .location-section {
    padding: 15px;
  }

}

</style>