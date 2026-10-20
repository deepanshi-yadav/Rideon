```vue
<template>
  <div class="bookings-page">

    <!-- HEADER -->
    <section class="page-header">
      <div>
        <p class="small-title">RIDE • EXPLORE • REPEAT</p>

        <h1>My <span>Bookings.</span></h1>

        <p class="subtitle">
          View and manage your RideOn bookings.
        </p>
      </div>
    </section>


    <!-- BOOKINGS -->
    <section class="bookings-section">

      <div class="section-heading">
        <div>
          <p class="section-label">RIDEON</p>
          <h2>Your Bookings</h2>
          <p>All your bike rental bookings in one place.</p>
        </div>
      </div>


      <!-- LOADING -->
      <div v-if="loading" class="message">
        Loading your bookings...
      </div>


      <!-- ERROR -->
      <div v-else-if="error" class="message error">
        {{ error }}
      </div>


      <!-- NO BOOKINGS -->
      <div
        v-else-if="bookings.length === 0"
        class="empty-box"
      >
        <div class="empty-icon">🏍️</div>

        <h3>No bookings yet</h3>

        <p>
          You haven't booked a bike yet.
          Start exploring and book your first ride.
        </p>

        <router-link
          to="/bikes"
          class="browse-button"
        >
          Browse Bikes
        </router-link>
      </div>


      <!-- BOOKING CARDS -->
      <div
        v-else
        class="booking-grid"
      >

        <div
          v-for="booking in bookings"
          :key="booking._id"
          class="booking-card"
        >

          <!-- BIKE IMAGE -->
          <div class="bike-image">

            <img
              v-if="booking.bike?.image"
              :src="booking.bike.image"
              :alt="booking.bike.name"
            />

            <div v-else class="image-placeholder">
              No Image
            </div>

            <span
              class="status"
              :class="booking.status"
            >
              {{ booking.status }}
            </span>

          </div>


          <!-- CONTENT -->
          <div class="booking-content">

            <p class="brand">
              {{ booking.bike?.brand || 'Bike' }}
            </p>

            <h3>
              {{ booking.bike?.name || 'Bike' }}
            </h3>


            <div class="booking-info">

              <div class="info-row">
                <span class="info-label">
                  Start Date
                </span>

                <span>
                  {{ formatDate(booking.startDate) }}
                </span>
              </div>


              <div class="info-row">
                <span class="info-label">
                  End Date
                </span>

                <span>
                  {{ formatDate(booking.endDate) }}
                </span>
              </div>


              <div class="info-row">
                <span class="info-label">
                  Pickup
                </span>

                <span>
                  {{ booking.pickupLocation || '—' }}
                </span>
              </div>


              <div class="info-row">
                <span class="info-label">
                  Drop-off
                </span>

                <span>
                  {{ booking.dropoffLocation || '—' }}
                </span>
              </div>

            </div>


            <!-- BOTTOM -->
            <div class="booking-bottom">

              <div class="price">
                <span>
                  ₹{{ booking.totalAmount }}
                </span>

                <small>
                  total
                </small>
              </div>


              <button
                v-if="booking.status !== 'cancelled'"
                class="cancel-button"
                :disabled="cancellingId === booking._id"
                @click="cancelBooking(booking._id)"
              >
                {{
                  cancellingId === booking._id
                    ? 'Cancelling...'
                    : 'Cancel Booking'
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

import { ref, onMounted } from 'vue'


const bookings = ref([])

const loading = ref(true)

const error = ref('')

const cancellingId = ref('')


/* FORMAT DATE */

const formatDate = (date) => {

  if (!date) {
    return '-'
  }

  return new Date(date).toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  )

}


/* FETCH BOOKINGS */

const fetchBookings = async () => {

  try {

    const token = localStorage.getItem('token')

    if (!token) {

      error.value =
        'Please login to view your bookings.'

      return

    }


    const response = await fetch(
      'http://localhost:4000/api/bookings/my',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )


    const data = await response.json()


    if (!response.ok) {

      throw new Error(
        data.message || 'Failed to fetch bookings'
      )

    }


    bookings.value = data


  } catch (err) {

    error.value = err.message

  } finally {

    loading.value = false

  }

}


/* CANCEL BOOKING */

const cancelBooking = async (bookingId) => {

  const token = localStorage.getItem('token')

  if (!token) {
    return
  }


  cancellingId.value = bookingId


  try {

    const response = await fetch(
      `http://localhost:4000/api/bookings/${bookingId}/cancel`,
      {
        method: 'PUT',

        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )


    const data = await response.json()


    if (!response.ok) {

      throw new Error(
        data.message || 'Failed to cancel booking'
      )

    }


    await fetchBookings()


  } catch (err) {

    error.value = err.message

  } finally {

    cancellingId.value = ''

  }

}


