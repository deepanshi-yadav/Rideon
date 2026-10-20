<template>
  <div class="payment-page">

    <div class="overlay"></div>

    <div class="payment-box">

      <!-- LEFT SIDE -->
      <div class="payment-summary">

        <p class="summary-label">
          RIDEON
        </p>

        <h1>
          Complete Your
          <span>Payment.</span>
        </h1>

        <p class="summary-text">
          Securely complete your bike rental payment
          using Razorpay.
        </p>

        <div class="summary-card">

          <div class="summary-row">
            <span>Bike</span>
            <strong>{{ bikeName }}</strong>
          </div>

          <div class="summary-row">
            <span>Pickup</span>
            <strong>{{ pickupLocation }}</strong>
          </div>

          <div class="summary-row">
            <span>Drop-off</span>
            <strong>{{ dropoffLocation }}</strong>
          </div>

          <div class="summary-row">
            <span>Start Date</span>
            <strong>{{ startDate }}</strong>
          </div>

          <div class="summary-row">
            <span>End Date</span>
            <strong>{{ endDate }}</strong>
          </div>

        </div>

        <div class="total-box">

          <span>
            Total Amount
          </span>

          <strong>
            ₹{{ totalAmount }}
          </strong>

        </div>

      </div>


      <!-- RIGHT SIDE -->
      <div class="payment-content">

        <router-link
          to="/my-bookings"
          class="close-button"
        >
          ×
        </router-link>

        <p class="payment-label">
          PAYMENT
        </p>

        <h2>
          Payment Details
        </h2>

        <p class="payment-subtitle">
          Pay securely with Razorpay.
        </p>


        <!-- RAZORPAY INFO -->

        <div class="razorpay-info">

          <div class="razorpay-icon">
            ₹
          </div>

          <div>

            <strong>
              Razorpay Secure Checkout
            </strong>

            <p>
              UPI, QR, Cards and other supported
              payment methods.
            </p>

          </div>

        </div>


        <!-- ERROR -->

        <div
          v-if="error"
          class="error"
        >
          {{ error }}
        </div>


        <!-- SUCCESS -->

        <div
          v-if="message"
          class="success"
        >
          {{ message }}
        </div>


        <!-- PAY BUTTON -->

        <button
          class="pay-button"
          :disabled="loading"
          @click="startPayment"
        >

          {{
            loading
              ? 'Processing...'
              : `Pay ₹${totalAmount}`
          }}

        </button>


        <p class="secure-text">
          🔒 Secure payment powered by Razorpay
        </p>

      </div>

    </div>

  </div>
</template>


<script setup>

import { ref } from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'


const route = useRoute()
const router = useRouter()


const loading = ref(false)
const error = ref('')
const message = ref('')


/*
  Get booking details
  from Booking.vue
*/

const bikeId =
  route.query.bikeId || ''


const bikeName =
  route.query.bikeName ||
  'Your Selected Bike'


/*
  PICKUP LOCATION
*/

const pickupLocation =
  route.query.pickupLocation ||
  route.query.location ||
  'Delhi'


/*
  DROP-OFF LOCATION
*/

const dropoffLocation =
  route.query.dropoffLocation ||
  pickupLocation


const startDate =
  route.query.startDate ||
  ''


const endDate =
  route.query.endDate ||
  ''


const totalAmount =
  Number(route.query.amount) || 0



/*
  START PAYMENT
*/

