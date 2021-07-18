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
    <h3 class="login-text">OK you're logged !
    </h3>
    <h3 class="login-text">
      <b-badge
        :href="`https://profile.intra.42.fr/users/${user.name}`"
        variant="dark"
        class="badge"
      >
		    <img src="/42_logo.svg" class="logo-42" alt="logo-42">
		    {{user.name}}
	    </b-badge>
	  </h3>
  </b-modal>
</template>

<script>

export default {
  name: "LoggedPopup",

  props: {
    user: {
      type: Object,
      required: true
    }
  },
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