/* LOAD */

onMounted(() => {

  fetchBookings()

})

</script>


<style scoped>

.bookings-page {
  min-height: 100vh;

  background: #f5f7fa;

  color: #111827;
}


/* HEADER */

.page-header {
  padding: 65px 7%;

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

  margin-bottom: 14px;

  color: #d1d5db;
}

.page-header h1 {
  font-size: 46px;

  line-height: 1.1;

  margin: 0 0 12px;

  font-weight: 800;

  letter-spacing: -1px;
}

.page-header h1 span {
  color: #60a5fa;
}

.subtitle {
  margin: 0;

  font-size: 17px;

  color: #d1d5db;
}


/* SECTION */

.bookings-section {
  width: 86%;

  max-width: 1300px;

  margin: auto;

  padding: 65px 0 80px;
}


/* HEADING */

.section-heading {
  margin-bottom: 30px;
}

.section-label {
  margin: 0 0 7px;

  color: #2563eb;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 3px;
}

.section-heading h2 {
  margin: 0 0 7px;

  font-size: 30px;
}

.section-heading > div > p:last-child {
  margin: 0;

  color: #6b7280;

  font-size: 14px;
}


/* GRID */

.booking-grid {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 28px;
}


/* CARD */

.booking-card {
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

.booking-card:hover {
  transform: translateY(-5px);

  box-shadow:
    0 15px 35px
    rgba(0, 0, 0, 0.12);
}


/* IMAGE */

.bike-image {
  height: 230px;

  position: relative;

  overflow: hidden;

  background: #e5e7eb;
}

.bike-image img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.image-placeholder {
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #6b7280;
}


/* STATUS */

.status {
  position: absolute;

  top: 14px;

  right: 14px;

  padding: 6px 11px;

  border-radius: 5px;

  font-size: 12px;

  font-weight: 700;

  text-transform: capitalize;

  background: #dbeafe;

  color: #1d4ed8;
}

.status.confirmed {
  background: #dcfce7;

  color: #166534;
}

.status.completed {
  background: #e0e7ff;

  color: #3730a3;
}

.status.pending {
  background: #fef3c7;

  color: #92400e;
}

.status.cancelled {
  background: #fee2e2;

  color: #991b1b;
}


/* CONTENT */

.booking-content {
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

.booking-content h3 {
  margin: 0 0 20px;

  color: #111827;

  font-size: 24px;
}


/* INFO */

.booking-info {
  border-top: 1px solid #e5e7eb;

  border-bottom: 1px solid #e5e7eb;

  padding: 14px 0;

  margin-bottom: 20px;
}

.info-row {
  display: flex;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 10px;

  color: #374151;

  font-size: 13px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #6b7280;

  font-weight: 600;
}


/* BOTTOM */

.booking-bottom {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;
}

.price span {
  font-size: 23px;

  font-weight: 800;

  color: #111827;
}

.price small {
  margin-left: 4px;

  color: #6b7280;

  font-size: 12px;
}


/* CANCEL */

.cancel-button {
  border: 1px solid #dc2626;

  background: white;

  color: #dc2626;

  padding: 10px 14px;

  border-radius: 6px;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.cancel-button:hover {
  background: #dc2626;

  color: white;
}

.cancel-button:disabled {
  opacity: 0.5;

  cursor: not-allowed;
}


/* EMPTY */

.empty-box {
  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 16px;

  padding: 55px 30px;

  text-align: center;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 42px;

  margin-bottom: 15px;
}

.empty-box h3 {
  margin: 0 0 8px;

  font-size: 22px;
}

.empty-box p {
  margin: 0 auto 22px;

  max-width: 450px;

  color: #6b7280;

  line-height: 1.6;

  font-size: 14px;
}

.browse-button {
  display: inline-block;

  padding: 12px 20px;

  border-radius: 7px;

  background: #2563eb;

  color: white;

  text-decoration: none;

  font-size: 14px;

  font-weight: 700;

  transition: 0.25s;
}

.browse-button:hover {
  background: #3b82f6;

  transform: translateY(-2px);
}


/* MESSAGE */

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


/* RESPONSIVE */

@media (max-width: 900px) {

  .booking-grid {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 600px) {

  .page-header {
    padding: 50px 25px;
  }

  .page-header h1 {
    font-size: 36px;
  }

  .bookings-section {
    width: 90%;

    padding: 50px 0 60px;
  }

  .booking-bottom {
    align-items: flex-start;

    flex-direction: column;
  }

  .cancel-button {
    width: 100%;
  }

}

</style>
```