const startPayment = async () => {

  error.value = ''
  message.value = ''


  /*
    Check bike
  */

  if (!bikeId) {

    error.value =
      'Bike information is missing.'

    return

  }


  /*
    Check amount
  */

  if (
    !totalAmount ||
    totalAmount <= 0
  ) {

    error.value =
      'Invalid payment amount.'

    return

  }


  /*
    Check pickup location
  */

  if (!pickupLocation) {

    error.value =
      'Pickup location is missing.'

    return

  }


  /*
    Check drop-off location
  */

  if (!dropoffLocation) {

    error.value =
      'Drop-off location is missing.'

    return

  }


  /*
    Get login token
  */

  const token =
    localStorage.getItem('token')


  if (!token) {

    error.value =
      'Please login before making payment.'

    return

  }


  loading.value = true


  try {


    /*
      STEP 1
      CREATE RAZORPAY ORDER

      Amount is calculated
      by backend.
    */

    const orderResponse =
      await fetch(
        'http://localhost:4000/api/payments/create-order',
        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

            'Authorization':
              `Bearer ${token}`

          },

          body: JSON.stringify({

            bikeId,

            startDate,

            endDate,

            pickupLocation,

            dropoffLocation

          })

        }
      )


    const orderData =
      await orderResponse.json()


    if (!orderResponse.ok) {

      throw new Error(

        orderData.message ||
        'Unable to create payment order'

      )

    }


    const order =
      orderData.order



    /*
      STEP 2
      CHECK RAZORPAY CHECKOUT
    */

    if (!window.Razorpay) {

      throw new Error(
        'Razorpay Checkout could not be loaded.'
      )

    }



    /*
      STEP 3
      RAZORPAY CHECKOUT OPTIONS
    */

    const options = {

      key:
        import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount:
        order.amount,

      currency:
        order.currency,

      name:
        'RideOn',

      description:
        `Bike rental - ${bikeName}`,

      order_id:
        order.id,


      theme: {

        color:
          '#2563eb'

      },


      /*
        Razorpay payment successful.

        Now send payment details
        to backend for verification.
      */

      handler:
        async function (response) {

          try {


            /*
              STEP 4
              VERIFY PAYMENT
            */

            const verifyResponse =
              await fetch(
                'http://localhost:4000/api/payments/verify',
                {

                  method: 'POST',

                  headers: {

                    'Content-Type':
                      'application/json',

                    'Authorization':
                      `Bearer ${token}`

                  },

                  body: JSON.stringify({

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature

                  })

                }
              )


            const verifyData =
              await verifyResponse.json()


            if (!verifyResponse.ok) {

              throw new Error(

                verifyData.message ||
                'Payment verification failed'

              )

            }


            /*
              PAYMENT SUCCESS
            */

            message.value =
              'Payment successful! Booking confirmed.'


            loading.value = false


            /*
              Go to My Bookings
            */

            setTimeout(() => {

              router.push(
                '/my-bookings'
              )

            }, 1200)


          } catch (err) {

            console.error(err)


            error.value =
              err.message ||
              'Payment verification failed.'


            loading.value = false

          }

        },


      /*
        User closes Razorpay popup
      */

      modal: {

        ondismiss: function () {

          loading.value = false

        }

      }

    }



    /*
      STEP 5
      OPEN RAZORPAY
    */

    const razorpay =
      new window.Razorpay(options)


    razorpay.open()


  } catch (err) {

    console.error(err)


    error.value =
      err.message ||
      'Payment could not be started.'


    loading.value = false

  }

}

</script>


<style scoped>

.payment-page {

  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 40px 20px;

  position: relative;

  background-image:
    url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2000&q=85');

  background-size: cover;

  background-position: center;

  background-attachment: fixed;

}


.overlay {

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(5, 10, 20, 0.92),
      rgba(5, 10, 20, 0.72)
    );

}


.payment-box {

  width: 100%;

  max-width: 1100px;

  min-height: 600px;

  display: grid;

  grid-template-columns: 1fr 1fr;

  position: relative;

  z-index: 2;

  overflow: hidden;

  border-radius: 24px;

  background: rgba(15, 23, 42, 0.96);

  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.45);

}


/* LEFT */

.payment-summary {

  padding: 60px;

  display: flex;

  flex-direction: column;

  justify-content: center;

  background:
    linear-gradient(
      145deg,
      #0f172a,
      #111827
    );

  color: white;

}


.summary-label {

  color: #60a5fa;

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 4px;

  margin-bottom: 20px;

}


.payment-summary h1 {

  font-size: 46px;

  line-height: 1.1;

  margin: 0 0 20px;

  font-weight: 800;

}


.payment-summary h1 span {

  display: block;

  color: #60a5fa;

}


.summary-text {

  color: #cbd5e1;

  line-height: 1.7;

  margin-bottom: 35px;

  max-width: 420px;

}


