<template>
  <nav class="navbar">

    <!-- Logo -->
    <router-link to="/" class="logo">
      RIDE<span>ON</span>
    </router-link>

    <!-- Navigation -->
    <div class="nav-links">

      <router-link to="/signup">
        Signup
      </router-link>

      <router-link to="/login">
        Login
      </router-link>

      <router-link to="/">
        Home
      </router-link>

      <router-link to="/bikes">
        Bikes
      </router-link>

      <router-link to="/my-bookings">
        My Bookings
      </router-link>

    </div>

    <!-- Mobile Menu Button -->
    <button class="menu-button">
      ☰
    </button>

  </nav>
</template>


<style scoped>

.navbar {
  height: 72px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 45px;

  background: #151515;

  border-bottom: 1px solid #2f2f2f;

  color: white;

  position: relative;
  z-index: 100;
}


/* LOGO */

.logo {
  text-decoration: none;

  color: white;

  font-size: 28px;

  font-weight: 900;

  letter-spacing: -1px;
}

.logo span {
  color: #e5e5e5;
}


/* NAVIGATION */

.nav-links {
  display: flex;

  align-items: center;

  gap: 38px;
}

.nav-links a {
  position: relative;

  color: #eeeeee;

  text-decoration: none;

  font-size: 14px;

  font-weight: 500;

  text-transform: uppercase;

  letter-spacing: 0.5px;

  transition: color 0.25s ease;
}


/* HOVER */

.nav-links a:hover {
  color: white;
}


/* ACTIVE LINK */

.nav-links a.router-link-active {
  color: white;
}


/* ACTIVE UNDERLINE */

.nav-links a.router-link-active::after {
  content: '';

  position: absolute;

  left: 0;
  right: 0;

  bottom: -9px;

  height: 2px;

  background: #ffffff;
}


/* MOBILE BUTTON */

.menu-button {
  display: none;

  border: none;

  background: transparent;

  color: white;

  font-size: 25px;

  cursor: pointer;
}


/* TABLET */

@media (max-width: 800px) {

  .navbar {
    padding: 0 25px;
  }

  .nav-links {
    gap: 20px;
  }

}


/* MOBILE */

@media (max-width: 600px) {

  .navbar {
    height: 65px;

    padding: 0 20px;
  }

  .logo {
    font-size: 24px;
  }

  .nav-links {
    display: none;
  }

  .menu-button {
    display: block;
  }

}

</style>