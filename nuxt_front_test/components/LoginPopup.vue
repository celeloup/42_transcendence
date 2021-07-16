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
      return `#`
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