.summary-card {

  background: rgba(255, 255, 255, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 16px;

  padding: 20px;

}


.summary-row {

  display: flex;

  justify-content: space-between;

  gap: 20px;

  padding: 13px 0;

  border-bottom:
    1px solid rgba(255, 255, 255, 0.08);

}


.summary-row:last-child {

  border-bottom: none;

}


.summary-row span {

  color: #94a3b8;

  font-size: 14px;

}


.summary-row strong {

  color: white;

  font-size: 14px;

  text-align: right;

  max-width: 65%;

  word-break: break-word;

}


.total-box {

  margin-top: 25px;

  padding: 22px;

  border-radius: 16px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  background:
    linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
    );

}


.total-box span {

  font-size: 15px;

  color: #dbeafe;

}


.total-box strong {

  font-size: 28px;

  color: white;

}


/* RIGHT */

.payment-content {

  position: relative;

  padding: 60px;

  background: #f8fafc;

  display: flex;

  flex-direction: column;

  justify-content: center;

}


.close-button {

  position: absolute;

  top: 25px;

  right: 30px;

  width: 38px;

  height: 38px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  text-decoration: none;

  color: #64748b;

  background: #e2e8f0;

  font-size: 24px;

  transition: 0.2s;

}


.close-button:hover {

  background: #2563eb;

  color: white;

}


.payment-label {

  color: #2563eb;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 3px;

  margin-bottom: 10px;

}


.payment-content h2 {

  margin: 0;

  font-size: 34px;

  color: #0f172a;

}


.payment-subtitle {

  color: #64748b;

  margin-top: 10px;

  margin-bottom: 30px;

}


/* RAZORPAY CARD */

.razorpay-info {

  display: flex;

  align-items: center;

  gap: 15px;

  padding: 20px;

  border-radius: 16px;

  background: white;

  border: 1px solid #e2e8f0;

  margin-bottom: 25px;

  box-shadow:
    0 8px 25px rgba(15, 23, 42, 0.06);

}


.razorpay-icon {

  width: 50px;

  height: 50px;

  flex-shrink: 0;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #2563eb;

  color: white;

  font-size: 24px;

  font-weight: 800;

}


.razorpay-info strong {

  display: block;

  color: #0f172a;

  margin-bottom: 5px;

}


.razorpay-info p {

  margin: 0;

  color: #64748b;

  font-size: 13px;

  line-height: 1.5;

}


/* ERROR */

.error {

  padding: 13px 15px;

  border-radius: 10px;

  margin-bottom: 15px;

  color: #b91c1c;

  background: #fee2e2;

  border: 1px solid #fecaca;

  font-size: 14px;

}


/* SUCCESS */

.success {

  padding: 13px 15px;

  border-radius: 10px;

  margin-bottom: 15px;

  color: #166534;

  background: #dcfce7;

  border: 1px solid #bbf7d0;

  font-size: 14px;

}


/* BUTTON */

.pay-button {

  width: 100%;

  border: none;

  border-radius: 12px;

  padding: 16px;

  background: #2563eb;

  color: white;

  font-size: 16px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;

}


.pay-button:hover:not(:disabled) {

  background: #1d4ed8;

  transform: translateY(-1px);

}


.pay-button:disabled {

  opacity: 0.65;

  cursor: not-allowed;

}


.secure-text {

  text-align: center;

  color: #64748b;

  font-size: 12px;

  margin-top: 20px;

}


/* RESPONSIVE */

@media (max-width: 850px) {

  .payment-box {

    grid-template-columns: 1fr;

  }

  .payment-summary {

    padding: 40px 30px;

  }

  .payment-content {

    padding: 40px 30px;

  }

  .payment-summary h1 {

    font-size: 38px;

  }

}


@media (max-width: 500px) {

  .payment-page {

    padding: 20px 10px;

  }

  .payment-summary {

    padding: 30px 20px;

  }

  .payment-content {

    padding: 35px 20px;

  }

  .summary-row {

    flex-direction: column;

    gap: 5px;

  }

  .summary-row strong {

    text-align: left;

    max-width: 100%;

  }

  .total-box {

    flex-direction: column;

    align-items: flex-start;

    gap: 8px;

  }

}

</style>