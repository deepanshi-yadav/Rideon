<template>
  <div class="auth-page">

    <div class="overlay"></div>

    <div class="auth-box">

      <router-link to="/" class="close-button">
        ×
      </router-link>

      <div class="auth-content">

        <p class="auth-label">RIDEON</p>

        <h1>Create Account</h1>

        <p class="auth-subtitle">
          Create your account and start your journey.
        </p>

        <form @submit.prevent="registerUser">

          <div class="form-group">
            <label>Name</label>

            <input
              v-model="name"
              type="text"
              placeholder="Enter your name"
              required
            />
          </div>

          <div class="form-group">
            <label>Email</label>

            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label>Phone</label>

            <input
              v-model="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>

            <input
              v-model="password"
              type="password"
              placeholder="Create a password"
              required
            />
          </div>

          <p v-if="error" class="error">
            {{ error }}
          </p>

          <p v-if="success" class="success">
            {{ success }}
          </p>

          <button
            type="submit"
            class="auth-button"
            :disabled="loading"
          >
            {{ loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
          </button>

        </form>

        <div class="switch-link">
          <span>Already have an account?</span>

          <router-link to="/login">
            LOGIN
          </router-link>
        </div>

      </div>

    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')

const error = ref('')
const success = ref('')
const loading = ref(false)

const registerUser = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    const response = await fetch(
      'http://localhost:4000/api/users/register',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          name: name.value,
          email: email.value,
          phone: phone.value,
          password: password.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || 'Registration failed'
      )
    }

    success.value =
      'Account created successfully!'

    setTimeout(() => {
      router.push('/login')
    }, 1200)

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>

.auth-page {
  min-height: calc(100vh - 72px);

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 45px 20px;

  background-image:
    url('https://images.unsplash.com/photo-1558981806-ec527fa84c39');

  background-size: cover;
  background-position: center;
}


/* OVERLAY */

.overlay {
  position: absolute;

  inset: 0;

  background: rgba(0, 0, 0, 0.62);
}


/* AUTH BOX */

.auth-box {
  position: relative;

  z-index: 2;

  width: 100%;

  max-width: 440px;

  background:
    linear-gradient(
      135deg,
      #111827,
      #1f2937
    );

  border: 1px solid #374151;

  box-shadow:
    0 20px 60px
    rgba(0, 0, 0, 0.55);

  border-radius: 12px;
}


/* CLOSE BUTTON */

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


/* CONTENT */

.auth-content {
  padding: 40px 34px 32px;
}


/* RIDEON */

.auth-label {
  margin: 0 0 8px;

  color: white;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 3px;
}


/* HEADING */

.auth-content h1 {
  margin: 0 0 8px;

  color: white;

  font-size: 30px;

  font-weight: 700;
}


/* SUBTITLE */

.auth-subtitle {
  margin: 0 0 25px;

  color: #d1d5db;

  font-size: 14px;
}


/* FORM */

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  color: white;

  font-size: 13px;
}


/* INPUT */

.form-group input {
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

.form-group input:focus {
  border-color: #60a5fa;

  background: #243247;
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


/* SUCCESS */

.success {
  padding: 10px;

  margin: 0 0 14px;

  background: #183522;

  border: 1px solid #356b46;

  color: #a7e6b8;

  font-size: 13px;

  border-radius: 6px;
}


/* BUTTON */

.auth-button {
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

.auth-button:hover {
  background: #3b82f6;

  transform: translateY(-2px);
}

.auth-button:disabled {
  opacity: 0.6;

  cursor: not-allowed;

  transform: none;
}


/* LOGIN LINK */

.switch-link {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 7px;

  margin-top: 22px;

  color: #d1d5db;

  font-size: 13px;
}

.switch-link a {
  color: #60a5fa;

  font-weight: 700;

  text-decoration: none;
}

.switch-link a:hover {
  color: #93c5fd;

  text-decoration: underline;
}


/* MOBILE */

@media (max-width: 500px) {

  .auth-page {
    padding: 30px 15px;
  }

  .auth-content {
    padding: 35px 24px 28px;
  }

  .auth-content h1 {
    font-size: 27px;
  }

}

</style>