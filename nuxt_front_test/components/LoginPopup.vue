<template>
  <b-modal
    visible
    centered
    no-close-on-backdrop
    no-close-on-esc
    hide-header
    hide-footer
    size="sm"
  >
    <h3 class="login-text">Hello gamer</h3>
    <p class="login-text">Connecte toi avec ton compte 42.</p>
    <b-button block size="lg" class="mb-2 button-42" variant="dark" :href="loginUri">
      <img src="/42_logo.svg" class="logo-42" alt="logo-42"> Connection
    </b-button>
  </b-modal>
</template>

<script>

export default {
  name: "LoginPopup",

  computed: {
    loginUri() {
      return 'https://api.intra.42.fr/oauth/authorize?client_id=19e5ab89328bbc134e124cc4611ecc7c3fd0d88176bd38eda6e7ee23d649df3b&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fauthentication%2Foauth&response_type=code'
    }
  }
};
</script>

<style scoped>

.login-text {
  text-align: center;
}

.logo-42 {
  width: 32px;
}

</style>